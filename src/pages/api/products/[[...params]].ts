import { withRestApi } from "@server/core/withRestApi";
import { ProductRepository } from "@server/repositories/product.repository";

export default withRestApi(new ProductRepository(), {
  route: "/products",
  customEndpoints: {
    get: {
      "/hello" : () => "Hello world",
      "/hello/:name" : (_, req) => `Hello ${req.params.name}`
    },
  },
});
