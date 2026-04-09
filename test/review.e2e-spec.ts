import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import type { INestApplication } from "@nestjs/common";
import request from "supertest";
import type { App } from "supertest/types";
import { AppModule } from "./../src/app.module";
import type { CreateReviewDto } from "@/review/dto/create-review.dto";
import { Types } from "mongoose";
import type { ReviewModel } from "@/review/review.model";
import { REVIEW_NOT_FOUND } from "@/review/review.constants";
import type { AuthDto } from "@/auth/dto/auth.dto";

const productId = new Types.ObjectId().toHexString();

const loginDto: AuthDto = {
  login: "a2@a.ru",
  password: "1",
};

const testDto: CreateReviewDto = {
  name: "Тест",
  title: "Заголовок",
  description: "Описание",
  rating: 5,
  productId,
};

describe("AppController (e2e)", () => {
  let app: INestApplication<App>;
  let createdId: string;
  let token: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { body } = await request(app.getHttpServer()).post("/auth/login").send(loginDto);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    token = body.access_token;
  });

  it("/review/create (POST) - success", async () => {
    const response = await request(app.getHttpServer())
      .post("/review/create")
      .send(testDto)
      .expect(201);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    createdId = response.body._id as string;
    expect(createdId).toBeDefined();
  });

  it("/review/create (POST) - fail", async () => {
    return request(app.getHttpServer())
      .post("/review/create")
      .send({ ...testDto, rating: 0 })
      .expect(400);
  });

  it("byProduct/:productId (GET) - success", async () => {
    const response = await request(app.getHttpServer())
      .get(`/review/byProduct/${productId}`)
      .expect(200);

    const result = response.body as ReviewModel[];
    expect(result.length).toBe(1);
  });

  it("byProduct/:productId (GET) - fail", async () => {
    const response = await request(app.getHttpServer())
      .get(`/review/byProduct/${new Types.ObjectId().toHexString()}`)
      .expect(200);

    const result = response.body as ReviewModel[];
    expect(result.length).toBe(0);
  });

  it("/review/:id (DELETE) - success", () => {
    return request(app.getHttpServer())
      .delete(`/review/${createdId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
  });

  it("/review/:id (DELETE) - faild", () => {
    return request(app.getHttpServer())
      .delete(`/review/${new Types.ObjectId().toHexString()}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(404, { statusCode: 404, message: REVIEW_NOT_FOUND });
  });

  afterEach(async () => {
    await app.close();
  });
});
