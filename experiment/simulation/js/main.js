// CONSTANTS
// ---------

const SIMULATION        = document.querySelector('#simulation canvas');
const CONTROLS          = document.querySelector('#controls form');
const START_SIMULATION  = document.querySelector('#start-simulation');
const STOP_SIMILATION   = document.querySelector('#stop-simulation');
const START_AUDIO       = document.querySelector('#start-audio');
const STOP_AUDIO        = document.querySelector('#stop-audio');
const PAUSE_AUDIO       = document.querySelector('#pause-audio');
const ADJUST_AUDIO      = document.querySelector('#adjust-audio');
const SYNCHRONIZE_AUDIO = document.querySelector('#synchronize-audio');
const SEND_AUDIO        = document.querySelector('#send-audio');
const BACKGROUND_IMG    = 'https://i.imgur.com/XTXWSxs.jpeg';
const PACKET_IMG        = './images/packet-64.png';
const PARAMETERS = {
  // Network and Simulation Parameters.
  networkTrip: 100,
  networkAsymmetry: 20,
  networkTripVariation: 20,
  simulationSpeed: 10,
  // NTP Client Parameters.
  clientOffset: 10,
  clientDriftRate: 0,
  clientSyncInterval: 1000,
  clientSyncPeriod: 100,
  clientPacketInterval: 10,
  // NTP Server Parameters.
  serverError: 0,
  serverResponseDelay: 10,
};



// STATE
// -----

var parameters = Object.assign({}, PARAMETERS);
var simulation = {
  isRunning: true,
  isPaused:  false,
  isResumed: true,
  timestamp: 0,
  time: 0,
  clientTime: PARAMETERS.clientOffset,
  clientError: 0,
  lastSyncTime:   -PARAMETERS.clientSyncInterval * 0.9,
  lastPacketTime: -PARAMETERS.clientPacketInterval,
  clientSent: 0,
  serverSent: 0,
  clientRecieved: 0,
  serverRecieved: 0,
  clientSyncs: 0,
};
var packets = [];
var images  = {
  isLoaded: false,
  background: null,
  packet:     null,
};




// METHODS
// -------

/** Main function. */
function main() {
  CONTROLS.addEventListener('submit', onControls);
  requestAnimationFrame(simulationLoop);
  drawButtons();
}
main();


/** Main simulation loop. */
function simulationLoop(timestamp) {
  var s = simulation;
  if (!s.isRunning || s.isPaused) return;
  if (s.isResumed) {
    s.timestamp = timestamp;
    s.isResumed = false;
  }
  else updateSimulation(timestamp);
  renderSimulation();
  requestAnimationFrame(simulationLoop);
}


/** Update the simulation. */
function updateSimulation(timestamp) {
  var s = simulation;
  var p = parameters;
  // Update the simulation time.
  var dt      = 0.001 * p.simulationSpeed * (timestamp - s.timestamp);
  s.timestamp = timestamp;
  s.time       += dt;
  s.clientTime += dt + 1e-6 * p.clientDriftRate * dt;
  // Process packets in the simulation.
  for (var m of packets) {
    if (s.time >= m.serverRecieveTime && !m.hasServerRecieved) {
      m.hasServerRecieved = true;
      ++s.serverRecieved;
    }
    if (s.time >= m.serverSendTime    && !m.hasServerSent) {
      m.hasServerSent = true;
      ++s.serverSent;
    }
    if (s.time >= m.clientRecieveTime && !m.hasClientRecieved) {
      m.hasClientRecieved = true;
      ++s.clientRecieved;
    }
  }
  // Send packets from the client to the server, if necessary.
  if (s.clientTime >= s.lastSyncTime   + p.clientSyncInterval &&
      s.clientTime <  s.lastSyncTime   + p.clientSyncInterval + p.clientSyncPeriod &&
      s.clientTime >= s.lastPacketTime + p.clientPacketInterval) {
    packets.push(createPacket(++s.clientSent, s.time));
    s.lastPacketTime = s.clientTime;
  }
  // Sync the client with the server, if necessary.
  if (s.clientTime >= s.lastSyncTime + p.clientSyncInterval + p.clientSyncPeriod
      && s.clientSent === s.clientRecieved) {
    syncClient();
    s.lastSyncTime = s.clientTime;
    ++s.clientSyncs;
  }
}


