const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const mongoose = require("mongoose");
const path = require("path");

const authRoutes = require("./routes/auth_routes");
const locationRoutes = require("./routes/location_routes");
const routeRoutes = require("./routes/route_routes");
const generalRoutes = require("./routes/general_routes");

const DB_PATH =
  "mongodb+srv://malayasahu2004:Malaya@cluster1.5gsuy.mongodb.net/roadTripPlanner";

const app = express();

app.use(
  session({
    secret: "road_trip_planner",
    resave: false,
    saveUninitialized: false,
  })
);
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Use route handlers
app.use(authRoutes);
app.use(locationRoutes);
app.use(routeRoutes);
app.use(generalRoutes);

// Start server
const PORT = 3000;

mongoose
  .connect(DB_PATH)
  .then(() => {
    console.log("Connected to MongoDB");
    console.log(DB_PATH);
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
