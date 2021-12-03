import { NextApiRequest } from "next";

export type ObjectType<T> = Function & { new (): T };

export type Handler<Req, Res> = (req: Req, res: Res) => Promise<any> | any;

export type NextHandler = (err?: any) => void;

export type ErrorHandler<Req, Res> = (
  err: any,
  req: Req,
  res: Res,
  next: NextHandler
) => Promise<any> | any;

export type Middleware<Req, Res> = (
  req: Req,
  res: Res,
  next: NextHandler
) => Promise<any> | any;

export type HttpVerb =
  | "GET"
  | "POST"
  | "PUT"
  | "DELETE"
  | "PATCH"
  | "HEAD"
  | "OPTIONS";

export type NextApiRequestWithParams = NextApiRequest & {
  params: Record<string, string>;
};
