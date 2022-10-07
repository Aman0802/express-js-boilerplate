import bcrypt from "bcryptjs";
import { v4 } from "uuid";
import yup from "yup";

import { User } from "../../sequelize/models";
import createConfirmEmailLink from "../../utils/createConfirmEmailLink";
import Error from "../../utils/Error";
import formatYupError from "../../utils/formatYupError";
import redis from "../../utils/redis";
import {
  duplicateEmail,
  emailNotLongEnough,
  invalidEmail,
  passwordNotLongEnough,
} from "./errorMessages";

const schema = yup.object().shape({
  email: yup.string().min(3, emailNotLongEnough).max(255).email(invalidEmail),
  password: yup.string().min(3, passwordNotLongEnough).max(255),
});

const register = async (req, res, next) => {
  try {
    await schema.validate(req.body, { abortEarly: false });
  } catch (err) {
    res.status(400).send(formatYupError(err));
    return;
  }
  const { email, password } = req.body;

  const userAlreadyExists = await User.findOne({
    attributes: ["userId"],
    where: {
      email,
    },
  });

  if (userAlreadyExists) {
    res.send([Error("email", duplicateEmail)]);
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    userId: v4(),
    email,
    password: hashedPassword,
  });

  let url = res.protocol + "://" + req.get("host");
  console.log({ url, user });

  const link = await createConfirmEmailLink(url, user.userId, redis);

  res.status(201).send({
    code: 201,
    message: "User created successfully",
  });
};

module.exports = register;
