const express = require("express");
const router = express.Router();
const courseController = require("./controller");
const middleware = require("../../middleware");

router.post(
  "/",
  middleware.authentication.passportAuthenticate,
  courseController.createCourse
);

router.get(
  "/:id",
  middleware.authentication.passportAuthenticate,
  courseController.getCourse
);

module.exports = router;
