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
  "/",
  middleware.authentication.passportAuthenticate,
  courseController.getCourses
);
router.get(
  "/:id",
  middleware.authentication.passportAuthenticate,
  courseController.getCourse
);

router.delete(
  "/:id",
  middleware.authentication.passportAuthenticate,
  courseController.deleteCourse
);

router.put(
  "/",
  middleware.authentication.passportAuthenticate,
  courseController.updateCourseDetails
);
module.exports = router;
