import { Module } from "@nestjs/common";
import { ReviewController } from "./review.controller";
import { ReviewModel, ReviewSchema } from "./review.model";
import { ReviewService } from "./review.service";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
  controllers: [ReviewController],
  imports: [MongooseModule.forFeature([{ name: ReviewModel.name, schema: ReviewSchema }])],
  providers: [ReviewService],
})
export class ReviewModule {}
