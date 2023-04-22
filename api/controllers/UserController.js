/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const bcrypt = require("bcrypt");

module.exports = {
  find: async function (req, res) {
    try {
      // Get the query parameter from the request URL
      const { search } = req.query;
      let searchQuery = {};
      if (search) {
        searchQuery = {
          or: [{ name: { contains: search } }, { email: { contains: search } }],
        };
      }

      // Use the query parameter to filter the user records
      const users = await User.find(searchQuery);

      // Return the filtered user records
      return res.ok(users);
    } catch (error) {
      return res.serverError({message: error});
    }
  },
  findOne: async function (req, res) {
    try {
      if (!req.params.id) {
        return res.badRequest("id is required");
      }
      const user = await User.findOne({ id: req.params.id });
      if (!user) {
        return res.serverError("user not found");
      }
      return res.ok(user);
    } catch (error) {
      return res.serverError({message: error});
    }
  },

  create: async function (req, res) {
    try {
      if (!req.body.name || !req.body.email || !req.body.password) {
        return res.badRequest(
          "body is required with field name, email, password"
        );
      }
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      req.body.password = hashedPassword;
      const user = await User.create(req.body).fetch();
      return res.ok(user);
    } catch (error) {
      return res.serverError({message: error});
    }
  },

  update: async function (req, res) {
    try {
      if (!req.params.id) {
        return res.badRequest("id is required");
      }
      if (req.body.password) {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        req.body.password = hashedPassword;
      }
      const user = await User.updateOne({ id: req.params.id }).set(req.body);
      if (!user) {
        return res.serverError("user not found");
      }
      return res.ok(user);
    } catch (error) {
      return res.serverError({message: error});
    }
  },

  destroy: async function (req, res) {
    try {
      if (!req.params.id) {
        return res.badRequest("id is required");
      }
      const user = await User.destroyOne({ id: req.params.id });
      if (!user) {
        return res.serverError("user not found");
      }
      return res.ok();
    } catch (error) {
      return res.serverError({message: error});
    }
  },
};
