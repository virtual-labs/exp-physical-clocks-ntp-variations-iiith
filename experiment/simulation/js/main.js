//#region CONSTANTS
const CONTAINER = document.querySelector('body .container');
//#endregion

//#region STATE
/** Nodes in the network. */
var nodes = [
  // NTP server:
  {type: 'server', name: 'stratum1.net'},
  // NTP clients:
  {type: 'client', name: 'indus.iiit.ac.in'},
  {type: 'client', name: 'che.iith.ac.in'},
  {type: 'client', name: 'sharanga.hpc.bits-hyderabad.ac.in'},
  {type: 'client', name: 'cmsd.uohyd.ac.in'},
  {type: 'client', name: 'hpc.iitgoa.ac.in'},
  {type: 'client', name: 'cc.iitj.ac.in'},
  // Obtained using traceroute to stratum1.net:
  {type: 'switch', name: 'mil-cr01-te6-2.lnd.stream-internet.net'},
  {type: 'switch', name: 'anc-cr01-be5.204.ff.mts-internet.net'},
  {type: 'switch', name: 'kivi-cr02-ae3.149.hel.mts-internet.net'},
  {type: 'switch', name: 'bor-cr02-ae5.0.spb.mts-internet.net'},
  {type: 'switch', name: 'bor-cr01-ae0.0.spb.mts-internet.net'},
  {type: 'switch', name: 'as29076.asbr.router'},
  {type: 'switch', name: 'vermont.msk.cloud-ix.net'},
  {type: 'switch', name: 'host-94.198.132.184.vernet.su'},
  // Obtained using traceroute to che.iith.ac.in:
  {type: 'switch', name: '182.79.239.199'},
  {type: 'switch', name: '49.44.220.188'},
  {type: 'switch', name: '115.247.100.30'},
  // Obtained using traceroute to sharanga.hpc.bits-hyderabad.ac.in:
  {type: 'switch', name: '202.56.234.85'},
  {type: 'switch', name: '182.79.203.159'},
  {type: 'switch', name: 'hyderabad.bits-pilani.ac.in'},
  {type: 'switch', name: '125.22.54.219'},
  {type: 'switch', name: 'aes-static-219.54.22.125.airtel.in'},
  // Obtained using traceroute to cmsd.uohyd.ac.in:
  {type: 'switch', name: '14.139.69.5'},
  // Obtained using traceroute to hpc.iitgoa.ac.in:
  {type: 'switch', name: '59.144.94.165'},
  // Obtained using traceroute to cc.iitj.ac.in:
  {type: 'switch', name: '136.232.148.178'},
];

/** Links between nodes. */
var links = [];
//#endregion




//#region METHODS
/**
 * Find the index of the node at the given coordinates.
 * @param {Array} nodes nodes in the network
 * @param {number} bx x-coordinate of the box
 * @param {number} by y-coordinate of the box
 * @param {number} bw width of the box
 * @param {number} bh height of the box
 * @returns {number} index of the node at the given coordinates
 */
function searchNodeAt(nodes, bx, by, bw, bh) {
  for (var i=0, I=nodes.length; i<I; ++i) {
    var {x, y, w, h} = nodes[i];
    if (x < 0 || y < 0) continue;
    var a = bx >= x && bx <= x+w;
    var b = by >= y && by <= y+h;
    var c = bx+bw >= x && bx+bw <= x+w;
    var d = by+bh >= y && by+bh <= y+h;
    if ((a && b) || (c && d) || (a && d) || (c && b)) return i;
  }
  return -1;
}


/**
 * Rearrange the nodes and create new links between them.
 * @param {Array} nodes nodes in the network (updated)
 * @param {Array} links links between nodes (updated)
 */
function reorganizeNetwork(nodes, links) {
  // Initialize nodes.
  for (var n of nodes) {
    n.x = -1;
    n.y = -1;
    n.w = n.type==='server'? 5 : (n.type==='client'? 5 : 3);
    n.h = n.type==='server'? 5 : (n.type==='client'? 5 : 3);
  }
  // Rearrange nodes in the network.
  for (var n of nodes) {
    do {
      var px = Math.round(10 + 80 * Math.random());
      var py = Math.round(10 + 80 * Math.random());
      var i  = searchNodeAt(nodes, px, py, n.w, n.h);
      if (i>=0) console.log(i, 'collides with', nodes.indexOf(n), 'at', px, py, n);
    } while (i>=0);
    n.x = px;
    n.y = py;
  }
  // Create new links between nodes.
}

/**
 * Draw nodes in the network.
 * @param {Array} nodes nodes in the network
 */
function drawNodes(nodes) {
  for (var n of nodes) {
    var e = document.createElement('div');
    e.className  = n.type;
    e.title      = n.name;
    e.style.left = `${n.x}%`;
    e.style.top  = `${n.y}%`;
    CONTAINER.appendChild(e);
  }
}


// Initialize simulation environment
function initSimulation() {
  // Create node objects and add them to the nodes array
  reorganizeNetwork(nodes, links);
  drawNodes(nodes);
  // Create NTP server object
  createNtpServer();
}

// Function to create NTP server object
function createNtpServer() {
    ntpServer = {
        element: document.getElementById('ntpServer'),
        // Add other properties as needed
    };
}

// Function to start the simulation
function startSimulation() {
    // Animate node interactions, NTP communication, etc.
    animateNodes();
    animateNtpServer();
}

// Function to animate node interactions
function animateNodes() {
    // Use Anime.js to animate node interactions
    // For example, moving nodes, changing colors, etc.
}

// Function to animate NTP server
function animateNtpServer() {
    // Use Anime.js to animate NTP server behavior
    // For example, transmitting time updates to nodes, adjusting clock, etc.
}

// Function to adjust simulation parameters
function adjustParameters() {
    // Allow users to adjust simulation parameters
    // For example, network delay, packet loss, etc.
}

// Function to handle user interactions with nodes
function handleNodeClick(nodeId) {
    // Handle user interactions with nodes (e.g., display node information)
}

// Initialize simulation environment when the page is loaded
window.onload = function() {
    initSimulation();
};
//#endregion
