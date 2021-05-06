const express = require("express");
const api = express();
const authenticationRouter = require("./components/authentication/router");

api.use("/authentication", authenticationRouter);

module.exports = api;
