import { PageResult } from "@server/repositories/base/repository";
import axios, { Axios, AxiosRequestConfig } from "axios";

export interface QueryOptions {
  page?: number;
  pageSize?: number;
}

export class RestApiClient<T, TKey> {
  public readonly client: Axios;

  constructor(baseURL: string, config?: AxiosRequestConfig<T>) {
    this.client = axios.create({
      ...config,
      baseURL,
    });
  }

  async getAll(config?: AxiosRequestConfig<T>): Promise<PageResult<T>> {
    const result = await this.client.get<PageResult<T>>(`/`, config);
    return result.data;
  }

  async getAllQuery(
    options: QueryOptions = {},
    config?: AxiosRequestConfig<T>
  ): Promise<PageResult<T>> {
    const page = options.page || 1;
    const pageSize = options.pageSize || 10;

    const result = await this.client.get<PageResult<T>>(`/`, {
      ...config,
      params: {
        page,
        pageSize,
      },
    });

    return result.data;
  }

  async getById(id: TKey, config?: AxiosRequestConfig<T>): Promise<T> {
    const result = await this.client.get(`/${id}`, config);
    return result.data;
  }

  async create(item: Partial<T>, config?: AxiosRequestConfig<T>): Promise<T> {
    const result = await this.client.post(`/`, item, config);
    return result.data;
  }

  async update(
    id: TKey,
    item: Partial<T>,
    config?: AxiosRequestConfig<T>
  ): Promise<T> {
    const result = await this.client.put(`/${id}`, item, config);
    return result.data;
  }

  async partialUpdate(
    id: TKey,
    item: Partial<T>,
    config?: AxiosRequestConfig<T>
  ): Promise<T> {
    const result = await this.client.patch(`/${id}`, item, config);
    return result.data;
  }

  async delete(id: TKey, config?: AxiosRequestConfig<T>): Promise<T> {
    const reault = await this.client.delete(`/${id}`, config);
    return reault.data;
  }
}
