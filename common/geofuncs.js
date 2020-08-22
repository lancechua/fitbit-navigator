// GEO FUNCTIONS

const M = 20004146; // meridian (m)
const E = 40074275; // equator (m)
const RAD = Math.PI / 180;

// https://blog.mapbox.com/fast-geodesic-approximations-with-cheap-ruler-106f229ad016
export function calc_distance(coord1, coord2) {
  const dy = (M * Math.abs(coord1.latitude - coord2.latitude)) / 180;
  const dx =
    ((E * Math.abs(coord1.longitude - coord2.longitude)) / 360) *
    Math.cos(0.5 * (coord1.latitude + coord1.latitude) * RAD);

  return Math.sqrt(dx * dx + dy * dy); // in meters
}

// https://www.movable-type.co.uk/scripts/latlong.html
export function calc_bearing(coord1, coord2) {
  const c1 = [coord1.latitude * RAD, coord1.longitude * RAD];
  const c2 = [coord2.latitude * RAD, coord2.longitude * RAD];

  const y = Math.sin(c2[1] - c1[1]) * Math.cos(c2[0]);
  const x =
    Math.cos(c1[0]) * Math.sin(c2[0]) -
    Math.sin(c1[0]) * Math.cos(c2[0]) * Math.cos(c2[1] - c1[1]);
  return (Math.atan2(y, x) / RAD + 360) % 360; // in degrees
}
