const { hashPassword } = require("../../app/components/utility/controller");

exports.seed = function (knex) {
  return knex("account")
    .del()
    .then(function () {
      return knex("account").insert([
        {
          id: 1,
          first_name: "Library",
          last_name: "Admin",
          username: "admin",
          password: hashPassword("admin"),
          type: "admin",
        },
      ]);
    });
};