/** Reset the simulation. */
function resetSimulation() {
  var s = simulation;
  var p = parameters;
  s.isRunning = false;
  s.isPaused  = false;
  s.isResumed = true;
  s.timestamp   = 0;
  s.time        = 0;
  s.clientTime  = p.clientOffset;
  s.clientError = 0;
  s.lastSyncTime   = -p.clientSyncInterval * 0.9;
  s.lastPacketTime = -p.clientPacketInterval;
  s.clientSent = 0;
  s.serverSent = 0;
  s.clientRecieved = 0;
  s.serverRecieved = 0;
  s.clientSyncs = 0;
  packets = [];
}


/** Render the simulation. */
function renderSimulation() {
  var i = images;
  if (!i.isLoaded) loadImages();
  var ctx  = SIMULATION.getContext('2d');
  ctx.font = '13px sans-serif';
  ctx.textAlign = 'center';
  drawBackground(ctx);
  drawClientStatus(ctx);
  drawServerStatus(ctx);
  drawPackets(ctx);
}


/** Sync the client with the server. */
function syncClient() {
  var s = simulation;
  var p = parameters;
  var entries = [];
  // Get details from packets that have been recieved.
  for (var i=0, j=0; i<packets.length; ++i) {
    var m = packets[i];
    packets[j] = m;  // Remove processed packets.
    var isRecieved = s.time >= m.clientRecieveTime;
    if (!isRecieved) { ++j; continue; }
    var t0 = m.clientSendTime;
    var t1 = m.serverRecieveTime;
    var t2 = m.serverSendTime;
    var t3 = m.clientRecieveTime;
    var roundTrip  = (t3 - t0)   - (t2 - t1);
    var timeOffset = (t1 + t2)/2 - (t0 + t3)/2;
    entries.push({roundTrip, timeOffset});
  }
  // Remove outliers.
  entries.sort((a, b) => a.timeOffset - b.timeOffset);
  entries = entries.slice(1, -1);
  entries.sort((a, b) => a.roundTrip - b.roundTrip);
  entries = entries.slice(1, -1);
  // Calculate average round trip and time offset.
  var roundTrip  = 0;
  var timeOffset = 0;
  for (var m of entries) {
    roundTrip  += m.roundTrip;
    timeOffset += m.timeOffset;
  }
  roundTrip  /= entries.length;
  timeOffset /= entries.length;
  // Update the client time.
  s.clientTime  -= timeOffset;
  s.clientError  = roundTrip/2 + p.serverError;
}


/** Create a new packet. */
function createPacket(id, time) {
  var p = parameters;
  var tripPeriod = p.networkTrip + Math.random() * p.networkTripVariation;
  var sendPeriod = tripPeriod/2  + Math.random() * p.networkAsymmetry;
  return {
    id: id,
    clientSendTime:    time,
    serverRecieveTime: time + sendPeriod,
    serverSendTime:    time + sendPeriod + p.serverResponseDelay,
    clientRecieveTime: time + tripPeriod + p.serverResponseDelay,
    hasServerRecieved: false,
    hasServerSent:     false,
    hasClientRecieved: false,
  };
}


/** Called when "Controls" form is submitted. */
function onControls(e) {
  e.preventDefault();
  return false;
}


/** Called when "Start Simulation" button is clicked. */
function onStartSimulation() {
  adjustParameters();
  var s = simulation;
  if (!s.isRunning) START_AUDIO.play();
  else PAUSE_AUDIO.play();
  s.isPaused  = s.isRunning? !s.isPaused : false;
  s.isResumed = !s.isPaused;
  s.isRunning = true;
  requestAnimationFrame(simulationLoop);
  drawButtons();
}


