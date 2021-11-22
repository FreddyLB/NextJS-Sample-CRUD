import { withRestApi } from "@lib/core/withRestApi";
import { ProductRepository } from "@lib/repositories/product.repository";

export default withRestApi(new ProductRepository(), {
  route: "/products",
  customEndpoints: {
    get: {
      "/hello" : () => "Hello world",
      "/hello/:name" : (_, req) => `Hello ${req.params.name}`
    },
  },
});
