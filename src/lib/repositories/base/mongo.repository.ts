import {
  IRepository,
  PageResult,
  PaginationOptions,
  SortDirection,
} from "./repository";
import { Model, Document, FilterQuery, HydratedDocument } from "mongoose";
import { ValidationError } from "@lib/utils/errors";

const DEFAULT_MAX_PAGE_SIZE = 10;
const NO_FOUND_ERROR_MESSAGE = "Resourse not found";

export class MongoRepository<
  TEntity extends Document,
  TModel extends Model<TEntity>
> implements IRepository<TEntity, string>
{
  constructor(protected readonly model: TModel) {}

  async findWithPagination(
    options: PaginationOptions<TEntity> = {}
  ): Promise<PageResult<TEntity>> {
    const currentPage = Math.max(1, options.page || 1);
    const pageSize = Math.max(1, options.pageSize || DEFAULT_MAX_PAGE_SIZE);
    const query = (options.query || {}) as FilterQuery<TEntity>;
    const count = await this.model.countDocuments(query);
    const totalPages = Math.ceil(count / pageSize);

    let sorting = options.sorting || {};

    if (Object.entries(sorting).length === 0) {
      sorting = { _id: SortDirection.Descending };
    }

    // Quick path
    if (currentPage > totalPages) {
      return pageData({
        currentPage,
        totalPages,
        pageSize,
        totalItems: count,
        data: [],
      });
    }

    const data = await this.model
      .find(query)
      .sort(sorting)
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize);

    return pageData({
      currentPage,
      totalPages,
      pageSize,
      totalItems: count,
      data,
    });
  }

  async find(query: Partial<TEntity> = {}): Promise<TEntity[]> {
    const filterQuery = query as FilterQuery<TEntity>;
    return await this.model.find(filterQuery);
  }

  async findOne(query: Partial<TEntity> = {}): Promise<TEntity | null> {
    const filterQuery = query as FilterQuery<TEntity>;
    const result = await this.model.findOne(filterQuery);

    if (result == null) {
      throw new ValidationError(NO_FOUND_ERROR_MESSAGE);
    }

    return result;
  }

  async findById(id: string): Promise<TEntity | null> {
    const result = await this.model.findById(id);

    if (result == null) {
      throw new ValidationError(NO_FOUND_ERROR_MESSAGE);
    }

    return result;
  }

  async create(entity: Partial<TEntity>): Promise<TEntity> {
    return await this.model.create(entity);
  }

  async update(id: string, entity: Partial<TEntity>): Promise<TEntity> {
    const entityToUpdate = await this.model.findById(id);

    if (!entityToUpdate) {
      throw new ValidationError(NO_FOUND_ERROR_MESSAGE);
    }

    for (const key in entity) {
      if (entity.hasOwnProperty(key)) {
        const value = entity[key];

        if (value !== undefined) {
          (entityToUpdate as any)[key] = value;
        }
      }
    }

    await entityToUpdate.save();
    return entityToUpdate;
  }

  async delete(id: string): Promise<TEntity> {
    const entityToDelete = await this.model.findById(id);

    if (!entityToDelete) {
      throw new ValidationError(NO_FOUND_ERROR_MESSAGE);
    }

    await entityToDelete.remove();
    return entityToDelete;
  }
}

// prettier-ignore
function pageData<T>({ data, pageSize, currentPage, totalPages, totalItems }: PageResult<T>): PageResult<T> {
  return {
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    data,
  };
}
