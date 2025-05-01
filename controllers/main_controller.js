// Mock data (can be imported from app.js if needed)
let plannedTrips = [];
let locations = [];
let routes = [];

// Function to render the home page
function renderHomePage(req, res) {
    res.render('index', { plannedTrips });
}

// Function to render the locations page
function renderLocationsPage(req, res) {
    res.render('locations', { locations });
}

// Function to handle adding a location
function addLocation(req, res) {
    const { name } = req.body;
    if (name && !locations.includes(name)) {
        locations.push(name);
    }
    res.redirect('/locations');
}

// Function to render the routes page
function renderRoutesPage(req, res) {
    res.render('routes', { locations, routes });
}

// Function to handle adding a route
function addRoute(req, res) {
    const { from, to, distance } = req.body;
    if (from && to && distance) {
        routes.push({ from, to, distance: parseFloat(distance) });
    }
    res.redirect('/routes');
}

// Function to render the trip planning page
function renderTripPage(req, res) {
    res.render('trip', { locations, result: null });
}

// Function to handle trip planning
function planTrip(req, res) {
    const { start, end, roundTrip } = req.body;
    let result = dijkstra(start, end, locations, routes);

    if (roundTrip) {
        if (result.path.length > 0) {
            result.path.push(...result.path.slice().reverse().slice(1));
            result.distance *= 2;
        }
    }
    plannedTrips.push(result);

    res.render('trip', { locations, result });
}

// Function to render the map page
function renderMapPage(req, res) {
    res.render('map', { locations, routes });
}

// Dijkstra's algorithm function
function dijkstra(start, end, locations, routes) {
    const distances = {};
    const prev = {};
    const pq = [];

    locations.forEach(loc => {
        distances[loc] = Infinity;
        prev[loc] = null;
    });
    distances[start] = 0;
    pq.push({ loc: start, dist: 0 });

    while (pq.length > 0) {
        pq.sort((a, b) => a.dist - b.dist);
        const { loc } = pq.shift();

        routes
            .filter(r => r.from === loc)
            .forEach(r => {
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
        path: distances[end] === Infinity ? [] : path
    };
}

// Export all functions
module.exports = {
    renderHomePage,
    renderLocationsPage,
    addLocation,
    renderRoutesPage,
    addRoute,
    renderTripPage,
    planTrip,
    renderMapPage,
    dijkstra
};