# Road Trip Planner

A Node.js-based web application for planning road trips, managing locations, routes, and calculating the shortest path between destinations.

## Features

- Add, view, and delete locations.
- Add, view, and delete routes between locations.
- Plan trips and calculate the shortest path using Dijkstra's algorithm.
- Store planned trips in a database.
- Securely manage sensitive information using environment variables.

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/) (Atlas or local instance)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd road_trip_planer
   2.install dependencies:
    npm install
   ```
2. Create a .env file in the root directory and add the following:
   DB_PATH=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/roadTripPlanner
   PORT=3000

4.Ensure MongoDB is running and accessible.

Usage-
1.start the server
in terminal node app.js (npm start)
2.Open your browser and navigate to:
http://localhost:3000

PROJECT STRUCTURE
road*trip_planer/
├── controllers/ # Application logic (e.g., graph_controler.js)
├── models/ # Mongoose models (e.g., locations, route_path)
├── routes/ # Route handlers
├── views/ # EJS templates
├── public/ # Static files (CSS, JS, images)
├── [app.js](http://\_vscodecontentref*/0) # Main application file
├── .env # Environment variables
├── .gitignore # Ignored files
├── [package.json](http://_vscodecontentref_/1) # Project metadata and dependencies

TECHNOLOGY USED-

Backend: Node.js, Express.js
Database: MongoDB (Mongoose)
Frontend: EJS (Embedded JavaScript Templates)
Session Management: express-session
Environment Variables: dotenv

ENVIROMENTAL VARIABLES

The following environment variables are required:
DB_PATH: MongoDB connection string.
PORT: Port number for the server (default: 3000).

License
This project is licensed under the ISC License.

---

### Instructions:

1. Replace `<repository-url>` with the URL of your Git repository.
2. Replace `<username>`, `<password>`, and `<cluster>` in the [.env](http://_vscodecontentref_/2) example with your MongoDB credentials.
