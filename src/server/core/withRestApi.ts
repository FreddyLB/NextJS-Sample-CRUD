import { mongodb } from "@server/database/mongodb/middleware";
import morgan from "morgan";
import { IRepository, PageResult } from "@server/repositories/base/repository";
import { buildPaginationOptions } from "@server/repositories/helper";
import { NextApiRequest, NextApiResponse } from "next";
import { ErrorHandler } from "next-connect";
import withApiRoutes, {
  RouteController,
  NextApiRequestWithParams,
  NextConnectRoute,
} from "./withApiRoutes";

const DEFAULT_BASE_PATH = "/api";
const DEFAULT_ID_NAME = "id";

type RestEndpoint<TRepo extends IRepository<TEntity>, TEntity, TReturn> = (
  repository: TRepo,
  req: NextApiRequestWithParams,
  res: NextApiResponse
) => Promise<TReturn> | TReturn;

type RouteRestEndPoint<TRepo extends IRepository<T>, T> = Record<
  string,
  RestEndpoint<TRepo, T, any>
>;

export interface NamingConventions {
  id?: string;
}

export interface RestApiConfig<TRepo extends IRepository<T>, T> {
  route: string;
  baseRoute?: string;
  namingConventions?: NamingConventions;
  customEndpoints?: CustomApiEndpoints<TRepo, T>;
  onError?: ErrorHandler<NextApiRequest, NextApiResponse>;
  getAll?: RestEndpoint<TRepo, T, PageResult<T>> | null;
  getById?: RestEndpoint<TRepo, T, T | null> | null;
  create?: RestEndpoint<TRepo, T, T> | null;
  update?: RestEndpoint<TRepo, T, T> | null;
  partialUpdate?: RestEndpoint<TRepo, T, T> | null;
  delete?: RestEndpoint<TRepo, T, T> | null;
}

export interface CustomApiEndpoints<TRepo extends IRepository<T>, T> {
  get?: RouteRestEndPoint<TRepo, T>;
  post?: RouteRestEndPoint<TRepo, T>;
  put?: RouteRestEndPoint<TRepo, T>;
  delete?: RouteRestEndPoint<TRepo, T>;
  patch?: RouteRestEndPoint<TRepo, T>;
  options?: RouteRestEndPoint<TRepo, T>;
  trace?: RouteRestEndPoint<TRepo, T>;
  head?: RouteRestEndPoint<TRepo, T>;
  all?: RouteRestEndPoint<TRepo, T>;
}

// prettier-ignore
export function withRestApi<TEntity, TRepo extends IRepository<TEntity>>(
  repository: TRepo,
  config: RestApiConfig<TRepo, TEntity>
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
    const endpoint = config.customEndpoints[method as keyof CustomApiEndpoints<TRepo, TEntity>];

    if (endpoint) {
      for (const route in endpoint) {
        validateRoutePath(route);
        const restEndpoint = endpoint[route as keyof RouteRestEndPoint<TRepo, TEntity>];

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

  // Partial Update
  if (config.partialUpdate !== null) {
    const handler = config.partialUpdate! || partialUpdateEndpoint();
    controller.patch(`${path}/:id`, (req, res) => handler(repository, req, res));
  }

  // Delete
  if (config.delete !== null) {
    const handler = config.delete! || deleteEndpoint();
    controller.delete(`${path}/:id`, (req, res) => handler(repository, req, res));
  }

  return controller;
}

// prettier-ignore
function getAllEndpoint<TRepo extends IRepository<T>, T>(): RestEndpoint<TRepo, T, void> {
  return async (repo, req, res) => {
    const options = buildPaginationOptions(req);
    const result = await repo.findWithPagination(options);
    return res.json(result);
  };
}

// prettier-ignore
function getByIdEndpoint<TRepo extends IRepository<T>, T>(): RestEndpoint<TRepo, T, void> {
  return async (repo, req, res) => {
    const params = req.params || {};
    const id = params.id;
    const result = await repo.findById(id);
    return res.json(result);
  };
}

// prettier-ignore
function createEndpoint<TRepo extends IRepository<T>, T, TKey>(config: RestApiConfig<TRepo, T>): RestEndpoint<TRepo, T, void> {
  return async (repo, req, res) => {
    const result = await repo.create(req.body);
    const id = config.namingConventions!.id as keyof T;
    res.setHeader("Location", `${req.url}/${result[id]}`);
    return res.status(201).json(result);
  };
}

// prettier-ignore
function updateEndpoint<TRepo extends IRepository<T>, T>(): RestEndpoint<TRepo, T, void> {
  return async (repo, req, res) => {
    const params = req.params || {};
    const id = params.id;
    const entityUpdate = req.body as unknown as T;
    const result = await repo.update(id, entityUpdate);
    return res.json(result);
  };
}

// prettier-ignore
function partialUpdateEndpoint<TRepo extends IRepository<T>, T>(): RestEndpoint<TRepo, T, void> {
  return async (repo, req, res) => {
    const params = req.params || {};
    const id = params.id;
    const entityUpdate = req.body as unknown as T;
    const result = await repo.partialUpdate(id, entityUpdate);
    return res.json(result);
  };
}

// prettier-ignore
function deleteEndpoint<TRepo extends IRepository<T>, T>(): RestEndpoint<TRepo, T, void> {
  return async (repo, req, res) => {
    const params = req.params || {};
    const id = params.id;
    const result = await repo.delete(id);
    return res.json(result);
  };
}

function validateRoutePath(path: string) {
  if (!path.startsWith("/")) {
    throw new Error(`Route paths must starts with '/': ${path}`);
  }
}