import { makeController } from "@server/decorators/makeController";
import { Get } from "@server/decorators/methods";
import { NextApiRequest, NextApiResponse } from "next";

class Handler {
  @Get("/")
  hello(req: NextApiRequest, res: NextApiResponse) {
    res.send("Adios amigo");
  }
}

export default makeController(Handler);
