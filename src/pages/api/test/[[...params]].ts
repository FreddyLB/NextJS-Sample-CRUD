import { NextApiRequestWithParams } from "@server/core/withApiRoutes";
import { Get, withController, UseMiddleware } from "@server/decorators";
import morgan from "morgan";
import { NextApiRequest } from "next";

@UseMiddleware(morgan("dev"))
class HelloController {
  @Get("/")
  sayHello() {
    return "Hello World";
  }

  @Get("/:name")
  sayHelloTo(req: NextApiRequestWithParams) {
    return `Hello ${req.params.name}`;
  }
}

export default withController(HelloController);
