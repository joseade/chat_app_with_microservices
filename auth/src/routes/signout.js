const express = require("express");

const router = express.Router();

router.post("/users/signout", (req, res) => {
  req.session = null;
  res.send({});
});

module.exports = router;
