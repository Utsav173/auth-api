/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {
  "GET /users": "UserController.find",
  "GET /users/:id": "UserController.findOne",
  "POST /users": "UserController.create",
  "PUT /users/:id": "UserController.update",
  "DELETE /users/:id": "UserController.destroy",
  "post /login": "AuthController.login",
  "post /signup": "AuthController.signup",
  "post /forgot-password": "AuthController.forgotPassword",
  "post /reset-password/:resetToken": "AuthController.resetPassword",
  "post /chnage-password":"AuthController.changePassword"
};
