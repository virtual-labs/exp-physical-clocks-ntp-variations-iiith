// CONSTANTS
// ---------

const SIMULATION       = document.querySelector('#simulation');
const CONTROLS         = document.querySelector('#controls form');
const START_SIMULATION = document.querySelector('#start-simulation');
const STOP_SIMILATION  = document.querySelector('#stop-simulation');
const PACKET_IMAGE_URL = './images/packet-64.png';
const PARAMETERS = {
  // Network and Simulation Parameters.
  networkTrip: 100,
  networkAsymmetry: 20,
  networkTripVariation: 20,
  simulationSpeed: 10,
  // NTP Client Parameters.
  clientOffset: 0,
  clientDriftRate: 0,
  clientSyncInterval: 1000,
  clientSyncPeriod: 100,
  clientPacketInterval: 10,
  // NTP Server Parameters.
  serverError: 0,
  serverResponseDelay: 0,
};



// STATE
// -----

var parameters = Object.assign({}, PARAMETERS);
var simulation = {
  running: false,
  paused:  false,
  lastPacket: 0,
};
var timers = [];




// METHODS
// -------

function simulationLoop() {
  var s = simulation;
}


/** Called when "Send Packet" button is clicked. */
function onSendPacket() {
  var s = simulation;
  createPacket(++s.lastPacket, 0);
}


/** Create a new packet. */
function createPacket(id, time) {
  var p = parameters;
  var tripPeriod = p.networkTrip + Math.random() * p.networkTripVariation;
  var sendPeriod = tripPeriod/2  + Math.random() * p.networkAsymmetry;
  var packet = {
    id: id,
    clientSendTime:    time,
    serverRecieveTime: time + sendPeriod,
    serverSendTime:    time + sendPeriod + p.serverResponseDelay,
    clientRecieveTime: time + tripPeriod + p.serverResponseDelay,
  };
  var serverRecieveMs = 1000 * sendPeriod / p.simulationSpeed;
  var serverSendMs    = 1000 * (sendPeriod + p.serverResponseDelay) / p.simulationSpeed;
  var clientRecieveMs = 1000 * (tripPeriod + p.serverResponseDelay) / p.simulationSpeed;
  console.log({tripPeriod, sendPeriod, serverRecieveMs, serverSendMs, clientRecieveMs});
  var sendHtml    = createSendPacketHtml(id, serverRecieveMs);
  var recieveHtml = createRecievePacketHtml(id, clientRecieveMs - serverRecieveMs);
  SIMULATION.appendChild(sendHtml);
  timers.push(new Timer(() => SIMULATION.removeChild(sendHtml),    serverRecieveMs));
  timers.push(new Timer(() => SIMULATION.appendChild(recieveHtml), serverSendMs));
  timers.push(new Timer(() => SIMULATION.removeChild(recieveHtml), clientRecieveMs));
  return packet;
}


/** Create HTML for a send packet. */
function createSendPacketHtml(id, sendMs) {
  var div   = document.createElement('div');
  div.id    = 'send-' + id;
  div.className = 'send-packet';
  div.style = `animation-duration: ${sendMs}ms;`;
  var info  = document.createElement('div');
  info.textContent = id.toString();
  var img   = document.createElement('img');
  img.src   = PACKET_IMAGE_URL;
  div.appendChild(info);
  div.appendChild(img);
  return div;
}


/** Create HTML for a recieve packet. */
function createRecievePacketHtml(id, recieveMs) {
  var div  = document.createElement('div');
  div.id    = 'recieve-' + id;
  div.className = 'recieve-packet';
  div.style = `animation-duration: ${recieveMs}ms;`;
  var info  = document.createElement('div');
  info.textContent = id.toString();
  var img   = document.createElement('img');
  img.src   = PACKET_IMAGE_URL;
  div.appendChild(img);
  div.appendChild(info);
  return div;
}


/** Called when "Start Simulation" button is clicked. */
function onStartSimulation() {
  onAdjustParameters();
  var s = simulation;
  s.paused  = s.running? !s.paused : false;
  s.running = true;
  updateButtons();
}


/** Called when "Stop Simulation" button is clicked. */
function onStopSimulation() {
  var s = simulation;
  s.running = false;
  s.paused  = false;
  updateButtons();
}


/** Update buttons based on the current state of the simulation. */
function updateButtons() {
  var s = simulation;
  START_SIMULATION.textContent = !s.running? 'Start Simulation' : s.paused? 'Resume Simulation' : 'Pause Simulation';
  STOP_SIMILATION.disabled     = !s.running;
}


/** Called when "Adjust Parameters" button is clicked. */
function onAdjustParameters() {
  var p    = parameters;
  var data = new FormData(CONTROLS);
  p.networkTrip           = parseFloat(data.get('network-trip'))            || PARAMETERS.networkTrip;
  p.networkAsymmetry      = parseFloat(data.get('network-asymmetry'))       || PARAMETERS.networkAsymmetry;
  p.networkTripVariation  = parseFloat(data.get('network-trip-variation'))  || PARAMETERS.networkTripVariation;
  p.simulationSpeed       = parseFloat(data.get('simulation-speed'))        || PARAMETERS.simulationSpeed;
  p.clientOffset          = parseFloat(data.get('client-offset'))           || PARAMETERS.clientOffset;
  p.clientDriftRate       = parseFloat(data.get('client-drift-rate'))       || PARAMETERS.clientDriftRate;
  p.clientSyncInterval    = parseFloat(data.get('client-sync-interval'))    || PARAMETERS.clientSyncInterval;
  p.clientSyncPeriod      = parseFloat(data.get('client-sync-packets'))     || PARAMETERS.clientSyncPeriod;
  p.clientPacketInterval  = parseFloat(data.get('client-packet-interval'))  || PARAMETERS.clientPacketInterval;
  p.serverError           = parseFloat(data.get('server-error'))            || PARAMETERS.serverError;
  p.serverResponseDelay   = parseFloat(data.get('server-response-delay'))   || PARAMETERS.serverResponseDelay;
}


/** Called when "Controls" form is submitted. */
function onControls(e) {
  e.preventDefault();
  return false;
}


/** Main function. */
function main() {
  CONTROLS.addEventListener('submit', onControls);
}
main();




// CLASSES
// -------

/** A Pauseable Timer. */
class Timer {
  /** Create a new timer. */
  constructor(callback, delay) {
    this.timerId   = setTimeout(callback, delay);
    this.callback  = callback;
    this.remaining = delay;
    this.start     = Date.now();
  }

  /** Pause the timer. */
  pause() {
    clearTimeout(this.timerId);
    this.remaining -= Date.now() - this.start;
  }

  /** Resume the timer. */
  resume() {
    clearTimeout(this.timerId);
    this.timerId = setTimeout(this.callback, this.remaining);
    this.start   = Date.now();
  }

  /** Clear the timer. */
  clear() {
    clearTimeout(this.timerId);
  }
}
