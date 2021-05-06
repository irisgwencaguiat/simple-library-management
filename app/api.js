const express = require("express");
const api = express();
const authenticationRouter = require("./components/authentication/router");
const accountRouter = require("./components/account/router");

api.use("/authentication", authenticationRouter);
api.use("/account", accountRouter);
module.exports = api;
