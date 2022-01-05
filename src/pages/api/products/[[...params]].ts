import { BaseController } from "@server/core/ApiController";
import { authMiddleware, ContextWithUser } from "@server/middlewares/auth";
import { PageResult } from "@server/repositories/base/repository";
import { buildPaginationOptions } from "@server/repositories/helper";
import {
  ProductRepository,
  TodoPaginationOptions,
} from "@server/repositories/product.repository";
import { IProduct } from "@shared/models/product.model";
import { Types } from "mongoose";
import {
  Delete,
  Get,
  Patch,
  Put,
  Post,
  UseMiddleware,
  withController,
} from "next-controllers";

// @UseMiddleware(authMiddleware)
class ProductsController extends BaseController {
  private readonly products = new ProductRepository();

  @Get()
  async getAll({ request }: ContextWithUser): Promise<PageResult<IProduct>> {
    const options = buildPaginationOptions<IProduct>(
      request
    ) as TodoPaginationOptions;

    if (request.query.search) {
      options.search = String(request.query.search);
    }

    const user = request.user;
    const result = await this.products.search({
      ...options,
      query: {
        user,
      },
    });

    return result;
  }

  @Get("/:id")
  async getById({ request }: ContextWithUser): Promise<IProduct | null> {
    const user = request.user;
    const id = request.params.id;

    console.log("Product ID: ", id);
    const result = await this.products.findOne({
      _id: new Types.ObjectId(id),
    } as any);

    // console.log({ user, puser: result?.user})
    // if (result && user && result.user.id === user.id) {
    //   return result;
    // }

    return result;
  }

  @Post()
  async create({ request }: ContextWithUser): Promise<IProduct | IProduct[]> {
    const user = request.user;
    const data = request.body;

    if (Array.isArray(data)) {
      data.forEach((item) => (item.user = user));
      return this.products.createMany(data);
    }

    return this.products.create({ ...data, user });
  }

  @Put("/:id")
  async update({ request }: ContextWithUser): Promise<IProduct> {
    const user = request.user;
    const id = request.params.id;
    const data = request.body;
    return this.products.update(id, { ...data, user });
  }

  @Patch("/:id")
  async patch({ request }: ContextWithUser): Promise<IProduct> {
    const user = request.user;
    const id = request.params.id;
    const data = request.body;
    return this.products.partialUpdate(id, { ...data, user });
  }

  @Delete("/:id")
  async delete({ request }: ContextWithUser): Promise<IProduct> {
    // TODO: const user = request.user;
    const id = request.params.id;
    return this.products.delete(id);
  }
}

export default withController(ProductsController, { dirname: __dirname });
