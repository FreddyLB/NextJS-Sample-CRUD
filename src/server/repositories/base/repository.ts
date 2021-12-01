export const EMPTY_PAGE_RESULT: PageResult<any> = Object.freeze({
  data: [],
  totalItems: 0,
  currentPage: 0,
  pageSize: 0,
  totalPages: 0,
});
export interface PageResult<T> {
  data: T[];
  totalItems: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
}

export enum SortDirection {
  Ascending = 1,
  Descending = -1,
}

export type PageSorting<T> = {
  [P in keyof T]?: SortDirection;
};

export type Query<T> = {
  [P in keyof T]?: any;
};

export interface PaginationOptions<T> {
  page?: number;
  pageSize?: number;
  sorting?: PageSorting<T>;
  query?: Query<T>;
}

export interface IReadRepository<TEntity> {
  findById(id: string): Promise<TEntity | null>;
  findOne(query: Query<TEntity>): Promise<TEntity | null>;
  find(query: Query<TEntity>): Promise<TEntity[]>;

  // prettier-ignore
  findWithPagination(options: PaginationOptions<TEntity>): Promise<PageResult<TEntity>>;
}

export interface IWriteRepository<TEntity> {
  create(entity: Partial<TEntity>): Promise<TEntity>;
  createMany(entities: Partial<TEntity>[]): Promise<TEntity[]>;
  update(id: string, entity: Partial<TEntity>): Promise<TEntity>;
  partialUpdate(id: string, entity: Partial<TEntity>): Promise<TEntity>;
  delete(id: string): Promise<TEntity>;
}

// prettier-ignore
export type IRepository<TEntity> = 
  IReadRepository<TEntity > & 
  IWriteRepository<TEntity>;
