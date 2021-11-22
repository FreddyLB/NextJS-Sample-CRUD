import { IRepository, PageResult } from "@lib/repositories/base/repository";
import { getPagination } from "@lib/repositories/helper";
import { isPromise } from "@lib/utils/isPromise";
import { NextApiRequest, NextApiResponse } from "next";
import { ErrorHandler, NextConnect, RequestHandler } from "next-connect";

import withRoutes from "./withRoutes";

const DEFAULT_BASE_PATH = "/api";

type NextApiRequestWithParams = NextApiRequest & {
  params: Record<string, string>;
};

type RestEndpoint<TEntity, TKey, TReturn> = (
  repository: IRepository<TEntity, TKey>,
  req: NextApiRequestWithParams,
  res: NextApiResponse
) => Promise<TReturn> | TReturn;

type RouteRestEndPoint<T, TKey> = Record<string, RestEndpoint<T, TKey, any>>;

type ApiRouter = (
  path: string,
  handler: RequestHandler<NextApiRequestWithParams, NextApiResponse>
) => Promise<any> | any;

export interface CrudConfig<T, TKey> {
  route: string;
  baseRoute?: string;
  customEndpoints?: CustomApiEndpoints<T, TKey>;
  onError?: ErrorHandler<NextApiRequest, NextApiResponse>;
  getAll?: RestEndpoint<T, TKey, PageResult<T>> | null;
  getById?: RestEndpoint<T, TKey, T> | null;
  create?: RestEndpoint<T, TKey, T> | null;
  update?: RestEndpoint<T, TKey, T> | null;
  delete?: RestEndpoint<T, TKey, T> | null;
}

export interface CustomApiEndpoints<T, TKey> {
  get?: RouteRestEndPoint<T, TKey>;
  post?: RouteRestEndPoint<T, TKey>;
  put?: RouteRestEndPoint<T, TKey>;
  delete?: RouteRestEndPoint<T, TKey>;
  patch?: RouteRestEndPoint<T, TKey>;
  options?: RouteRestEndPoint<T, TKey>;
  all?: RouteRestEndPoint<T, TKey>;
}

export function withRestApi<
  TEntity,
  TKey,
  TRepo extends IRepository<TEntity, TKey>
>(repository: TRepo, config: CrudConfig<TEntity, TKey>) {
  config.customEndpoints = config.customEndpoints || {};
  const basePath = config.baseRoute || DEFAULT_BASE_PATH;

  validateRoutePath(basePath);
  validateRoutePath(config.route);

  const path = `${basePath}${config.route}`;
  let router = withRoutes({ attachParams: true, onError: config.onError });

  // First set custom routes
  setupCustomRoutes(config, router, path, repository);

  // GetAll
  if (config.getAll !== null) {
    const handler = config.getAll! || getAllEndpoint();
    router.get(path, (req, res) => handler(repository, req, res));
  }

  // GetById
  if (config.getById !== null) {
    const handler = config.getById! || getByIdEndpoint();
    router.get(path + `/:id`, (req, res) => handler(repository, req, res));
  }

  // Create
  if (config.create !== null) {
    const handler = config.create! || createEndpoint();
    router.post(path, (req, res) => handler(repository, req, res));
  }

  // Update
  if (config.update !== null) {
    const handler = config.update! || updateEndpoint();
    router.put(path + `/:id`, (req, res) => handler(repository, req, res));
  }

  // Delete
  if (config.delete !== null) {
    const handler = config.delete! || deleteEndpoint();
    router.delete(path + `/:id`, (req, res) => handler(repository, req, res));
  }

  return router;
}

function setupCustomRoutes(
  config: CrudConfig<any, any>,
  router: NextConnect<NextApiRequestWithParams, NextApiResponse<any>>,
  path: string,
  repository: IRepository<any, any>
) {
  const validMethods = [
    "get",
    "post",
    "put",
    "delete",
    "patch",
    "options",
    "all",
  ];

  for (const method in config.customEndpoints) {
    if (!validMethods.includes(method)) {
      throw new Error(`Invalid method: '${method}'`);
    }

    const key = method as keyof CustomApiEndpoints<any, any>;
    const routes = config.customEndpoints[key];

    if (routes != null) {
      for (const route in routes) {
        const endpoint = routes[route];

        if (endpoint != null) {
          let routeHandler: ApiRouter;

          switch (method) {
            case "get":
              routeHandler = router.get;
              break;
            case "post":
              routeHandler = router.post;
              break;
            case "put":
              routeHandler = router.put;
              break;
            case "delete":
              routeHandler = router.delete;
              break;
            case "patch":
              routeHandler = router.patch;
              break;
            case "options":
              routeHandler = router.options;
              break;
            case "all":
              routeHandler = router.all;
              break;
          }

          const routePath = `${path}${route}`;
          setRouteHandler(routePath, repository, endpoint, routeHandler!);
        }
      }
    }
  }
}

function getAllEndpoint<T, TKey>(): RestEndpoint<T, TKey, void> {
  return async (repo, req, res) => {
    const pagination = getPagination(req);
    const result = await repo.findWithPagination(pagination);
    return res.json(result);
  };
}

function getByIdEndpoint<T, TKey>(): RestEndpoint<T, TKey, void> {
  return async (repo, req, res) => {
    const params = req.params || {};
    const id = getEntityId(params.id) as unknown as TKey;
    const result = await repo.findById(id);
    return res.json(result);
  };
}

function createEndpoint<T, TKey>(): RestEndpoint<T, TKey, void> {
  return async (repo, req, res) => {
    const result = await repo.create(req.body);
    return res.json(result);
  };
}

function updateEndpoint<T, TKey>(): RestEndpoint<T, TKey, void> {
  return async (repo, req, res) => {
    const params = req.params || {};
    const id = getEntityId(params.id) as unknown as TKey;
    const entityUpdate = req.body as unknown as T;
    const result = await repo.update(id, entityUpdate);
    return res.json(result);
  };
}

function deleteEndpoint<T, TKey>(): RestEndpoint<T, TKey, void> {
  return async (repo, req, res) => {
    const params = req.params || {};
    const id = getEntityId(params.id) as unknown as TKey;
    const result = await repo.delete(id);
    return res.json(result);
  };
}

function setRouteHandler(
  path: string,
  repository: IRepository<any, any>,
  endpoint: RestEndpoint<any, any, any>,
  router: ApiRouter
) {
  router(path, async (req, res) => {
    let result = endpoint(repository, req, res);

    if (isPromise(result)) {
      result = await result;
    }

    if (result === null) {
      res.status(404);
    }

    if (result != null) {
      if (typeof result === "object") {
        res.status(200).json(result);
      } else {
        res.status(200).send(result);
      }
    }

    res.end();
  });
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
