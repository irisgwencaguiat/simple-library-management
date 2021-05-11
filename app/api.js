const express = require("express");
const api = express();
const authenticationRouter = require("./components/authentication/router");
const accountRouter = require("./components/account/router");
const collegeRouter = require("./components/college/router");
const courseRouter = require("./components/course/router");

api.use("/authentication", authenticationRouter);
api.use("/account", accountRouter);
api.use("/college", collegeRouter);
api.use("/course", courseRouter);
module.exports = api;
