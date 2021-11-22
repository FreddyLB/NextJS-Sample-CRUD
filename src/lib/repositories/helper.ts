
import { ArrayUtils } from "@lib/utils/ArrayUtils";
import { NextApiRequest } from "next";
import { PaginationOptions, SortDirection } from "./base/repository";

// prettier-ignore
export function getPagination<TEntity>(req: NextApiRequest) : PaginationOptions<TEntity> {
  const { page, pageSize, sort, sortAscending, sortDescending } = req.query;
  const sorting: Record<string, SortDirection> = {};

  if (sort) {
    for (const key of ArrayUtils.getOrArray(sort)) {
      sorting[key] = SortDirection.Descending;
    }
  }

  if (sortAscending) {
    for (const key of ArrayUtils.getOrArray(sortAscending)) {
      sorting[key] = SortDirection.Ascending;
    }
  }

  if (sortDescending) {
    for (const key of ArrayUtils.getOrArray(sortDescending)) {
      sorting[key] = SortDirection.Descending;
    }
  }

  return {
    page: Number(page),
    pageSize: Number(pageSize),
    sorting,
  } as PaginationOptions<TEntity>;
}