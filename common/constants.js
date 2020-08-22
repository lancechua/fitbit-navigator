// DEFAULT CONFIGURATION

export const defaultConfig = {
  wpIncThresh: 10, // auto increment waypoint if within this distance (in m)

  prevLocMaxAge: 30000, // max age of cached previous location in ms
  deviceBearingMaxAge: 5000, // max age of device provided bearing in ms

  // distance (in m) of new prevLoc before updating
  // a higher value makes the heading more stable, but less sensitive to changes
  prevLocMaxDist: 25,

  // passed to geolocation.watchPosition
  poMaxAge: 1000, // PositionOptions.maximumAge
  poTimeout: 60000, // PositionOptions.timeout
};

export const enums = {
  CFG_FULL_UPDATE: 0,
  CFG_UPDATE: 1,
  WP_UPDATE: 2,
  DEVLOC_UPDATE: 3,
};

export const GPSdevices = ["Ionic"]; // Fitbit `modelName`s with its own GPS
