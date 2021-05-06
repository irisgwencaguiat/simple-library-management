const options = require("../knexfile");
const environment = process.env.NODE_ENV || "development";
const config = options[environment];
const knex = require("knex")(config);
module.exports = knex;
