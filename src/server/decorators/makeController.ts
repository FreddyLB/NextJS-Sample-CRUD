import { NextApiRequest, NextApiResponse } from "next";
import { ObjectType } from ".";

export function makeController<T>(target: ObjectType<T>) {
  const controller = new target();

  return function (req: NextApiRequest, res: NextApiResponse) {
      
  };
}
