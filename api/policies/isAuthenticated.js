// api/policies/isAuthenticated.js

const jwt = require('jsonwebtoken');

module.exports = async function(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.serverError({ error: 'Not authorized' });
  }
  const token = authHeader.substring(7);
  try {
    const payload = jwt.verify(token, process.env.SECRET);
    const user = await User.findOne({ id: payload.userId });
    if (!user) {
      return res.serverError({ error: 'Invalid user' });
    }
    req.user = user;
    return next();
  } catch (err) {
    console.log(err);
    return res.forbidden({ error: `Invalid token ${err}` });
  }
};
