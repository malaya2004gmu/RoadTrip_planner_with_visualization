const express = require("express");
const {
  renderLogin,
  handleLogin,
  handleLogout,
  handleRegister,
  handleRegisterPost,
} = require("../controllers/user_controler.js");

const Authrouter = express.Router();

Authrouter.get("/register", handleRegister);
Authrouter.post("/register", handleRegisterPost);
Authrouter.get("/login", renderLogin);
Authrouter.post("/login", handleLogin);
Authrouter.get("/logout", handleLogout);

module.exports = Authrouter;