/** Called when "Stop Simulation" button is clicked. */
function onStopSimulation() {
  STOP_AUDIO.play();
  resetSimulation();
  renderSimulation();
  drawButtons();
}


/** Called when "Adjust Parameters" button is clicked. */
function onAdjustParameters() {
  ADJUST_AUDIO.play();
  adjustParameters();
}


/** Adjust the parameters based on the form input. */
function adjustParameters() {
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


/** Called when "Synchronize Now" button is clicked. */
function onSynchronize() {
  SYNCHRONIZE_AUDIO.play();
  var s = simulation;
  var p = parameters;
  // Force a sync by setting the last sync time to a time in the past.
  s.lastSyncTime   = s.clientTime - p.clientSyncInterval;
  s.lastPacketTime = s.clientTime - p.clientPacketInterval;
}


/** Called when "Send Packet" button is clicked. */
function onSendPacket() {
  var s = simulation;
  packets.push(createPacket(++s.clientSent, s.time));
}


/** Draw the client status. */
function drawClientStatus(ctx) {
  var s = simulation;
  ctx.strokeText(`${Math.round(s.clientTime)} ± ${Math.round(s.clientError)} ms`, 70, 200);
  ctx.strokeText(`${Math.round(s.clientTime - s.time)} ms time offset`, 70, 220);
  ctx.strokeText(`${s.clientSyncs} syncs done`, 70, 240);
  ctx.strokeText(`${s.clientSent} packets sent`, 70, 260);
  ctx.strokeText(`${s.clientRecieved} packets recieved`, 70, 280);
}


/** Draw the server status. */
function drawServerStatus(ctx) {
  var s = simulation;
  var p = parameters;
  ctx.strokeText(`${Math.round(s.time)} ± ${p.serverError} ms`, 955, 200);
  ctx.strokeText(`${s.serverRecieved} packets recieved`, 955, 220);
  ctx.strokeText(`${s.serverSent} packets sent`, 955, 240);
}


/** Draw the packets in the simulation. */
function drawPackets(ctx) {
  var s = simulation;
  for (var m of packets) {
    var isSend    = s.time >= m.clientSendTime && s.time <= m.serverRecieveTime;
    var isRecieve = s.time >= m.serverSendTime && s.time <= m.clientRecieveTime;
    if (isSend) drawSendPacket(ctx, m);
    else if (isRecieve) drawRecievePacket(ctx, m);
  }
}


/** Draw a send packet in the simulation. */
function drawSendPacket(ctx, m) {
  var i = images;
  var s = simulation;
  var x = 80 + 840 * (s.time - m.clientSendTime) / (m.serverRecieveTime - m.clientSendTime);
  ctx.drawImage(i.packet, x, 90, 40, 40);
  ctx.strokeText(`#${m.id}`, x + 15, 90);
}


/** Draw a recieve packet in the simulation. */
function drawRecievePacket(ctx, m) {
  var i = images;
  var s = simulation;
  var x = 920 - 840 * (s.time - m.serverSendTime) / (m.clientRecieveTime - m.serverSendTime);
  ctx.drawImage(i.packet, x, 145, 40, 40);
  ctx.strokeText(`#${m.id}`, x + 15, 200);
}


/** Draw the simulation background. */
function drawBackground(ctx) {
  var i = images;
  ctx.drawImage(i.background, 0, 0, 1024, 320);
}


/** Update buttons based on the current state of the simulation. */
function drawButtons() {
  var s = simulation;
  START_SIMULATION.textContent = !s.isRunning? 'Start Simulation' : s.isPaused? 'Resume Simulation' : 'Pause Simulation';
  STOP_SIMILATION.disabled     = !s.isRunning;
}


/** Load images for simulation. */
function loadImages() {
  var i = images;
  i.isLoaded   = true;
  i.background = loadImage(BACKGROUND_IMG);
  i.packet     = loadImage(PACKET_IMG);
}


/** Load an image. */
function loadImage(url) {
  var img = new Image();
  img.src = url;
  return img;
}
