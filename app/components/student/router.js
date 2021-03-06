const express = require("express");
const router = express.Router();
const studentController = require("./controller");
const middleware = require("../../middleware");

router.post(
  "/",
  middleware.authentication.passportAuthenticate,
  studentController.createStudent
);

router.get(
  "/",
  middleware.authentication.passportAuthenticate,
  studentController.getStudents
);

router.get(
  "/:id",
  middleware.authentication.passportAuthenticate,
  studentController.getStudent
);

router.delete(
  "/:id",
  middleware.authentication.passportAuthenticate,
  studentController.deleteStudent
);

router.put(
  "/",
  middleware.authentication.passportAuthenticate,
  studentController.updateStudentDetails
);
module.exports = router;
