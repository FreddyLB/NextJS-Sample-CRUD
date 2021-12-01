import { mongodb } from "@server/database/mongodb/middleware";
import morgan from "morgan";
import { IRepository, PageResult } from "@server/repositories/base/repository";
import { buildPaginationOptions } from "@server/repositories/helper";
import { NextApiResponse } from "next";
import { ErrorHandler, Middleware } from "next-connect";
import withApiRoutes, {
  RouteController,
  NextApiRequestWithParams,
  NextConnectRoute,
} from "./withApiRoutes";

const DEFAULT_BASE_PATH = "/api";
const DEFAULT_ID_NAME = "id";

type RestEndpoint<
  TRepo extends IRepository<TEntity>,
  TEntity,
  TReturn,
  Req extends NextApiRequestWithParams = NextApiRequestWithParams,
  Res extends NextApiResponse = NextApiResponse
> = (repository: TRepo, req: Req, res: Res) => Promise<TReturn> | TReturn;

type RouteRestEndPoint<
  TRepo extends IRepository<TEntity>,
  TEntity,
  Req extends NextApiRequestWithParams = NextApiRequestWithParams,
  Res extends NextApiResponse = NextApiResponse
> = Record<string, RestEndpoint<TRepo, TEntity, any, Req, Res>>;

export interface NamingConventions {
  id?: string;
}

export interface RestApiConfig<
  TRepo extends IRepository<TEntity>,
  TEntity,
  Req extends NextApiRequestWithParams = NextApiRequestWithParams,
  Res extends NextApiResponse = NextApiResponse
> {
  route: string;
  baseRoute?: string;
  namingConventions?: NamingConventions;
  customEndpoints?: CustomApiEndpoints<TRepo, TEntity>;
  middlewares?: Middleware<Req, Res>[];
  onError?: ErrorHandler<Req, Res>;
  getAll?: RestEndpoint<TRepo, TEntity, PageResult<TEntity>, Req, Res> | null;
  getById?: RestEndpoint<TRepo, TEntity, TEntity | null, Req, Res> | null;
  create?: RestEndpoint<TRepo, TEntity, TEntity | TEntity[], Req, Res> | null;
  update?: RestEndpoint<TRepo, TEntity, TEntity, Req, Res> | null;
  partialUpdate?: RestEndpoint<TRepo, TEntity, TEntity, Req, Res> | null;
  delete?: RestEndpoint<TRepo, TEntity, TEntity, Req, Res> | null;
}

export interface CustomApiEndpoints<
  TRepo extends IRepository<TEntity>,
  TEntity,
  Req extends NextApiRequestWithParams = NextApiRequestWithParams,
  Res extends NextApiResponse = NextApiResponse
> {
  get?: RouteRestEndPoint<TRepo, TEntity, Req, Res>;
  post?: RouteRestEndPoint<TRepo, TEntity, Req, Res>;
  put?: RouteRestEndPoint<TRepo, TEntity, Req, Res>;
  delete?: RouteRestEndPoint<TRepo, TEntity, Req, Res>;
  patch?: RouteRestEndPoint<TRepo, TEntity, Req, Res>;
  options?: RouteRestEndPoint<TRepo, TEntity, Req, Res>;
  trace?: RouteRestEndPoint<TRepo, TEntity, Req, Res>;
  head?: RouteRestEndPoint<TRepo, TEntity, Req, Res>;
  all?: RouteRestEndPoint<TRepo, TEntity, Req, Res>;
}

// prettier-ignore
export function withRestApi<TEntity, TRepo extends IRepository<TEntity>,
Req extends NextApiRequestWithParams = NextApiRequestWithParams,
Res extends NextApiResponse = NextApiResponse>(
  repository: TRepo,
  config: RestApiConfig<TRepo, TEntity, Req, Res>
) {
  config.customEndpoints = config.customEndpoints || {};
  config.namingConventions = config.namingConventions || {};
  config.namingConventions.id = config.namingConventions.id || DEFAULT_ID_NAME;

  const basePath = config.baseRoute || DEFAULT_BASE_PATH;

  validateRoutePath(basePath);
  validateRoutePath(config.route);

  const path = `${basePath}${config.route}`;
  const controller = withApiRoutes<Req, Res>({ onError: config.onError })
    .use(mongodb())
    .use(morgan("dev"));

  if (config.middlewares) {
    config.middlewares.forEach((middleware) => controller.use(middleware));
  }

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

function createEndpoint<
  TRepo extends IRepository<TEntity>,
  TEntity,
  Req extends NextApiRequestWithParams = NextApiRequestWithParams,
  Res extends NextApiResponse = NextApiResponse
>(
  config: RestApiConfig<TRepo, TEntity, Req, Res>
): RestEndpoint<TRepo, TEntity, void, Req, Res> {
  return async (repo, req, res) => {
    const newEntity = req.body;

    if (Array.isArray(newEntity)) {
      const result = await repo.createMany(newEntity);
      return res.status(201).json(result);
    } else {
      const result = await repo.create(newEntity);
      const id = config.namingConventions!.id as keyof TEntity;
      res.setHeader("Location", `${req.url}/${result[id]}`);
      return res.status(201).json(result);
    }
  };
}

// prettier-ignore
function updateEndpoint<TRepo extends IRepository<TEntity>, TEntity>(): RestEndpoint<TRepo, TEntity, void> {
  return async (repo, req, res) => {
    const params = req.params || {};
    const id = params.id;
    const entityUpdate = req.body as unknown as TEntity;
    const result = await repo.update(id, entityUpdate);
    return res.json(result);
  };
}

// prettier-ignore
function partialUpdateEndpoint<TRepo extends IRepository<TEntity>, TEntity>(): RestEndpoint<TRepo, TEntity, void> {
  return async (repo, req, res) => {
    const params = req.params || {};
    const id = params.id;
    const entityUpdate = req.body as unknown as TEntity;
    const result = await repo.partialUpdate(id, entityUpdate);
    return res.json(result);
  };
}

// prettier-ignore
function deleteEndpoint<TRepo extends IRepository<TEntity>, TEntity>(): RestEndpoint<TRepo, TEntity, void> {
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
