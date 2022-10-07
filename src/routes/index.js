const express = require("express");
const register = require("../controllers/register/register");

const { User } = require("../sequelize/models");
const redis = require("../utils/redis");

const router = express.Router();

router.get("/", (req, res, next) =>
  res.status(200).json({
    code: 200,
    message: "Welcome to Express Boilerplate",
  })
);

router.post("/register", register);

router.get("/user", async (req, res, next) => {
  const users = await User.findAll();
  res.status(200).send({
    code: 200,
    data: users,
  });
});

router.get("/confirm/:id", async (req, res, next) => {
  const { id } = req.params;
  const userId = await redis.get(id);

  if (userId) {
    await User.update({ confirmed: true }, { where: { userId } });
    await redis.del(id);
    res.send({
      message: "User updated successfully",
    });
  } else {
    res.send({
      message: "Invalid Id",
    });
  }
});

router.all("*", (req, res, next) =>
  res.status(404).json({
    message: "Route un-available",
  })
);

module.exports = router;
