// CONSTANTS
// ---------

/** Container for the network visualization. */
const CONTAINER  = document.querySelector('body .container');
/** Time interval for updating the simulation. */
const TIME_STEP  = 10;
/** Time error of the client/server. */
const TIME_ERROR = 200;
/** Additional delay before recieving a request. */
const RECIEVE_DELAY = 100;
/** Additional delay before responding to a request. */
const RESPONSE_DELAY = 100;
/** Additional delay before sending a response. */
const TRANSMIT_DELAY = 100;




// STATE
// -----

/** Definition of the network. */
var graph = {
  // NTP server:
  'stratum1.net': {
    type: 'server', x: 50, y: 50,
    links: ['as29076.asbr.router', '115.247.100.30'],
  },
  // NTP clients:
  'indus.iiit.ac.in': {
    type: 'client', x: 20, y: 50,
    links: ['as29076.asbr.router', '202.56.234.85'],
  },
  'che.iith.ac.in': {
    type: 'client', x: 80, y: 50,
    links: ['182.79.239.199', '49.44.220.188'],
  },
  'cc.iitj.ac.in': {
    type: 'client', x: 40, y: 80,
    links: ['202.56.234.85', '182.79.203.159'],
  },
  // Network routers:
  'as29076.asbr.router': {
    type: 'router', x: 30, y: 20,
    links: ['stratum1.net', 'indus.iiit.ac.in', '182.79.239.199'],
  },
  '182.79.239.199': {
    type: 'router', x: 70, y: 20,
    links: ['as29076.asbr.router', 'che.iith.ac.in'],
  },
  '49.44.220.188': {
    type: 'router', x: 70, y: 50,
    links: ['che.iith.ac.in', '182.79.203.159'],
  },
  '115.247.100.30': {
    type: 'router', x: 40, y: 60,
    links: ['stratum1.net', '202.56.234.85', '182.79.203.159'],
  },
  '202.56.234.85': {
    type: 'router', x: 20, y: 70,
    links: ['indus.iiit.ac.in', 'cc.iitj.ac.in', '115.247.100.30'],
  },
  '182.79.203.159': {
    type: 'router', x: 60, y: 70,
    links: ['cc.iitj.ac.in', '49.44.220.188', '115.247.100.30'],
  },
};

/** Nodes in the network. */
var nodes = [];
/** Links between nodes. */
var links = [];
/** Packets in the network. */
var packets = [];




// METHODS
// -------

/**
 * Set up the network nodes and links.
 * @param {*} graph definition of the network
 */
function setupNetwork(graph) {
  var names = Object.keys(graph);
  // Populate the nodes array.
  for (var i=0, I=names.length; i<I; ++i) {
    var name  = names[i];
    var {type, x, y, links: edges} = graph[name];
    var edges = edges.map(e => names.indexOf(e));
    var scale = type==='server'? 0.1 : 1;
    var currentTime   = TIME_ERROR * Math.random() * scale;
    var timeError     = type==='server'? 0 : -1;
    var recieveDelay  = scale * RECIEVE_DELAY  * Math.random();
    var responseDelay = scale * RESPONSE_DELAY * Math.random();
    var transmitDelay = scale * TRANSMIT_DELAY * Math.random();
    nodes.push({type, name, x, y, links: edges, currentTime, timeError, recieveDelay, responseDelay, transmitDelay});
  }
  // Populate the links array.
  for (var i=0, I=nodes.length; i<I; ++i) {
    for (var j of nodes[i].links) {
      var distance = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
      links.push({source: i, target: j, distance});
    }
  }
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
