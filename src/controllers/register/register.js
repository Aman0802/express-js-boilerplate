const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const yup = require("yup");

const { User } = require("../../sequelize/models");
const createConfirmEmailLink = require("../../utils/createConfirmEmailLink");
const Error = require("../../utils/Error");
const formatYupError = require("../../utils/formatYupError");
const redis = require("../../utils/redis");
const {
  duplicateEmail,
  emailNotLongEnough,
  invalidEmail,
  passwordNotLongEnough,
} = require("./errorMessages");

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
    userId: uuidv4(),
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
