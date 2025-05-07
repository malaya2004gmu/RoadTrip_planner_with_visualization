const location = require("../models/locations");
const Route = require("../models/route_path");
const plannedTrip = require("../models/plannedTrips");
const locations = require("../models/locations");
async function renderHomePage(req, res) {
  try {
    const plannedTrips = await plannedTrip.find();
    res.render("index", { plannedTrips, session: req.session });
  } catch (err) {
    console.error("Error rendering home page:", err);
    res.status(500).send("Internal Server Error in rendering home page");
  }
}

async function renderLocationsPage(req, res) {
  try {
    const locations = await location.find().select("name -_id");
    console.log("rendering location page..");
    res.render("locations", { locations });
  } catch (err) {
    console.error("Error rendering locations page:", err);
    res.status(500).send("Internal Server Error in rendering locations page");
  }
}

async function addLocation(req, res) {
  const { name } = req.body;
  try {
    if (name) {
      const existingLocation = await location.findOne({ name });
      if (!existingLocation) {
        await location.create({ name });
        console.log(`Added location: ${name}`);
      }
    }
    res.redirect("/locations");
  } catch (err) {
    console.error("Error adding location:", err);
    res.status(500).send("Internal Server Error in adding location");
  }
}

async function deleteLocation(req, res) {
  const { name } = req.body;
  try {
    // Find the location by name
    const locationToDelete = await location.findOne({ name });

    if (!locationToDelete) {
      console.error("Location not found");
      return res.redirect("/locations");
    }
    await location.deleteOne({ _id: locationToDelete._id });

    await Route.deleteMany({
      $or: [{ from: locationToDelete._id }, { to: locationToDelete._id }],
    });

    res.redirect("/locations");
  } catch (err) {
    console.error("Error deleting location:", err);
    res.status(500).send("Internal Server Error in deleting location");
  }
}

async function renderRoutesPage(req, res) {
  try {
    const locations = await location.find().select("name -_id");
    const routes = await Route.find()
      .populate("from", "name -_id")
      .populate("to", "name -_id");

    res.render("routes", { locations, routes });
  } catch (err) {
    console.error("Error rendering routes page:", err);
    res.status(500).send("Internal Server Error in rendering routes page");
  }
}

async function addRoute(req, res) {
  console.log("Adding route...");
  const { from, to, distance } = req.body;
  try {
    const fromLocation = await location.findOne({ name: from });
    const toLocation = await location.findOne({ name: to });

    if (!fromLocation || !toLocation) {
      console.error("Invalid locations");
      return res.redirect("/routes");
    }

    const routeExists = await Route.findOne({
      $or: [
        { from: fromLocation._id, to: toLocation._id },
        { from: toLocation._id, to: fromLocation._id }, // Check for reverse route
      ],
    });

    if (routeExists) {
      console.log("Route already exists between these nodes");
      return res.redirect("/routes");
    } else if (from === to) {
      console.log("Route cannot be added between the same node");
      return res.redirect("/routes");
    }

    await Route.create({
      from: fromLocation._id,
      to: toLocation._id,
      distance: parseFloat(distance),
    });

    res.redirect("/routes");
  } catch (err) {
    console.error("Error adding route:", err);
    res.status(500).send("Internal Server Error");
  }
}

async function deleteRoutes(req, res) {
  const { from, to } = req.body;
  try {
    const fromLocation = await location.findOne({ name: from });
    const toLocation = await location.findOne({ name: to });

    if (!fromLocation || !toLocation) {
      console.error("Invalid locations for deletion");
      return res.redirect("/routes");
    }

    await Route.deleteOne({ from: fromLocation._id, to: toLocation._id });
    res.redirect("/routes");
  } catch (err) {
    console.error("Error deleting route:", err);
    res.status(500).send("Internal Server Error in deleting route");
  }
}

async function renderTripPage(req, res) {
  try {
    const locations = await location.find();
    res.render("trip", { locations, result: null });
  } catch (err) {
    console.error("Error rendering trip page:", err);
    res.status(500).send("Internal Server Error in rendering trip page");
  }
}

