// Mock data (can be imported from app.js if needed)
let plannedTrips = [];
let locations = [];
let routes = [];

// Function to render the home page
function renderHomePage(req, res) {
    res.render('index', { plannedTrips,session: req.session});
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

    // Check if a route already exists between the two nodes (in either direction)
    const routeExists = routes.some(route => 
        (route.from === from && route.to === to) || 
        (route.from === to && route.to === from)
    );

    if (routeExists) {
        console.log("Route already exists between these nodes");
        return res.redirect('/routes');
    }

    // Add the route if it doesn't already exist
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



// Dijkstra's algorithm function
function dijkstra(start, end, locations, routes) {
    const distances = {};
    const prev = {};
    const pq = [];
    const cur_routes=[];
    for (let i = 0; i < routes.length; i++) {
        const route = routes[i];
        cur_routes.push({ from: route.from, to: route.to, distance: route.distance });
        cur_routes.push({ from: route.to, to: route.from, distance: route.distance });
    }
    locations.forEach(loc => {
        distances[loc] = Infinity;
        prev[loc] = null;
    });
    distances[start] = 0;
    pq.push({ loc: start, dist: 0 });

    while (pq.length > 0) {
        pq.sort((a, b) => a.dist - b.dist);
        const { loc } = pq.shift();

        cur_routes
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

// Function to render the map page
function renderMapPage(req, res) {
     console.log("Rendering map page");
    res.render('map', { locations, routes });
}


    function calculateShortestPath(req, res) {
        const start = req.query.start;
        const end = req.query.end;
        console.log("Start:", start);
        console.log("End:", end);
        console.log("Locations:", locations);
        console.log("Routes:", routes);
    
        if (!start || !end) {
            return res.status(400).json({ error: 'Start and end are required' });
        }
    
        const result = dijkstra(start, end, locations, routes);
        console.log("Result:", result);
        res.json(result);
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
    calculateShortestPath
};