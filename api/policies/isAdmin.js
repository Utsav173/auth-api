// api/policies/isAdmin.js
const jwt = require("jsonwebtoken");

module.exports = async function (req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.serverError({ error: "Not authorized" });
  }
  const token = authHeader.substring(7);
  try {
    const payload = jwt.verify(token, process.env.SECRET);

    const user = await User.findOne({ id: payload.userId });
    if (!user) {
      return res.serverError({ error: "Invalid admin" });
    }
    if (user.email !== "admin@gmail.com") {
      return res.forbidden();
    }
    return next();
  } catch (err) {
    console.log(err);
    return res.serverError({ error: `Invalid token ${err}` });
  }
};
