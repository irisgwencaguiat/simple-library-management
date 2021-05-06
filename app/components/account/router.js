const express = require("express");
const router = express.Router();
const accountController = require("./controller");
const middleware = require("../../middleware");

router.post(
  "/create",
  middleware.authentication.passportAuthenticate,
  accountController.createAccount
);

module.exports = router;
