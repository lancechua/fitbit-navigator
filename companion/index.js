import * as messaging from "messaging";
import { geolocation } from "geolocation";
import { settingsStorage } from "settings";
import { device } from "peer";

import { defaultConfig, enums, GPSdevices } from "../common/constants.js";
import { sendData, parseWaypointString } from "../common/utils.js";

// INIT

// parse settings
let config = {};
for (var key in defaultConfig) {
  let val = settingsStorage.getItem(key);
  let update_val = parseInt(val);
  if (isNaN(update_val)) {
    update_val = defaultConfig[key];
  }
  config[key] = update_val;
}

// Send full data on open
messaging.peerSocket.onopen = function () {
  // send updated config
  sendData(enums.CFG_FULL_UPDATE, config);
  // send parsed waypoints
  let wp_val = settingsStorage.getItem("waypointString");
  console.log("Stored Waypoint String: " + wp_val);
  if (wp_val) {
    sendData(
      enums.WP_UPDATE,
      parseWaypointString(
        JSON.parse(settingsStorage.getItem("waypointString")).name
      )
    );
  }
};

// update on change
settingsStorage.addEventListener("change", function (evt) {
  if (evt.oldValue !== evt.newValue) {
    console.log(
      "Sending settings update from companion: " + JSON.stringify(evt)
    );
    if (evt.key === "waypointString") {
      sendData(
        enums.WP_UPDATE,
        parseWaypointString(
          JSON.parse(settingsStorage.getItem("waypointString")).name
        )
      );
    } else {
      let update_val = parseInt(JSON.parse(evt.newValue).name);
      if (isNaN(update_val)) {
        update_val = defaultConfig[evt.key];
      }
      sendData(enums.CFG_UPDATE, { key: evt.key, value: update_val });
    }
  }
});

if (GPSdevices.includes(device.modelName)) {
  console.log(
    "Device has built-in GPS, but supplement GPS data from companion"
  );
  // TODO: Companioin gives empty updates for Ionic?
  // try to get device GPS updates (has more info, e.g. bearing)
  // devices with no built-in GPS already fallback to companion (I think?)
  let watchID2 = geolocation.watchPosition(
    // success callback
    function (position) {
      console.log("Companion GPS Update: " + JSON.stringify(position));
      let pos_check;
      try {
        pos_check = Object.keys(position).length;
      } catch (error) {
        pos_check = 0;
      }
      if (pos_check > 0) {
        sendData(enums.DEVLOC_UPDATE, position);
      } else {
        console.log("-- Empty GPS update!");
      }
    },
    // failure callback
    function (error) {
      console.log(
        "LocationError: " + error.code + "; Message: " + error.message
      );
    },
    // options
    {
      maximumAge: config.poMaxAge,
      timeout: config.poTimeout,
    }
  );
} else {
  console.log("Device already uses (or prefers) companion GPS.");
}
