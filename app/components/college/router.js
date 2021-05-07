const express = require("express");
const router = express.Router();
const collegeController = require("./controller");
const middleware = require("../../middleware");

router.post(
  "/",
  middleware.authentication.passportAuthenticate,
  collegeController.createCollege
);

router.get(
  "/",
  middleware.authentication.passportAuthenticate,
  collegeController.getColleges
);
router.get(
  "/:id",
  middleware.authentication.passportAuthenticate,
  collegeController.getCollegeById
);
module.exports = router;
