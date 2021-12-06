import { Get, NextApiContext, withController } from "next-controllers";

class HelloController {
  @Get("/")
  sayHello() {
    return "Hello World!";
  }

  @Get("/:name")
  sayHelloTo({ request }: NextApiContext) {
    return `Hello ${request.params.name}!`;
  }
}

export default withController(HelloController);