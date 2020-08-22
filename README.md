# Waypoint Navigator Fitbit App

## Description

A fairly minimal Fitbit app that aids navigation through waypoints using bearing / direction.

## Usage

### Steps

1. Enter waypoints using settings in companion app.
1. Wait for GPS to lock (compass will be RED when GPS is disconnected).
1. Click Prev / Next buttons (on screen or physical) to toggle current destination.
1. Click on Compass to lock / unlock North orientation.
1. Remember to exit app after use by clicking the physical Back button.

### Arc Legends

- North = red
- Destination = blue; thick and short
- Bearing = teal / Aqua; thin and long

### Notes

The Ionic has it own GPS but does not have a compass. In this scenario, bearing is determined by comparing current location versus a stored previous location.

The next waypoint is automatically selected when near the current waypoint. Hence, a waypoint in close proximity cannot be set as the current one. To disable this, set "Auto go to next waypoint" = 0 in the companion settings.

## Donations

I only made this project for fun and to learn something new. If this has helped you in any way, please feel free to donate :)

BTC - 1GG9217AMVvBPzB4fo75aEsUGqBTpwEtRh  
ETH - 0x9649696661c7bd58a19f7626ab05beabe101ddd7
