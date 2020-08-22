import { vibration } from "haptics";

import { calc_distance, calc_bearing } from "../common/geofuncs.js";

export var model = {
  init: function (init_params) {
    for (var key in init_params) {
      this[key] = init_params[key];
    }
    this.dist_unit = this.dist_box.getElementById("copy");
  },
  // increment/decrement current waypoint
  change_waypoint: function (inc) {
    var new_wp = this.State.wp + inc;
    if (new_wp < 0) {
      console.log("wp too low");
      this.wb_prev.animate("enable");
    } else if (new_wp >= this.WAYPOINTS.length) {
      console.log("wp too high");
      this.wb_next.animate("enable");
    } else {
      console.log("new_wp = " + new_wp);
      this.update_state({ wp: new_wp });
      vibration.start("bump");
      this.update_view();
    }
  },
  // handle updates to this.State attribute
  update_state: function (update) {
    if ("curLoc" in update) {
      if (this.State.prevLoc) {
        if (this.State.curLoc) {
          if (
            Date.now() - this.State.prevLoc.timestamp >=
              this.config.prevLocMaxAge || // prevLoc too old
            calc_distance(
              this.State.prevLoc.coords,
              this.State.curLoc.coords
            ) >= this.config.prevLocMaxDist // prevLoc too far
          ) {
            console.log("updating prevLoc (due to age or distance)");
            this.State.prevLoc = this.State.curLoc;
          } else {
            console.log("prevLoc retained");
          }
        }
      } else {
        console.log("updating prevLoc (from undefined)");
        this.State.prevLoc = this.State.curLoc;
      }
    }

    for (var key in update) {
      this.State[key] = update[key];
    }

    if (this.State.curLoc) {
      let dist = calc_distance(
        this.State.curLoc.coords,
        this.WAYPOINTS[this.State.wp]
      );
      // auto increment waypoint
      if (
        dist < this.config.wpIncThresh &&
        this.State.wp < this.WAYPOINTS.length - 1
      ) {
        this.State.wp += 1;
        dist = calc_distance(
          this.State.curLoc.coords,
          this.WAYPOINTS[this.State.wp]
        );
        vibration.start("ping");
      }

      // format distance and unit
      if (dist > 1000) {
        this.State.dist = (dist / 1000).toFixed(2);
        this.State.unit = "km";
      } else {
        this.State.dist = dist.toFixed(0);
        this.State.unit = "meters";
      }

      // If calculation fails here for some reason set Bearing = 0
      // calculate bearing (to destination)
      this.State.bearingDest =
        calc_bearing(this.State.curLoc.coords, this.WAYPOINTS[this.State.wp]) ||
        0;
      // calculate bearing (current)
      if (this.State.curLoc.coords.heading > 0) {
        // prioritize device provided value
        this.State.bearing = this.State.curLoc.coords.heading;
        this.State.lastDeviceGPSUpdate = this.State.curLoc.timestamp;
      } else if (
        this.State.prevLoc &&
        this.State.curLoc &&
        Date.now() - this.State.lastDeviceGPSUpdate >
          this.config.deviceBearingMaxAge
      ) {
        // calculate bearing by comparing current vs previous location
        this.State.bearing =
          calc_bearing(this.State.prevLoc.coords, this.State.curLoc.coords) ||
          0;
      }
    } else {
      // no location data
      this.State.dist = "...";
      this.State.unit = "meters";
      this.State.bearing = 0;
    }
  },
  // update view based on this.State
  update_view: function () {
    console.log(
      "this.State: wp = " +
        this.State.wp +
        ", bearing = " +
        String(this.State.bearing) +
        ", bearing dest = " +
        String(this.State.bearingDest)
    );
    this.mq_current.text = this.WAYPOINTS[this.State.wp].name;
    this.dist_box.text = this.State.dist;
    this.dist_unit.text = this.State.unit;

    const locs =
      (this.State.prevLoc !== undefined) + (this.State.curLoc !== undefined);
    if (locs === 0) {
      // no location data
      this.cir_compass.style.fill = "fb-red";
    } else if (locs == 1 && this.State.heading == 0) {
      // no heading
      this.cir_compass.style.fill = "fb-plum";
    } else {
      // full data available
      this.cir_compass.style.fill = "fb-extra-dark-gray";
    }

    if (this.State.fixedNorth) {
      this.north_N.groupTransform.rotate.angle = 0;
      this.arc_north.startAngle = -this.arc_north.sweepAngle / 2;
      this.arc_bearing.startAngle =
        this.State.bearing - this.arc_bearing.sweepAngle / 2;
      this.arc_dest.startAngle =
        this.State.bearingDest - this.arc_dest.sweepAngle / 2;
    } else {
      this.north_N.groupTransform.rotate.angle = -this.State.bearing;
      this.arc_north.startAngle =
        -this.State.bearing - this.arc_north.sweepAngle / 2;
      this.arc_bearing.startAngle = -this.arc_bearing.sweepAngle / 2;
      this.arc_dest.startAngle =
        this.State.bearingDest -
        this.State.bearing -
        this.arc_dest.sweepAngle / 2;
    }
  },
  // handle config updates
  update_config: function (update, full_update) {
    console.log("Updating config " + JSON.stringify(update));
    if (full_update) {
      this.config = update;
    } else {
      this.config[update.key] = update.value;
    }
  },
};
