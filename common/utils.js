import * as messaging from "messaging";

export function sendData(event, data) {
  // socket send data with check
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send({ event: event, data: data });
  } else {
    console.log(
      "No peerSocket connection. Failed to send " + event + ":" + data
    );
  }
}

export function parseWaypointString(wp_str) {
  try {
    return String(wp_str)
      .split(/\n|\|/)
      .map(function (wp) {
        try {
          let coords = wp.split("\t");
          return {
            name: coords[0].trim(),
            // handle decimal as commas; lat/long always < 1000
            latitude: parseFloat(coords[1].replace(",", ".")),
            longitude: parseFloat(coords[2].replace(",", ".")),
          };
        } catch (error) {
          console.log("Unable to parse coord: " + wp);
        }
      });
  } catch (error) {
    console.log("Unable to parse Waypoints: " + wp_str);
    // IMHO, this lets user know waypoint string is invalid
    return [{ name: "INVALID WAYPOINT STRING!", latitude: 0, longitude: 0 }];
  }
}
