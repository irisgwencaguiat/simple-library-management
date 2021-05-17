require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const passport = require("passport");
const api = require("./api");
const jwtPassport = require("./passport");

const application = express();
application.use(cors());
application.use(bodyParser.urlencoded({ extended: false }));
application.use(bodyParser.json());
application.use("/api", api);
application.use(passport.initialize());
jwtPassport(passport);

if (process.env.NODE_ENV === "production") {
  application.use(express.static(__dirname + "/public/"));
  application.get(/.*/, (_, response) =>
    response.sendFile(__dirname + "/public/index.html")
  );
}

const PORT = process.env.PORT || 3000;

application.listen(PORT, () =>
  console.log(`Server is running at PORT:${PORT}`)
);
