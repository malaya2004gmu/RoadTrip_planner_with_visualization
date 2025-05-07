const express = require("express");
const {
  renderLocationsPage,
  addLocation,
  deleteLocation,
} = require("../controllers/graph_controler.js");
const { ensureAuthenticated } = require("../controllers/user_controler.js");

const router = express.Router();

router.get("/locations", ensureAuthenticated, renderLocationsPage);
router.post("/locations", ensureAuthenticated, addLocation);
router.post("/locations/delete", ensureAuthenticated, deleteLocation);

module.exports = router;
