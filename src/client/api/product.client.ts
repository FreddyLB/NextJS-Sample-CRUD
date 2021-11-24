import { IProduct } from "src/shared/models/product.model";
import { API_URL } from "../contants";
import { RestApiClient } from "./rest.client";

export class ProductApiClient extends RestApiClient<IProduct, string> {
  constructor() {
    super(API_URL + "/products");
  }
}
