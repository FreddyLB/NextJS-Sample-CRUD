import Product from "@server/database/mongodb/schemas/product.schema";
import {
  ProductDocument,
  ProductModel,
} from "@server/database/mongodb/schemas/product.types";
import { IProduct } from "@shared/models/product.model";
import { FilterQuery } from "mongoose";
import { MongoRepository } from "./base/mongo.repository";
import { IRepository, PageResult, PaginationOptions } from "./base/repository";

export type TodoPaginationOptions = PaginationOptions<ProductDocument> & {
  search?: string;
};

export interface ITodoRepository extends IRepository<ProductDocument> {
  search(options: TodoPaginationOptions): Promise<PageResult<ProductDocument>>;
}

// prettier-ignore
export class ProductRepository extends MongoRepository<IProduct, ProductModel> {
  constructor() {
    super(Product, ["user"]);
  }

  search(options: TodoPaginationOptions): Promise<PageResult<IProduct>> {
    if (options.search == null) {
      return this.findWithPagination(options);
    }

    const query: FilterQuery<ProductDocument> = {
      $or: [
        { name: { $regex: options.search, $options: "i" } },
      ],
    };

    // SAFETY: Merge the search query with the existing query
    const newOptions = { query, ...options };
    return this.findWithPagination(newOptions);
  }
}
