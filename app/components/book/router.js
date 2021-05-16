const express = require("express");
const router = express.Router();
const bookController = require("./controller");
const middleware = require("../../middleware");

router.post(
  "/",

  [
    middleware.multer().fields([{ name: "book" }, { name: "preview" }]),
    middleware.authentication.passportAuthenticate,
  ],
  bookController.createBook
);
router.post(
  "/view",
  middleware.authentication.passportAuthenticate,
  bookController.createBookView
);

router.get(
  "/",
  middleware.authentication.passportAuthenticate,
  bookController.getBooks
);

router.get(
  "/view",
  middleware.authentication.passportAuthenticate,
  bookController.mostViewedBook
);

router.get(
  "/category/:book_category_id",
  middleware.authentication.passportAuthenticate,
  bookController.getBooksByCategory
);

router.get(
  "/:id",
  middleware.authentication.passportAuthenticate,
  bookController.getBook
);

router.delete(
  "/:id",
  middleware.authentication.passportAuthenticate,
  bookController.deleteBook
);

router.put(
  "/",
  [
    middleware.multer().single("book"),
    middleware.authentication.passportAuthenticate,
  ],
  bookController.updateBookDetails
);
module.exports = router;
