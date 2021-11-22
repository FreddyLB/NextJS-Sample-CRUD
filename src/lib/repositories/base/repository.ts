export interface PaginationOptions<T> {
  page?: number;
  pageSize?: number;
  sorting?: PageSorting<T>;
  query?: Partial<T>;
}

export interface PageResult<T> {
  data: T[];
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
}

export enum SortDirection {
  Ascending = 1,
  Descending = -1,
}

export type PageSorting<TEntity> = {
  [P in keyof TEntity]?: SortDirection;
};

export interface IReadRepository<TEntity, TKey> {
  findById(id: TKey): Promise<TEntity | null>;
  findOne(query: Partial<TEntity>): Promise<TEntity | null>;
  find(query: Partial<TEntity>): Promise<TEntity[]>;

  // prettier-ignore
  findWithPagination(options: PaginationOptions<TEntity>): Promise<PageResult<TEntity>>;
}

export interface IWriteRepository<TEntity, TKey> {
  create(entity: Partial<TEntity>): Promise<TEntity>;
  update(id: TKey, entity: Partial<TEntity>): Promise<TEntity>;
  delete(id: TKey): Promise<TEntity>;
}

export type IRepository<TEntity, TKey> = 
  IReadRepository<TEntity, TKey> &
  IWriteRepository<TEntity, TKey>;
