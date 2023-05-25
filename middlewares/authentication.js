const jwt = require("jsonwebtoken");
const User = require("../models/User");

function MiddleAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  const secret = process.env.SECRET;

  if (!token) {
    return res.status(401).json({ msg: "Acesso negado" });
  }

  try {
    const { id } = jwt.verify(token, secret);
    req.user_id = id;
    next();
  } catch (error) {
    res.status(400).json({ msg: "Token inválido" });
  }
}

module.exports = MiddleAuth;
