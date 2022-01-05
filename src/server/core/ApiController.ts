import { mongodb } from "@server/database/mongodb/middleware";
import {
  IRepository,
  PageResult,
  Query,
} from "@server/repositories/base/repository";
import { buildPaginationOptions } from "@server/repositories/helper";
import { ValidationError } from "@server/utils/errors";
import morgan from "morgan";
import {
  NextApiContext,
  UseMiddleware,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  OnError,
} from "next-controllers";

@UseMiddleware(morgan("dev"))
@UseMiddleware(mongodb())
export class BaseController {
  @OnError()
  onError(error: any, { response }: NextApiContext) {
    console.error(error);
    const message = error.message || error;

    if (error instanceof TypeError) {
      response.status(400).json({ message });
    } else if (error instanceof ValidationError) {
      response.status(400).json({ message });
    } else {
      response.status(500).json({ message });
    }

    response.end();
  }
}

export class ApiController<
  TEntity,
  TRepository extends IRepository<TEntity> = IRepository<TEntity>
> extends BaseController {
  constructor(protected readonly repository: TRepository) {
    super();
  }

  @Get()
  async getAll({ request }: NextApiContext): Promise<PageResult<TEntity>> {
    const options = buildPaginationOptions<TEntity>(request);

    // Only paginate if the request include any "pageSize" or "page"
    if (request.query.pageSize != null || request.query.page != null) {
      const paginatedResult = await this.repository.findWithPagination(options);
      return paginatedResult;
    }

    const result = await this.repository.find(options);

    return {
      data: result,
      currentPage: 1,
      totalPages: 1,
      pageSize: result.length,
      totalItems: result.length,
    };
  }

  @Get("/:id")
  async getById({ request }: NextApiContext): Promise<TEntity | null> {
    const result = await this.repository.findById(String(request.params.id));
    return result;
  }

  @Post()
  async create({ request }: NextApiContext): Promise<TEntity> {
    const entity = await this.repository.create(request.body);
    return entity;
  }

  @Put("/:id")
  async update({ request }: NextApiContext): Promise<TEntity> {
    const entity = await this.repository.update(
      String(request.params.id),
      request.body
    );
    return entity;
  }

  @Patch("/:id")
  async patch({ request }: NextApiContext): Promise<TEntity> {
    const entity = await this.repository.partialUpdate(
      String(request.params.id),
      request.body
    );
    return entity;
  }

  @Delete("/:id")
  async delete({ request }: NextApiContext): Promise<TEntity> {
    const result = await this.repository.delete(String(request.params.id));
    return result;
  }
}
