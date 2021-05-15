const express = require("express");
const router = express.Router();
const bookController = require("./controller");
const middleware = require("../../middleware");

router.post(
  "/",
  [
    middleware.multer().single("book"),
    middleware.authentication.passportAuthenticate,
  ],
  bookController.createBook
);

router.get(
  "/",
  middleware.authentication.passportAuthenticate,
  bookController.getBooks
);

router.get(
  "/:id",
  middleware.authentication.passportAuthenticate,
  bookController.getBook
);

// router.delete(
//   "/:id",
//   middleware.authentication.passportAuthenticate,
//   bookCategoryController.deleteBookCategory
// );
//
// router.put(
//   "/",
//   middleware.authentication.passportAuthenticate,
//   bookCategoryController.updateBookCategoryDetails
// );
module.exports = router;
