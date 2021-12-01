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

      const user = req.user;
      return repo.search({
        ...options,
        query: {
          user,
        },
      });
    },
    getById: (repo, req) => {
      const user = req.user;
      const id = req.params.id;
      return repo.findOne({ id, user });
    },
    create: (repo, req) => {
      const user = req.user;
      const data = req.body;

      if (Array.isArray(data)) {
        data.forEach((item) => (item.user = user));
        return repo.createMany(data);
      }

      return repo.create({ ...data, user });
    },
    update: (repo, req) => {
      const user = req.user;
      const id = req.params.id;
      const data = req.body;
      return repo.update(id, { ...data, user });
    },
    partialUpdate: (repo, req) => {
      const user = req.user;
      const id = req.params.id;
      const data = req.body;
      return repo.partialUpdate(id, { ...data, user });
    },
    delete: (repo, req) => {
      const user = req.user;
      const id = req.params.id;
      return repo.delete(id);
    },
    customEndpoints: {
      get: {
        "/hello": () => "Hello world",
        "/hello/:name": (_, req) => `Hello ${req.params.name}`,
      },
    },
  }
);
