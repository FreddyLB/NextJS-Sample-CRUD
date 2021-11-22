import { NextApiRequest, NextApiResponse } from "next";
import { Middleware } from "next-connect";
import { connectMongoDb } from "./connectMongoDb";

// prettier-ignore
/**
 * A middleware to connect to the MongoDB database.
 * @returns {Middleware} A mongodb connection middleware.
 */
export function mongodb() : Middleware<NextApiRequest, NextApiResponse> {
  return async (_req, _res, next) => {
    await connectMongoDb();
    next();
  }
}