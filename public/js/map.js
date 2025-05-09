const graphData = {
  nodes: JSON.parse(document.getElementById("graph-nodes").textContent),
  links: JSON.parse(document.getElementById("graph-links").textContent),
};

const svg = d3.select("svg"),
  width = +svg.attr("width"),
  height = +svg.attr("height");

const container = svg.append("g");

// Zoom & pan behavior
const zoom = d3
  .zoom()
  .scaleExtent([0.1, 4])
  .on("zoom", (event) => {
    container.attr("transform", event.transform);
  });

svg.call(zoom);

const simulation = d3
  .forceSimulation(graphData.nodes)
  .force(
    "link",
    d3
      .forceLink(graphData.links)
      .id((d) => d.id)
      .distance((d) => Math.min(d.distance * 2, 200))
  )
  .force("charge", d3.forceManyBody().strength(-300))
  .force("center", d3.forceCenter(width / 2, height / 2));

// Links (edges)
const link = container
  .append("g")
  .attr("stroke", "#999")
  .attr("stroke-opacity", 0.6)
  .selectAll("line")
  .data(graphData.links)
  .enter()
  .append("line")
  .attr("stroke-width", 2);

// Nodes (circles)
const node = container
  .append("g")
  .attr("stroke", "#e74c3c")
  .attr("stroke-width", 1.5)
  .selectAll("circle")
  .data(graphData.nodes)
  .enter()
  .append("circle")
  .attr("r", 15)
  .attr("fill", "#007bff")
  .call(drag(simulation));

// For selecting two nodes
let selectedNodes = [];
node.on("click", (event, d) => {
  if (selectedNodes.length < 2) {
    selectedNodes.push(d.id);
    d3.select(event.currentTarget).attr("fill", "orange");
  }
});

// Add event listener to the button
document.getElementById("calculate-path").addEventListener("click", () => {
  if (selectedNodes.length === 2) {
    const [start, end] = selectedNodes;

    // Make a GET request to your backend
    fetch(
      `/shortest-path?start=${encodeURIComponent(
        start
      )}&end=${encodeURIComponent(end)}`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("Shortest path result:", data);

        if (data.path.length === 0) {
          alert("No path found between these nodes.");
        } else {
          // Highlight path links
          link
            .attr("stroke", (d) => {
              return isInBackendPath(d, data.path) ? "red" : "#999";
            })
            .attr("stroke-width", (d) =>
              isInBackendPath(d, data.path) ? 4 : 2
            );

          // Display path details
          const pathDetails = document.getElementById("path-details");
          pathDetails.innerHTML = `
            <h3>Shortest Path</h3>
            <p><strong>From:</strong> ${data.start}</p>
            <p><strong>To:</strong> ${data.end}</p>
            <p><strong>Path:</strong> ${data.path.join(" → ")}</p>
            <p><strong>Distance:</strong> ${data.distance} km</p>
          `;
        }

        // Reset after selection
        setTimeout(() => {
          node.attr("fill", "#007bff");
          link.attr("stroke", "#999").attr("stroke-width", 2);
          selectedNodes = [];
        }, 4000);
      });
  } else {
    alert("Please select exactly two nodes.");
  }
});

// Helper function to check if a link is part of the shortest path
function isInBackendPath(link, path) {
  for (let i = 0; i < path.length - 1; i++) {
    if (
      (link.source.id === path[i] && link.target.id === path[i + 1]) ||
      (link.source.id === path[i + 1] && link.target.id === path[i])
    ) {
      return true;
    }
  }
  return false;
}

// Node labels
const text = container
  .append("g")
  .selectAll("text")
  .data(graphData.nodes)
  .enter()
  .append("text")
  .attr("text-anchor", "middle")
  .attr("dy", 4)
  .attr("font-size", 12)
  .attr("fill", "#e74c3")
  .text((d) => d.id);

// Edge labels (distances)
const linkText = container
  .append("g")
  .selectAll("text")
  .data(graphData.links)
  .enter()
  .append("text")
  .attr("font-size", 12)
  .attr("fill", "#555")
  .attr("text-anchor", "middle")
  .text((d) => `${d.distance} km`);

// Update positions each tick
simulation.on("tick", () => {
  link
    .attr("x1", (d) => d.source.x)
    .attr("y1", (d) => d.source.y)
    .attr("x2", (d) => d.target.x)
    .attr("y2", (d) => d.target.y);

  node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);

  text.attr("x", (d) => d.x).attr("y", (d) => d.y);

  linkText
    .attr("x", (d) => (d.source.x + d.target.x) / 2)
    .attr("y", (d) => (d.source.y + d.target.y) / 2);
});

// Drag behavior helper
function drag(simulation) {
  return d3
    .drag()
    .on("start", (event, d) => {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    })
    .on("drag", (event, d) => {
      d.fx = event.x;
      d.fy = event.y;
    })
    .on("end", (event, d) => {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    });
}
