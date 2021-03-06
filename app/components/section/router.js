const express = require("express");
const router = express.Router();
const sectionController = require("./controller");
const middleware = require("../../middleware");

router.post(
  "/",
  middleware.authentication.passportAuthenticate,
  sectionController.createSection
);

router.get(
  "/",
  middleware.authentication.passportAuthenticate,
  sectionController.getSections
);
router.get(
  "/:id",
  middleware.authentication.passportAuthenticate,
  sectionController.getSection
);

router.delete(
  "/:id",
  middleware.authentication.passportAuthenticate,
  sectionController.deleteSection
);

router.put(
  "/",
  middleware.authentication.passportAuthenticate,
  sectionController.updateSectionDetails
);
module.exports = router;
