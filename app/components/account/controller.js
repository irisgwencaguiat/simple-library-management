const utilityController = require("../utility/controller");
const accountModel = require("./model");
const jsonwebtoken = require("jsonwebtoken");
const httpResource = require("../../http-resource");

const accountController = {
  async createAccount(request, response) {
    try {
      const {
        first_name,
        last_name,
        username,
        password,
        account_type,
      } = request.body;
      const doesUsernameExist = await accountModel.getDetailsByUsername(
        username
      );
      if (doesUsernameExist) throw `${username} already exists.`;
      const accountRegisterResult = await accountModel.createAccount({
        first_name,
        last_name,
        username,
        password: utilityController.hashPassword(password),
        account_type,
      });
      const details = await accountModel.getDetails(accountRegisterResult.id);
      delete details.password;
      const token = jsonwebtoken.sign(
        details,
        process.env.AUTHENTICATION_SECRET_OR_KEY
      );
      response.status(200).json(
        httpResource({
          success: true,
          code: 200,
          message: "Record has been created successfully.",
          data: {
            user: details,
            access_token: token,
          },
        })
      );
    } catch (error) {
      response.status(400).json(
        httpResource({
          success: false,
          code: 400,
          message: error,
        })
      );
    }
  },
  async getAccounts(request, response) {
    try {
      const accounts = await accountModel.getAccounts();
      const accountsDetails = await Promise.all(
        accounts.map((data) => {
          const account = data;
          delete account.password;
          return account;
        })
      );
      response.status(200).json(
        httpResource({
          success: true,
          code: 200,
          message: "Record has been created successfully.",
          data: accountsDetails,
        })
      );
    } catch (error) {
      response.status(400).json(
        httpResource({
          success: false,
          code: 400,
          message: error,
        })
      );
    }
  },
};

module.exports = accountController;