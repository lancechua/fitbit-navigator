/*
 * Entry point for the watch app
 */

import { me } from "appbit";
import document from "document";
import * as fs from "fs";
import { geolocation } from "geolocation";
import * as messaging from "messaging";
import { vibration } from "haptics";

import { model } from "./model.js";
import { defaultConfig, enums } from "../common/constants.js";

const SETTINGS_TYPE = "cbor";
const SETTINGS_FILE = "settings.cbor";
const WAYPOINTS_TYPE = "cbor";
const WAYPOINTS_FILE = "waypoints.cbor";

let config;
try {
  config = fs.readFileSync(SETTINGS_FILE, SETTINGS_TYPE);
} catch (ex) {
  config = defaultConfig;
}

let WAYPOINTS;
try {
  WAYPOINTS = fs.readFileSync(WAYPOINTS_FILE, WAYPOINTS_TYPE);
} catch (ex) {
  WAYPOINTS = [{ name: "No WAYPOINTS loaded!", latitude: 0, longitude: 0 }];
}

model.init({
  // elemets
  btn_prev: document.getElementById("btnprev"),
  btn_next: document.getElementById("btnnext"),
  dist_box: document.getElementById("distance"),
  mq_current: document.getElementById("mqcurrent"),
  cir_compass: document.getElementById("circle-compass"),
  arc_dest: document.getElementById("arc-dest"),
  arc_bearing: document.getElementById("arc-bearing"),
  arc_north: document.getElementById("arc-north"),
  north_N: document.getElementById("N"),
  wb_prev: document.getElementById("warnbox-prev"),
  wb_next: document.getElementById("warnbox-next"),

  config: config,
  WAYPOINTS: WAYPOINTS,

  // initial state
  State: {
    wp: 0,
    dist: "calc...",
    unit: "meters",
    prevLoc: undefined,
    curLoc: undefined,
    fixedNorth: false,
    bearing: 0,
    bearingDest: 0,
    lastDeviceGPSUpdate: 0,
  },
});

// CALLBACKS
model.btn_prev.onactivate = function (evt) {
  console.log("btn_prev clicked");
  model.change_waypoint(-1);
};

model.btn_next.onactivate = function (evt) {
  console.log("btn_next clicked");
  model.change_waypoint(1);
};

model.cir_compass.onclick = function (evt) {
  vibration.start("bump");
  console.log("compass circle clicked");
  model.update_state({ fixedNorth: !model.State.fixedNorth });
  model.update_view();
};

document.onkeypress = function (e) {
  if (e.key === "down") {
    console.log("down clicked");
    model.change_waypoint(1);
  } else if (e.key === "up") {
    console.log("up clicked");
    model.change_waypoint(-1);
  }
};

let watchID = geolocation.watchPosition(
  // success callback
  function (position) {
    console.log("Device GPS Update: " + JSON.stringify(position));
    model.update_state({
      curLoc: position,
    });
    model.update_view();
  },
  // failure callback
  function (error) {
    console.log("LocationError: " + error.code + "; Message: " + error.message);
    let update = {
      prevLoc: undefined,
    };
    // retain latest location, unless too old
    if (model.State.curLoc !== undefined) {
      if (Date.now() - model.State.curLoc.timestamp < config.prevLocMaxAge) {
        update.curLoc = undefined;
      }
    }
    model.update_state(update);
    model.update_view();
  },
  // options
  {
    maximumAge: model.config.poMaxAge,
    timeout: model.config.poTimeout,
  }
);

// startup code
me.appTimeoutEnabled = false;

// receive updates from companion
messaging.peerSocket.addEventListener("message", function (msg) {
  let evt = msg.data;
  console.log("MSG EVENT: " + JSON.stringify(evt));
  switch (evt.event) {
    case enums.CFG_FULL_UPDATE:
      console.log("CFG_FULL_UPDATE");
      model.update_config(evt.data, true);
      break;
    case enums.CFG_UPDATE:
      console.log("CFG_UPDATE");
      model.update_config(evt.data, false);
      break;
    case enums.WP_UPDATE:
      console.log("WP_UPDATE");
      model.WAYPOINTS = evt.data;
      break;
    case enums.DEVLOC_UPDATE:
      console.log("DEVLOC_UPDATE");
      model.update_state({
        curLoc: evt.data,
      });
      model.update_view();
      break;
    default:
      console.log("Unhandled event: " + JSON.stringify(evt));
  }
  model.update_state({});
  model.update_view();
});

me.addEventListener("unload", function () {
  fs.writeFileSync(SETTINGS_FILE, config, SETTINGS_TYPE);
});

me.addEventListener("unload", function () {
  fs.writeFileSync(WAYPOINTS_FILE, WAYPOINTS, WAYPOINTS_TYPE);
});

model.update_view();
setTimeout(function () {
  model.mq_current.state = "enabled";
}, 2000);
