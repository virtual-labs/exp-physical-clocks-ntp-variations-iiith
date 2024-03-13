// CONSTANTS
// ---------

const CONTROLS         = document.querySelector('#controls form');
const START_SIMULATION = document.querySelector('#start-simulation');
const STOP_SIMILATION  = document.querySelector('#stop-simulation');
const PARAMETERS = {
  // Client Parameters.
  clientOffset: 0,
  clientDriftRate: 0,
  clientTransmitDelay: 0,
  clientRecieveDelay: 0,
  clientSyncInterval: 1000,
  // NTP Server Parameters.
  serverError: 0,
  serverRecieveDelay: 0,
  serverResponseDelay: 0,
  serverTransmitDelay: 0,
  // Network and Simulation Parameters.
  networkTrip: 100,
  networkAsymmetry: 20,
  networkTripVariation: 20,
  simulationSpeed: 100,
};



// STATE
// -----

var parameters = Object.assign({}, PARAMETERS);
var simulation = {};




// METHODS
// -------

// Called when "Start Simulation" button is clicked.
function startSimulation() {
  adjustParameters();
  var s = simulation;
  s.paused  = s.running? !s.paused : false;
  s.running = true;
  updateButtons();
}


// Called when "Stop Simulation" button is clicked.
function stopSimulation() {
  var s = simulation;
  s.running = false;
  s.paused  = false;
  updateButtons();
}


// Update buttons based on the current state of the simulation.
function updateButtons() {
  var s = simulation;
  START_SIMULATION.textContent = !s.running? 'Start Simulation' : s.paused? 'Resume Simulation' : 'Pause Simulation';
  STOP_SIMILATION.disabled     = !s.running;
}


// Called when "Adjust Parameters" button is clicked.
function adjustParameters() {
  var p    = parameters;
  var data = new FormData(CONTROLS);
  p.clientOffset          = parseFloat(data.get('client-offset'))           || PARAMETERS.clientOffset;
  p.clientDriftRate       = parseFloat(data.get('client-drift-rate'))       || PARAMETERS.clientDriftRate;
  p.clientTransmitDelay   = parseFloat(data.get('client-transmit-delay'))   || PARAMETERS.clientTransmitDelay;
  p.clientRecieveDelay    = parseFloat(data.get('client-recieve-delay'))    || PARAMETERS.clientRecieveDelay;
  p.clientSyncInterval    = parseFloat(data.get('client-sync-interval'))    || PARAMETERS.clientSyncInterval;
  p.serverError           = parseFloat(data.get('server-error'))            || PARAMETERS.serverError;
  p.serverRecieveDelay    = parseFloat(data.get('server-recieve-delay'))    || PARAMETERS.serverRecieveDelay;
  p.serverResponseDelay   = parseFloat(data.get('server-response-delay'))   || PARAMETERS.serverResponseDelay;
  p.serverTransmitDelay   = parseFloat(data.get('server-transmit-delay'))   || PARAMETERS.serverTransmitDelay;
  p.networkTrip           = parseFloat(data.get('network-trip'))            || PARAMETERS.networkTrip;
  p.networkAsymmetry      = parseFloat(data.get('network-asymmetry'))       || PARAMETERS.networkAsymmetry;
  p.networkTripVariation  = parseFloat(data.get('network-trip-variation'))  || PARAMETERS.networkTripVariation;
  p.simulationSpeed       = parseFloat(data.get('simulation-speed'))        || PARAMETERS.simulationSpeed;
  return false;
}


// Called when "Controls" form is submitted.
function onControls(e) {
  e.preventDefault();
  return false;
}


// Main function.
function main() {
  CONTROLS.addEventListener('submit', onControls);
}
main();
