import { PageResult } from "@server/repositories/base/repository";
import { AxiosRequestConfig } from "axios";
import { IProduct } from "src/shared/models/product.model";
import { API_URL } from "../contants";
import { QueryOptions, RestApiClient } from "./rest.client";

export type SearchQueryOptions = QueryOptions & {
  search: string;
};

interface IProductApiClient extends RestApiClient<IProduct, string> {
  search(
    options: SearchQueryOptions,
    config: AxiosRequestConfig<IProduct>
  ): Promise<PageResult<IProduct>>;
}

export class ProductApiClient
  extends RestApiClient<IProduct, string>
  implements IProductApiClient
{
  constructor() {
    super(API_URL + "/products");
  }

  async search(
    options: SearchQueryOptions,
    config?: AxiosRequestConfig<IProduct>
  ): Promise<PageResult<IProduct>> {
    const searchString = options.search.trim();
    const page = options.page || 1;
    const pageSize = options.pageSize || 10;
    const search = searchString.length > 0 ? searchString : undefined;

    const result = await this.client.get<PageResult<IProduct>>(`/`, {
      ...config,
      params: {
        page,
        pageSize,
        search,
      },
    });

    return result.data;
  }
}
