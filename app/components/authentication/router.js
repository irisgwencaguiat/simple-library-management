const express = require("express");
const router = express.Router();
const authenticationController = require("./controller");
const middleware = require("../../middleware");

router.post("/log-in", authenticationController.logIn);

router.get(
  "/log-in/:date",
  middleware.authentication.passportAuthenticate,
  authenticationController.getLogInActivityCountPerDay
);

module.exports = router;
