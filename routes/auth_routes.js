const express = require("express");
const {
  renderLogin,
  handleLogin,
  handleLogout,
  handleRegister,
  handleRegisterPost,
  ensureAuthenticated,
} = require("../controllers/user_controler.js");

const Authrouter = express.Router();

Authrouter.get("/register", handleRegister);
Authrouter.post("/register", handleRegisterPost);
Authrouter.get("/login", renderLogin);
Authrouter.post("/login", handleLogin);
Authrouter.get("/logout", ensureAuthenticated, handleLogout);

module.exports = Authrouter;