async function planTrip(req, res) {
  const { start, end, roundTrip } = req.body;
  try {
    const locations = await location.find().select("name -_id");
    const routes = await Route.find()
      .populate("from", "name -_id")
      .populate("to", "name -_id");

    let result = dijkstra(
      start,
      end,
      locations.map((loc) => loc.name),
      routes
    );

    if (roundTrip) {
      if (result.path.length > 0) {
        result.path.push(...result.path.slice().reverse().slice(1));
        result.distance *= 2;
      }
    }

    const plannedTrips = await plannedTrip.create({
      start,
      end,
      distance: result.distance,
      path: result.path,
      roundTrip: !!roundTrip,
    });

    res.render("trip", { locations, result });
  } catch (err) {
    console.error("Error planning trip:", err);
    res.status(500).send("Internal Server Error in planning trip");
  }
}
async function deletePlannedTrip(req, res) {
  const { id } = req.body;
  try {
    const tripToDelete = await plannedTrip.findOne({ _id: id });
    if (!tripToDelete) {
      console.error("Planned trip not found");
      return res.redirect("/");
    }
    await plannedTrip.deleteOne({ _id: tripToDelete._id });
    res.redirect("/");
  } catch (err) {
    console.error("Error deleting planned trip:", err);
    res.status(500).send("Internal Server Error in deleting planned trip");
  }
}
function dijkstra(start, end, locations, routes) {
  const distances = {};
  const prev = {};
  const pq = [];
  const cur_routes = [];

  routes.forEach((route) => {
    cur_routes.push({
      from: route.from.name,
      to: route.to.name,
      distance: route.distance,
    });
    cur_routes.push({
      from: route.to.name,
      to: route.from.name,
      distance: route.distance,
    });
  });

  locations.forEach((loc) => {
    distances[loc] = Infinity;
    prev[loc] = null;
  });
  distances[start] = 0;
  pq.push({ loc: start, dist: 0 });

  while (pq.length > 0) {
    pq.sort((a, b) => a.dist - b.dist);
    const { loc } = pq.shift();

    cur_routes
      .filter((r) => r.from === loc)
      .forEach((r) => {
        const alt = distances[loc] + r.distance;
        if (alt < distances[r.to]) {
          distances[r.to] = alt;
          prev[r.to] = loc;
          pq.push({ loc: r.to, dist: alt });
        }
      });
  }

  const path = [];
  let curr = end;
  while (curr) {
    path.unshift(curr);
    curr = prev[curr];
  }

  return {
    start,
    end,
    distance: distances[end],
    path: distances[end] === Infinity ? [] : path,
  };
}

async function renderMapPage(req, res) {
  try {
    const locations = await location.find().select("name -_id");
    const routes = await Route.find()
      .populate("from", "name -_id")
      .populate("to", "name -_id");

    res.render("map", { locations, routes });
  } catch (err) {
    console.error("Error rendering map page:", err);
    res.status(500).send("Internal Server Error in rendering map page");
  }
}

async function calculateShortestPath(req, res) {
  const start = req.query.start;
  const end = req.query.end;
  try {
    if (!start || !end) {
      return res.status(400).json({ error: "Start and end are required" });
    }
    const locations = await location.find().select("name -_id");
    const routes = await Route.find()
      .populate("from", "name -_id")
      .populate("to", "name -_id");
    const result = dijkstra(
      start,
      end,
      locations.map((loc) => loc.name),
      routes
    );
    console.log("Result:", result);
    res.json(result);
  } catch (err) {
    console.error("Error calculating shortest path:", err);
    res.status(500).send("Internal Server Error in calculating shortest path");
  }
}

module.exports = {
  renderHomePage,
  renderLocationsPage,
  addLocation,
  renderRoutesPage,
  addRoute,
  renderTripPage,
  planTrip,
  deletePlannedTrip,
  renderMapPage,
  calculateShortestPath,
  deleteLocation,
  deleteRoutes,
};
