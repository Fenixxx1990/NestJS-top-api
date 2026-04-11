import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ProductModel, ProductDocument } from "./product.model";
import { CreateProductDto } from "./dto/create-product.dto";
import { FindProductDto } from "./dto/find-product.dto";
import { ProductModule } from "./product.module";
import { ReviewModel } from "@/review/review.model";
import { UpdateProductDto } from "./dto/update-product.dto";

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(ProductModel.name) private readonly productModel: Model<ProductDocument>
  ) {}

  async create(dto: CreateProductDto) {
    return (await this.productModel.create(dto)).save();
  }

  async findById(id: string) {
    return this.productModel.findById(id).exec();
  }

  async deleteById(id: string) {
    return this.productModel.findByIdAndDelete(id).exec();
  }

  async updateById(id: string, dto: UpdateProductDto) {
    return this.productModel.findByIdAndUpdate(id, dto, { returnDocument: "after" }).exec();
  }

  async findWhithREviews(dto: FindProductDto) {
    return (await this.productModel
      .aggregate([
        {
          $match: {
            categories: dto.category,
          },
        },
        {
          $sort: {
            _id: 1,
          },
        },
        {
          $limit: dto.limit,
        },
        {
          $lookup: {
            from: "reviewmodels",
            localField: "_id",
            foreignField: "productId",
            as: "reviews",
          },
        },
        {
          $addFields: {
            reviewsCount: { $size: "$reviews" },
            reviewAvg: { $avg: "$reviews.rating" },
            reviews: {
              $function: {
                body: `function (reviews) {
                  reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                  return reviews;
                }`,
                args: ["$reviews"],
                lang: "js",
              },
            },
          },
        },
      ])
      .exec()) as unknown as (ProductModule & {
      review: ReviewModel[];
      reviewCount: number;
      reviewAvg: number;
    })[];
  }
}
