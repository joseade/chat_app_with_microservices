const express = require("express");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const RequestValidationError = require("../errors/request-validation-error");
const DatabaseConnectionError = require("../errors/database-connection-error");
const BadRequestError = require("../errors/bad-request-error");
const User = require("../models/user");

const router = express.Router();

router.post(
  "/users/signup",
  body("email").isEmail().withMessage("Email must be valid"),
  body("password")
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage("Password must be between four and twenty characters"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }

    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError("Email in use");
    }

    const user = new User({ name, email, password });
    await user.save();

    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      "America"
    );

    // Store it on session object

    req.session.jwt = userJwt;

    //console.log("Creating a user....");

    //throw new DatabaseConnectionError([{ msg: "Hola" }]);

    res.status(201).send(user);
  }
);

module.exports = router;
