/**
 * AuthController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
  signup: async function (req, res) {
    if (!req.body) {
      return res.badRequest("body is required");
    }
    if (!req.body.email || !req.body.password || !req.body.name) {
      return res.badRequest("email, password and name are required");
    }
    try {

      const isExist = await User.findOne({ email: req.body.email });
      if (isExist) {
        return res.badRequest("email already exists");
      }
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const user = await User.create({
        email: req.body.email,
        password: hashedPassword,
        name: req.body.name,
      }).fetch();
      return res.ok(user);
    } catch (error) {
      return res.serverError({message: error});
    }
  },

  login: async function (req, res) {
    try {
      if (!req.body) {
        return res.badRequest("body is required");
      }
      if (!req.body.email || !req.body.password) {
        return res.badRequest("email and password are required");
      }
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.serverError("user not found");
      }
      const isMatch = await bcrypt.compare(req.body.password, user.password);
      if (!isMatch) {
        return res.serverError("invalid password");
      }
      const token = jwt.sign({ userId: user.id }, process.env.SECRET, {
        expiresIn: "1h",
      });
      return res.ok({ token: token, user: user });
    } catch (error) {
      return res.serverError({message: error});
    }
  },
  forgotPassword: async function (req, res) {
    try {
      if (!req.body.email) {
        return res.badRequest("email is required");
      }
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.serverError("user not found");
      }
      const resetToken = await sails.helpers.generateResetToken(
        parseInt(user.id)
      );
      await User.updateOne({ id: user.id }).set({
        resetToken: resetToken,
      });
      // Send reset token via email or other means
      return res.ok({resetToken: resetToken});
    } catch (error) {
      return res.serverError({message: error});
    }
  },

  resetPassword: async function (req, res) {
    try {
      if (!req.params.resetToken) {
        return res.badRequest("resettoken is required");
      }
      console.log("====================================");
      console.log(req.params.resetToken);
      console.log("====================================");
      const user = await User.findOne({ resetToken: req.params.resetToken });
      if (!user) {
        return res.serverError("user not found");
      }
      if (!req.body.password) {
        return res.badRequest("password is required");
      }
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      await User.updateOne({ id: user.id }).set({
        password: hashedPassword,
        resetToken: null,
      });
      return res.ok();
    } catch (error) {
      return res.serverError({message: error});
    }
  },
  changePassword: async function(req, res) {
    try {
      if(!req.user){
        return res.forbidden();
      }
      const user = await User.findOne({ id: req.user.id });
      if (!user) {
        return res.notFound();
      }
      if(!req.body.oldPassword|| !req.body.newPassword){
        return res.badRequest("oldPassword and newPassword is required");
      }
      const isMatch = await bcrypt.compare(req.body.oldPassword, user.password);
      if (!isMatch) {
        return res.serverError("old password doesn't match");
      }
      const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);
      await User.updateOne({ id: user.id }).set({
        password: hashedPassword
      });
      return res.ok();
    } catch (error) {
      return res.serverError({message: error});
    }
  }
};
