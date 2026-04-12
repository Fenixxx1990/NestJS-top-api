import type { ConfigService } from "@nestjs/config";
import type { MongooseModuleFactoryOptions } from "@nestjs/mongoose/dist";

export const getMongoConfig = (configService: ConfigService): MongooseModuleFactoryOptions => {
  return {
    uri: getMongoString(configService),
    ...getMongoOptions(),
  };
};

const getMongoString = (configService: ConfigService): string => {
  const login = configService.get<string>("MONGO_LOGIN");
  const password = configService.get<string>("MONGO_PASSWORD");
  const host = configService.get<string>("MONGO_HOST");
  const port = configService.get<string | number>("MONGO_PORT");
  const authDatabase = configService.get<string>("MONGO_AUTHDATABASE");
  const appDatabase = configService.get<string>("MONGO_DATABASE") || "admin"; // по умолчанию — база admin

  if (!login || !password || !host || !port || !authDatabase) {
    throw new Error("Missing MongoDB configuration. Check environment variables.");
  }

  return `mongodb://${login}:${password}@${host}:${port}/${appDatabase}?authSource=${authDatabase}`;
};

const getMongoOptions = () => ({
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
  minPoolSize: 2,
  retryWrites: true,
  w: "majority" as const,
});
