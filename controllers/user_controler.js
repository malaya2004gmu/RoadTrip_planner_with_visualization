const bcrypt = require("bcrypt");
const User = require("../models/users");

// const users = [
//     { username: 'admin', password: bcrypt.hashSync('password', 10) } // Pre-hashed password
// ];

function handleRegister(req, res) {
  res.render("register", { error: null });
}
async function handleRegisterPost(req, res) {
  const { username, password } = req.body;
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.render("register", { error: "Username already exists" });
  }
  const hashedPassword = bcrypt.hashSync(password, 10);
  await User.create({ username, password: hashedPassword });
  req.session.user = { username };
  res.redirect("/login");
}
// Render login page
function renderLogin(req, res) {
  res.render("login", { error: null });
}
// Handle login
async function handleLogin(req, res) {
  const { username, password } = req.body;

  // Find user
  const user = await User.findOne({ username });
  if (!user) {
    return res.render("login", { error: "Invalid username or password" });
  }

  // Check password
  const isPasswordValid = bcrypt.compareSync(password, user.password);
  if (!isPasswordValid) {
    return res.render("login", { error: "Invalid username or password" });
  }

  // Save user session
  req.session.userId = user._id;
  req.session.user = { username: user.username }; // Store username in session
  req.session.save((err) => {
    if (err) {
      console.error("Error saving session:", err);
      return res.status(500).send("Internal Server Error");
    }
    console.log("User session saved:", req.session.username);
    res.redirect("/"); // Redirect to the homepage
  });
}

// Handle logout
async function handleLogout(req, res) {
  req.session.destroy(() => {
    res.redirect("/login");
  });
}
async function ensureAuthenticated(req, res, next) {
  if (req.session && req.session.userId) {
    try {
      const user = await User.findById(req.session.userId);
      if (user) {
        req.user = user;
        return next();
      }
    } catch (err) {
      console.error("Error fetching user:", err);
      return res.status(500).send("Internal Server Error");
    }
  }
  res.redirect("/login");
}
module.exports = {
  renderLogin,
  handleLogin,
  handleLogout,
  ensureAuthenticated,
  handleRegister,
  handleRegisterPost,
};
