const Redis = require("ioredis");
const { v4 } = require("uuid");
const fetch = require("node-fetch");

const createConfirmEmailLink = require("../utils/createConfirmEmailLink");
const { User } = require("../sequelize/models");

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
    const redis = new Redis();
    const url = await createConfirmEmailLink(
      "http://localhost:8000",
      userId,
      redis
    );
    const response = await fetch(url);
    const data = await response.json();

    expect(data.message).toEqual("User updated successfully");

    const user = await User.findOne({
      where: { userId },
    });
    console.log({ user });

    expect(user.confirmed).toBeTruthy();
    const chunks = url.split("/");
    const key = chunks[chunks.length - 1];
    const value = await redis.get(key);
    expect(value).toBeUndefined();
  });
});
