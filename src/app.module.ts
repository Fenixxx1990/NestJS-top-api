import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { TopPageModule } from "./top-page/top-page.module";
import { ProductModule } from "./product/product.module";
import { ReviewModule } from "./review/review.module";
import { ConfigModule, ConfigService } from "node_modules/@nestjs/config";
import { MongooseModule } from "node_modules/@nestjs/mongoose/dist";
import { getMongoConfig } from "./configs/mongo.config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // теперь должно работать
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getMongoConfig,
    }),
    AuthModule,
    TopPageModule,
    ProductModule,
    ReviewModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
