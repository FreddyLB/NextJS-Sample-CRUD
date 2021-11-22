import { mongodb } from "@lib/database/mongodb/middleware";
import { IRepository, PageResult } from "@lib/repositories/base/repository";
import { buildPaginationOptions } from "@lib/repositories/helper";
import morgan from "morgan";
import { NextApiRequest, NextApiResponse } from "next";
import { ErrorHandler, RequestHandler } from "next-connect";
import withApiRoutes, {
  RouteController,
  NextApiRequestWithParams,
  NextConnectRoute,
} from "./withApiRoutes";

const DEFAULT_BASE_PATH = "/api";
const DEFAULT_ID_NAME = "id";

type RestEndpoint<
  TRepo extends IRepository<TEntity, TKey>,
  TEntity,
  TKey,
  TReturn
> = (
  repository: TRepo,
  req: NextApiRequestWithParams,
  res: NextApiResponse
) => Promise<TReturn> | TReturn;

type RouteRestEndPoint<TRepo extends IRepository<T, TKey>, T, TKey> = Record<
  string,
  RestEndpoint<TRepo, T, TKey, any>
>;

type ApiRouter = (
  path: string,
  handler: RequestHandler<NextApiRequestWithParams, NextApiResponse>
) => Promise<any> | any;

export interface NamingConventions {
  id?: string;
}

export interface RestApiConfig<TRepo extends IRepository<T, TKey>, T, TKey> {
  route: string;
  baseRoute?: string;
  namingConventions?: NamingConventions;
  customEndpoints?: CustomApiEndpoints<TRepo, T, TKey>;
  onError?: ErrorHandler<NextApiRequest, NextApiResponse>;
  getAll?: RestEndpoint<TRepo, T, TKey, PageResult<T>> | null;
  getById?: RestEndpoint<TRepo, T, TKey, T | null> | null;
  create?: RestEndpoint<TRepo, T, TKey, T> | null;
  update?: RestEndpoint<TRepo, T, TKey, T> | null;
  delete?: RestEndpoint<TRepo, T, TKey, T> | null;
}

export interface CustomApiEndpoints<
  TRepo extends IRepository<T, TKey>,
  T,
  TKey
> {
  get?: RouteRestEndPoint<TRepo, T, TKey>;
  post?: RouteRestEndPoint<TRepo, T, TKey>;
  put?: RouteRestEndPoint<TRepo, T, TKey>;
  delete?: RouteRestEndPoint<TRepo, T, TKey>;
  patch?: RouteRestEndPoint<TRepo, T, TKey>;
  options?: RouteRestEndPoint<TRepo, T, TKey>;
  trace?: RouteRestEndPoint<TRepo, T, TKey>;
  head?: RouteRestEndPoint<TRepo, T, TKey>;
  all?: RouteRestEndPoint<TRepo, T, TKey>;
}

// prettier-ignore
export function withRestApi<TEntity, TKey, TRepo extends IRepository<TEntity, TKey>>(
  repository: TRepo,
  config: RestApiConfig<TRepo, TEntity, TKey>
) {
  config.customEndpoints = config.customEndpoints || {};
  config.namingConventions = config.namingConventions || {};
  config.namingConventions.id = config.namingConventions.id || DEFAULT_ID_NAME;

  const basePath = config.baseRoute || DEFAULT_BASE_PATH;

  validateRoutePath(basePath);
  validateRoutePath(config.route);

  const path = `${basePath}${config.route}`;
  const controller = withApiRoutes<NextApiRequestWithParams, NextApiResponse>({ onError: config.onError })
    .use(mongodb())
    .use(morgan("dev"));

  // Configure custom endpoints
  for (const method in config.customEndpoints) {
    const endpoint = config.customEndpoints[method as keyof CustomApiEndpoints<TRepo, TEntity, TKey>];

    if (endpoint) {
      for (const route in endpoint) {
        validateRoutePath(route);
        const restEndpoint = endpoint[route as keyof RouteRestEndPoint<TRepo, TEntity, TKey>];

        if (restEndpoint != null) {
          const onRoute = controller[method as keyof RouteController<any, any>] as NextConnectRoute<any, any>;

          if (onRoute != null) {
            onRoute(`${path}${route}`, (req, res) => restEndpoint(repository, req, res));
          }
        }
      }
    }
  }

  // GetAll
  if (config.getAll !== null) {
    const handler = config.getAll! || getAllEndpoint();
    controller.get(path, (req, res) => handler(repository, req, res));
  }

  // GetById
  if (config.getById !== null) {
    const handler = config.getById! || getByIdEndpoint();
    controller.get(`${path}/:id`, (req, res) => handler(repository, req, res));
  }

  // Create
  if (config.create !== null) {
    const handler = config.create! || createEndpoint(config);
    controller.post(path, (req, res) => handler(repository, req, res));
  }

  // Update
  if (config.update !== null) {
    const handler = config.update! || updateEndpoint();
    controller.put(`${path}/:id`, (req, res) => handler(repository, req, res));
  }

  // Delete
  if (config.delete !== null) {
    const handler = config.delete! || deleteEndpoint();
    controller.delete(`${path}/:id`, (req, res) => handler(repository, req, res));
  }

  return controller;
}

// prettier-ignore
function getAllEndpoint<TRepo extends IRepository<T, TKey>, T, TKey>(): RestEndpoint<TRepo, T, TKey, void> {
  return async (repo, req, res) => {
    const options = buildPaginationOptions(req);
    const result = await repo.findWithPagination(options);
    return res.json(result);
  };
}

// prettier-ignore
function getByIdEndpoint<TRepo extends IRepository<T, TKey>, T, TKey>(): RestEndpoint<TRepo, T, TKey, void> {
  return async (repo, req, res) => {
    const params = req.params || {};
    const id = getEntityId(params.id) as unknown as TKey;
    const result = await repo.findById(id);
    return res.json(result);
  };
}

// prettier-ignore
function createEndpoint<TRepo extends IRepository<T, TKey>, T, TKey>(config: RestApiConfig<TRepo, T, TKey>): RestEndpoint<TRepo, T, TKey, void> {
  return async (repo, req, res) => {
    const result = await repo.create(req.body);
    const id = config.namingConventions!.id as keyof T;
    res.setHeader("Location", `${req.url}/${result[id]}`);
    return res.status(201).json(result);
  };
}

// prettier-ignore
function updateEndpoint<TRepo extends IRepository<T, TKey>, T, TKey>(): RestEndpoint<TRepo, T, TKey, void> {
  return async (repo, req, res) => {
    const params = req.params || {};
    const id = getEntityId(params.id) as unknown as TKey;
    const entityUpdate = req.body as unknown as T;
    const result = await repo.update(id, entityUpdate);
    return res.json(result);
  };
}

// prettier-ignore
function deleteEndpoint<TRepo extends IRepository<T, TKey>, T, TKey>(): RestEndpoint<TRepo, T, TKey, void> {
  return async (repo, req, res) => {
    const params = req.params || {};
    const id = getEntityId(params.id) as unknown as TKey;
    const result = await repo.delete(id);
    return res.json(result);
  };
}

function validateRoutePath(path: string) {
  if (!path.startsWith("/")) {
    throw new Error(`Route paths must starts with '/': ${path}`);
  }
}

function getEntityId(id: any): string | number | null | undefined {
  if (id == null) {
    return id;
  }

  if (!isNaN(Number(id))) {
    return Number(id);
  }

  return String(id);
}
