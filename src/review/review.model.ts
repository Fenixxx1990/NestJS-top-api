import { HydratedDocument, Schema as MSchema } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose/dist";
import { ProductModel } from "@/product/product.model";

export type ReviewDocument = HydratedDocument<ReviewModel>;

@Schema({ timestamps: true })
export class ReviewModel {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  rating: number;

  @Prop({ required: true, type: MSchema.Types.ObjectId, ref: ProductModel.name })
  productId: MSchema.Types.ObjectId;
}

export const ReviewSchema = SchemaFactory.createForClass(ReviewModel);
