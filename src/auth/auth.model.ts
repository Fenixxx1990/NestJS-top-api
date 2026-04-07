import { HydratedDocument } from "mongoose";
import { Prop, Schema, SchemaFactory } from "node_modules/@nestjs/mongoose/dist";

export type AuthDocument = HydratedDocument<AuthModel>;

@Schema({ timestamps: true })
export class AuthModel {
  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;
}

export const AuthSchema = SchemaFactory.createForClass(AuthModel);
