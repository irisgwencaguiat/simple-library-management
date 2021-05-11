const express = require("express");
const router = express.Router();
const sectionController = require("./controller");
const middleware = require("../../middleware");

router.post(
  "/",
  middleware.authentication.passportAuthenticate,
  sectionController.createSection
);
//
// router.get(
//   "/",
//   middleware.authentication.passportAuthenticate,
//   courseController.getCourses
// );
router.get(
  "/:id",
  middleware.authentication.passportAuthenticate,
  sectionController.getSection
);

// router.delete(
//   "/:id",
//   middleware.authentication.passportAuthenticate,
//   courseController.deleteCourse
// );
//
// router.put(
//   "/",
//   middleware.authentication.passportAuthenticate,
//   courseController.updateCourseDetails
// );
module.exports = router;
