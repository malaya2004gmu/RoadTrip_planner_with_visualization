const express = require("express");
const {
  renderHomePage,
  renderMapPage,
  renderTripPage,
  planTrip,
  deletePlannedTrip,
  calculateShortestPath,
} = require("../controllers/graph_controler.js");
const { ensureAuthenticated } = require("../controllers/user_controler.js");

const router = express.Router();

router.get("/", renderHomePage);
router.get("/plan-trip", ensureAuthenticated, renderTripPage);
router.post("/plan-trip", ensureAuthenticated, planTrip);
router.post("/plannedTrip/delete", ensureAuthenticated, deletePlannedTrip);
router.get("/map", ensureAuthenticated, renderMapPage);
router.get("/shortest-path", ensureAuthenticated, calculateShortestPath);

module.exports = router;
