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
      const filter = request.query.filter || null;
      let accounts = [];
      if (filter) {
        accounts = await accountModel.filteredAccounts(filter);
      }
      if (!filter) {
        accounts = await accountModel.getAccounts();
      }
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
  async getAccountById(request, response) {
    try {
      const id = parseInt(request.params.id);
      const account = await accountModel.getAccountById(id);
      if (account) delete account.password;
      response.status(200).json(
        httpResource({
          success: true,
          code: 200,
          message: "Record has been created successfully.",
          data: account,
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
  async deleteAccount(request, response) {
    try {
      const id = parseInt(request.params.id);
      await accountModel.deleteAccount(id);
      response.status(200).json(
        httpResource({
          success: true,
          code: 200,
          message: "Record has been created successfully.",
          data: null,
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
  async updateUserDetails(request, response) {
    try {
      const { id, first_name, last_name } = request.body;
      const payload = {};
      if (first_name) payload.first_name = first_name;
      if (last_name) payload.last_name = last_name;
      const updatedAccount = await accountModel.updateAccount(id, payload);
      if (!updatedAccount) throw "Account cannot be found.";
      const accountDetails = await accountModel.getDetails(updatedAccount.id);
      delete accountDetails.password;
      response.status(200).json(
        httpResource({
          success: true,
          code: 200,
          message: "Record has been created successfully.",
          data: accountDetails,
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
  async changePassword(request, response) {
    try {
      const id = parseInt(request.user.id);
      const { old_password, new_password } = request.body;
      const accountPassword = await accountModel.getPassword(id);
      const isPlainTextValidated = utilityController.validateHashPassword(
        old_password,
        accountPassword
      );
      if (!isPlainTextValidated) throw "Incorrect Password";

      const updatedAccount = await accountModel.updateAccount(id, {
        password: utilityController.hashPassword(new_password),
      });
      if (!updatedAccount) throw "Account cannot be found.";
      const accountDetails = await accountModel.getDetails(updatedAccount.id);
      delete accountDetails.password;
      response.status(200).json(
        httpResource({
          success: true,
          code: 200,
          message: "Record has been created successfully.",
          data: accountDetails,
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
