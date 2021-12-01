import { withRestApi } from "@server/core/withRestApi";
import { authMiddleware, RequestWithUser } from "@server/middlewares/auth";
import { buildPaginationOptions } from "@server/repositories/helper";
import {
  ProductRepository,
  TodoPaginationOptions,
} from "@server/repositories/product.repository";
import { IProduct } from "@shared/models/product.model";

export default withRestApi<IProduct, ProductRepository, RequestWithUser>(
  new ProductRepository(),
  {
    route: "/products",
    middlewares: [authMiddleware],
    getAll: (repo, req) => {
      const options = buildPaginationOptions<IProduct>(
        req
      ) as TodoPaginationOptions;

      if (req.query.search) {
        options.search = String(req.query.search);
      }

      return repo.search(options);
    },
    customEndpoints: {
      get: {
        "/hello": () => "Hello world",
        "/hello/:name": (_, req) => `Hello ${req.params.name}`,
      },
    },
  }
);
