import Product from "@server/database/mongodb/schemas/product.schema";
import { ProductDocument, ProductModel } from "@server/database/mongodb/schemas/product.types";

import { MongoRepository } from "./base/mongo.repository";

// prettier-ignore
export class ProductRepository extends MongoRepository<ProductDocument, ProductModel> {
  constructor() {
    super(Product);
  }
}
