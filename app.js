const express = require('express');
const bodyParser = require('body-parser');
const {renderHomePage, renderLocationsPage, renderRoutesPage, renderTripPage, renderMapPage,addLocation,addRoute,planTrip} = require('./controllers/main_controller.js');
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', renderHomePage);
app.get('/locations', renderLocationsPage);
app.post('/locations', addLocation);
app.get('/routes', renderRoutesPage);
app.post('/routes', addRoute);
app.get('/plan-trip', renderTripPage);
app.post('/plan-trip', planTrip);
app.get('/map', renderMapPage);


// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
