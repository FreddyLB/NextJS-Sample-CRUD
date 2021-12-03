import { NextApiResponse } from "next";
import path from "path";
import {
  ErrorHandler,
  getMetadataStorage,
  Handler,
  HttpVerb,
  NextApiRequestWithParams,
  NextHandler,
  ObjectType,
  Middleware,
} from ".";
import { Path } from "path-parser";
import { ObjectUtils } from "@shared/utils/ObjectUtils";

interface RouteAction<Req, Res> {
  path: Path;
  method: HttpVerb;
  handler: Handler<Req, Res>;
  middlewares: Middleware<Req, Res>[];
}

function getBasePath() {
  const dirname = __dirname.split(path.sep);

  const idx = dirname.indexOf("api");

  if (idx === -1) {
    throw new Error(`Could not find "api/" folder`);
  }

  return "/" + dirname.slice(idx).join("/");
}

export function withController<
  Req extends NextApiRequestWithParams = NextApiRequestWithParams,
  Res extends NextApiResponse = NextApiResponse
>(target: ObjectType<any>) {
  const basePath = getBasePath();
  const controller = new target();
  const routesMap = new Map<HttpVerb, RouteAction<Req, Res>[]>();
  const metadataStore = getMetadataStorage();
  const actions = metadataStore.getActions(target);
  const allMiddlewares = metadataStore.getMiddlewares(target);
  const controllerMiddlewares = allMiddlewares
    .filter((m) => m.methodName == null)
    .map((m) => m.handler);

  for (const action of actions) {
    const pattern = action.pattern || "/";

    if (!pattern.startsWith("/")) {
      throw new Error(`Route pattern must start with "/": ${pattern}`);
    }

    const routesMiddleware = allMiddlewares
      .filter((m) => m.methodName != null && m.methodName !== action.methodName)
      .map((m) => m.handler);

    // prettier-ignore
    const method = ObjectUtils.getValue<Handler<Req, Res>>(controller, action.methodName);
    const routes = routesMap.get(action.method);
    const routeAction = {
      path: new Path(basePath + pattern),
      method: action.method,
      handler: method,
      middlewares: routesMiddleware,
    };

    if (routes) {
      routes.push(routeAction);
    } else {
      routesMap.set(action.method, [routeAction]);
    }
  }

  return async function (req: Req, res: Res) {
    const url = req.url || "/";
    const routes = routesMap.get(req.method as HttpVerb) || [];

    // prettier-ignore
    const errorHandler = metadataStore.getErrorHandler(target) as ErrorHandler<Req, Res> | undefined;
    const onError = errorHandler ?? defaultErrorHandler;
    let done = false;

    const next = (err?: any) => {
      done = true;

      if (err) {
        return onError(err, req, res, next);
      }
    };

    const runMiddlewares = async (middlewares: Middleware<Req, Res>[]) => {
      for (const middleware of middlewares) {
        await middleware(req, res, next);

        if (!done) {
          return false;
        }
      }

      return true;
    };

    if (!(await runMiddlewares(controllerMiddlewares))) {
      return res.end();
    }

    for (const route of routes) {
      const match = route.path.test(url);

      if (route.method !== req.method || !match) {
        continue;
      }

      // Attach params
      req.params = match;

      if (!(await runMiddlewares(route.middlewares))) {
        return res.end();
      }

      try {
        return await handleRequest(route, req, res);
      } catch (err: any) {
        next(err);
      }
    }

    // Not found
    return res.status(404);
  };
}

async function handleRequest<
  Req extends NextApiRequestWithParams,
  Res extends NextApiResponse
>(route: RouteAction<Req, Res>, req: Req, res: Res) {
  const result = await route.handler(req, res);

  // A response was already written
  if (res.writableEnded) {
    return;
  }

  if (result === null) {
    return res.status(404).end();
  }

  if (result != null) {
    if (typeof result === "object" || Array.isArray(result)) {
      return res.json(result);
    }

    return res.send(result);
  }

  // Fallback
  return res.status(200);
}

function defaultErrorHandler<
  Req extends NextApiRequestWithParams,
  Res extends NextApiResponse
>(err: any, _: Req, res: Res, next: NextHandler) {
  console.error(err);

  res.status(500).json({
    message: err.message || "Internal Server Error",
  });

  next();
}
