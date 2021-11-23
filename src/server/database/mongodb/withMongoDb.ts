import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { connectMongoDb } from "./connectMongoDb";

export default function withMongoDb<T>(handler: NextApiHandler<T>) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    await connectMongoDb();
    return handler(req, res);
  };
}
