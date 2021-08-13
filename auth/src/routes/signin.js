const express = require("express");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

const Password = require("../services/password");
const User = require("../models/user");
const RequestValidationError = require("../errors/request-validation-error");
const BadRequestError = require("../errors/bad-request-error");

const router = express.Router();

router.post(
  "/users/signin",
  body("email").isEmail().withMessage("Email must be valid"),
  body("password").trim().notEmpty().withMessage("You must supply a password"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      throw new BadRequestError("Invalid credentials");
    }

    const passwordsMatch = await Password.compare(
      existingUser.password,
      password
    );

    if (!passwordsMatch) {
      throw new BadRequestError("Invalid credentials");
    }

    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
        profilePicture: existingUser.profilePicture,
        followings: existingUser.followings,
        followers: existingUser.followers,
      },
      "America"
    );

    // Store it on session object

    req.session.jwt = userJwt;

    res.status(200).send(existingUser);
  }
);

module.exports = router;
