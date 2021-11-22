import isPromise from "@lib/utils/isPromise";
import nextConnect, {
  ErrorHandler,
  Middleware,
  NextHandler,
  RequestHandler,
} from "next-connect";
import { ValidationError } from "@lib/utils/errors";
import { NextApiRequest, NextApiResponse } from "next";

export type RequestParams = {
  [key: string]: string;
};

export type NextApiRequestWithParams = NextApiRequest & {
  params: RequestParams;
};

export type RouteHandler<Req, Res, T = any> = (
  req: Req,
  res: Res,
  next: NextHandler
) => Promise<T> | T;

export type NextConnectRoute<Req, Res> = (
  pattern: string | RegExp,
  handler: RouteHandler<Req, Res>
) => Promise<any> | any;

export type RouterConfig<Req, Res> = {
  onError?: ErrorHandler<Req, Res>;
  onNoMatch?: RequestHandler<Req, Res>;
  status404OnNull?: boolean;
  status404OnUndefined?: boolean;
};

export interface RouteController<Req, Res> {
  (req: Req, res: Res): Promise<void> | void;
  use(middleware: Middleware<Req, Res>): this;
  all(pattern: string | RegExp, handler: RouteHandler<Req, Res>): this;
  get(pattern: string | RegExp, handler: RouteHandler<Req, Res>): this;
  post(pattern: string | RegExp, handler: RouteHandler<Req, Res>): this;
  put(pattern: string | RegExp, handler: RouteHandler<Req, Res>): this;
  patch(pattern: string | RegExp, handler: RouteHandler<Req, Res>): this;
  delete(pattern: string | RegExp, handler: RouteHandler<Req, Res>): this;
  head(pattern: string | RegExp, handler: RouteHandler<Req, Res>): this;
  options(pattern: string | RegExp, handler: RouteHandler<Req, Res>): this;
  trace(pattern: string | RegExp, handler: RouteHandler<Req, Res>): this;
}

export default function withApiRoutes<
  Req = NextApiRequestWithParams,
  Res = NextApiResponse
>(config: RouterConfig<Req, Res> = {}): RouteController<Req, Res> {
  config.status404OnNull = config.status404OnNull || true;
  config.status404OnUndefined = config.status404OnUndefined || false;
  config.onError = config.onError || defaultOnError;

  const nc = nextConnect<Req, Res>({
    attachParams: true,
    onError: config.onError,
    onNoMatch: config.onNoMatch,
  });

  // prettier-ignore
  const controller = ((req: Req, res: Res) => nc(req, res)) as RouteController<Req, Res>;

  controller.use = (middleware) => {
    nc.use(middleware);
    return controller;
  };

  controller.all = addRoute(config, controller, nc.all);
  controller.get = addRoute(config, controller, nc.get);
  controller.post = addRoute(config, controller, nc.post);
  controller.put = addRoute(config, controller, nc.put);
  controller.patch = addRoute(config, controller, nc.patch);
  controller.delete = addRoute(config, controller, nc.delete);
  controller.head = addRoute(config, controller, nc.head);
  controller.options = addRoute(config, controller, nc.options);
  controller.trace = addRoute(config, controller, nc.trace);

  return controller;
}

function addRoute(
  config: RouterConfig<any, any>,
  controller: RouteController<any, any>,
  route: NextConnectRoute<any, any>
): NextConnectRoute<any, any> {
  return (pattern, handler) => {
    route(pattern, async (req, res, next) => {
      let result = handler(req, res, next);

      if (isPromise(result)) {
        result = await result;
      }

      // If the response is already sent, do nothing
      if (res.finished === true || res.writableEnded === true) {
        return;
      }

      // If the body is already set, close the stream
      if (res.body != null) {
        return res.end();
      }

      if (result === null && config.status404OnNull === true) {
        return res.status(404).end();
      }

      if (result === undefined && config.status404OnUndefined === true) {
        return res.status(404).end();
      }

      if (result != null) {
        if (typeof result === "object") {
          return res.status(200).json(result);
        } else {
          return res.status(200).end(result);
        }
      }

      // Fallback
      res.status(200).end();
    });

    return controller;
  };
}

// prettier-ignore
function defaultOnError(error: any, _req: any, res: any) {
  console.error(error);
  const message = error.message || error;

  if (error instanceof TypeError) {
    res.status(400).json({ message });
  } else if (error instanceof ValidationError) {
    res.status(400).json({ message });
  } else {
    res.status(500).json({ message });
  }

  res.end();
}
