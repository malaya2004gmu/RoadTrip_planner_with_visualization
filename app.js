const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const {renderHomePage, renderLocationsPage, renderRoutesPage, renderTripPage, renderMapPage,addLocation,addRoute,planTrip,calculateShortestPath} = require('./controllers/graph_controer.js');
const {renderLogin,handleLogin,handleLogout,ensureAuthenticated,handleRegister,handleRegisterPost} = require('./controllers/user_controler.js');
const app = express();

app.use(session({
    secret: 'road_trip_planer', // Replace with a secure key
    resave: false,
    saveUninitialized: false
}));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));


app.get('/register',handleRegister);
app.post('/register',handleRegisterPost);
app.get('/login',renderLogin);
app.post('/login',handleLogin);

app.get('/logout',handleLogout);
app.get('/', renderHomePage);
app.get('/locations',ensureAuthenticated, renderLocationsPage);
app.post('/locations', ensureAuthenticated,addLocation);
app.get('/routes', ensureAuthenticated,renderRoutesPage);
app.post('/routes', ensureAuthenticated,addRoute);
app.get('/plan-trip', ensureAuthenticated,renderTripPage);
app.post('/plan-trip', ensureAuthenticated,planTrip);
app.get('/map', ensureAuthenticated,renderMapPage);
app.get('/shortest-path',ensureAuthenticated,calculateShortestPath);


// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
