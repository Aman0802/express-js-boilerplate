import Redis from "ioredis";
import { v4 } from "uuid";
import fetch from "node-fetch";

import createConfirmEmailLink from "../utils/createConfirmEmailLink";
import { User } from "../sequelize/models";

let userId;

beforeAll(async () => {
  const user = await User.create({
    userId: v4(),
    email: "aman.khubani@gmail.com",
    password: "12345",
  });
  userId = user.userId;
});

describe("Test createConfirmEmailLink", () => {
  test("Make sure createConfirmEmailLink works", async () => {
    const url = await createConfirmEmailLink(
      "http://localhost:8000",
      userId,
      new Redis()
    );
    const response = await fetch(url);
    const data = response.json();

    console.log({ data });
  });
});
