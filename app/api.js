const express = require("express");
const api = express();
const authenticationRouter = require("./components/authentication/router");
const accountRouter = require("./components/account/router");
const collegeRouter = require("./components/college/router");
const courseRouter = require("./components/course/router");
const sectionRouter = require("./components/section/router");
const studentRouter = require("./components/student/router");
const bookCategoryRouter = require("./components/book-category/router");

api.use("/authentication", authenticationRouter);
api.use("/account", accountRouter);
api.use("/college", collegeRouter);
api.use("/course", courseRouter);
api.use("/section", sectionRouter);
api.use("/student", studentRouter);
api.use("/book-category", bookCategoryRouter);
module.exports = api;
