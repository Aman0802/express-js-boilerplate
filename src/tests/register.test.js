import request from "supertest";
import {
  duplicateEmail,
  emailNotLongEnough,
  invalidEmail,
  passwordNotLongEnough,
} from "../controllers/register/errorMessages";
import app from "../index";

const email = "aman.khubani@gmail.com";
const password = "12345";

describe("register route works", () => {
  it("check for duplicate emails", async () => {
    let res;
    // hit the register endpoint
    res = await request(app).post("/register").send({
      email,
      password,
    });

    // expect response to be equal to the desired response
    expect(res.statusCode).toEqual(201);

    // find users and check if the email matches
    res = await request(app).get("/user");
    const users = res.body.data;
    expect(users).toHaveLength(1);

    const user = users[0];
    expect(user.email).toEqual(email);
    // to check if the password is hashed
    expect(user.password).not.toEqual(password);

    // register again
    const res2 = await request(app).post("/register").send({
      email,
      password,
    });

    expect(res2.body).toHaveLength(1);
    expect(res2.body[0]).toEqual({
      path: "email",
      message: duplicateEmail,
    });
  });

  it("check for bad email", async () => {
    const res3 = await request(app).post("/register").send({
      email: "b",
      password,
    });

    expect(res3.body).toHaveLength(2);
    expect(res3.body).toEqual([
      {
        path: "email",
        message: emailNotLongEnough,
      },
      {
        path: "email",
        message: invalidEmail,
      },
    ]);
  });

  it("check for bad password", async () => {
    const res4 = await request(app).post("/register").send({
      email,
      password: "a",
    });

    expect(res4.body).toHaveLength(1);
    expect(res4.body).toEqual([
      {
        path: "password",
        message: passwordNotLongEnough,
      },
    ]);
  });

  it("check for bad email and bad password", async () => {
    const res5 = await request(app).post("/register").send({
      email: "am",
      password: "a",
    });

    expect(res5.body).toHaveLength(3);
    expect(res5.body).toEqual([
      {
        path: "email",
        message: emailNotLongEnough,
      },
      {
        path: "email",
        message: invalidEmail,
      },
      {
        path: "password",
        message: passwordNotLongEnough,
      },
    ]);
  });
});
