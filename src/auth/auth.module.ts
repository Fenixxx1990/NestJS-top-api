import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { MongooseModule } from "node_modules/@nestjs/mongoose/dist";
import { AuthModel, AuthSchema } from "./auth.model";

@Module({
  controllers: [AuthController],
  imports: [MongooseModule.forFeature([{ name: AuthModel.name, schema: AuthSchema }])],
})
export class AuthModule {}
