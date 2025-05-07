const express = require("express");
const {
  renderRoutesPage,
  addRoute,
  deleteRoutes,
} = require("../controllers/graph_controler.js");
const { ensureAuthenticated } = require("../controllers/user_controler.js");

const router = express.Router();

router.get("/routes", ensureAuthenticated, renderRoutesPage);
router.post("/routes", ensureAuthenticated, addRoute);
router.post("/routes/delete", ensureAuthenticated, deleteRoutes);

module.exports = router;
