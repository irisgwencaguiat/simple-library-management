const express = require("express");
const router = express.Router();
const accountController = require("./controller");
const middleware = require("../../middleware");

router.post(
  "/",
  middleware.authentication.passportAuthenticate,
  accountController.createAccount
);

router.get(
  "/",
  middleware.authentication.passportAuthenticate,
  accountController.getAccounts
);

router.get(
  "/:id",
  middleware.authentication.passportAuthenticate,
  accountController.getAccountById
);

router.delete(
  "/:id",
  middleware.authentication.passportAuthenticate,
  accountController.deleteAccount
);
module.exports = router;
