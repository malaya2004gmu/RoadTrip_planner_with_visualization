const bcrypt = require('bcrypt');
const users = [
    { username: 'admin', password: bcrypt.hashSync('password', 10) } // Pre-hashed password
];

function handleRegister(req, res) {
    res.render('register', { error: null });
}
function handleRegisterPost(req, res) {
    const { username, password } = req.body;
    const existingUser = users.find(u => u.username === username);
    if (existingUser) {
        return res.render('register', { error: 'Username already exists' });
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    users.push({ username, password: hashedPassword });
    req.session.user = { username };
    res.redirect('/');
}
// Render login page
function renderLogin(req, res) {
  res.render('login', { error: null });
}
// Handle login
function handleLogin(req, res) {
  const { username, password } = req.body;

  // Find user
  const user = users.find(u => u.username === username);
  if (!user) {
      return res.render('login', { error: 'Invalid username or password' });
  }

  // Check password
  const isPasswordValid = bcrypt.compareSync(password, user.password);
  if (!isPasswordValid) {
      return res.render('login', { error: 'Invalid username or password' });
  }

  // Save user session
  req.session.user = user;
  res.redirect('/');
}
// Handle logout
function handleLogout(req, res) {
  req.session.destroy(() => {
      res.redirect('/login');
  });
}
function ensureAuthenticated(req, res, next) {
  if (req.session.user) {
      return next();
  }
  res.redirect('/login');
}
module.exports ={
    renderLogin,
    handleLogin,
    handleLogout,
    ensureAuthenticated,
    handleRegister,
    handleRegisterPost
}