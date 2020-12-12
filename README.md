# Waypoint Navigator Fitbit App

## Description

A fairly minimal Fitbit app that aids navigation through waypoints using bearing / direction.

## Usage

### Steps

1. Enter waypoints using settings in companion app.
1. Wait for GPS to lock (<span style="color:red">red</span> = disconnected; <span style="color:gray">gray</span> = connected).
1. Click Prev / Next buttons (on screen or physical) to toggle current destination.
1. Click on Compass to lock / unlock North orientation.
1. Remember to exit app after use by clicking the physical Back button.

### Inputting Waypoints

The format for a single waypoint is:  
  
`Waypoint<tab>latitude<tab>longitude`
  
Multiple waypoints are separated by a `|`, like so:  
  
`WP #1<tab>lat_1<tab>lng_1|WP #2<tab>lat_2<tab>lng_2|WP #3<tab>lat_3<tab>lng_3|...`
  
This can be easily done using a spreadsheet application (e.g. Google Sheets, Microsoft Excel, LibreOffice, ...)  

First, create a table of waypoints for your route, for example:

| Waypoint | Lat | Lng | Separator |
|-|-|-|-|
| Red Dot | 1.280084 | 103.856275 | \| |
| Marina Barrage | 1.281401 | 103.87247 | \| |
| Garden Service Road | 1.294282 | 103.867362 | \| |
| East Coast Park | 1.294848 | 103.883451 | \| |

*Note: You can use [geocode.localfocus.nl](https://geocode.localfocus.nl) to get the coordinates for a desired address.*  
  
Then, open the table in your phone using an app like Google Sheets or Microsoft Excel.  
  
Copy waypoint rows, EXCLUDING the header (which in this case would be `Landmark, Lat, Lng, Separator`)  
  
Paste into the entry box in Enter Waypoints in the app settings.  
*Note that sending the waypoints via a messaging app may truncate the `<tab>` character.*  
  
### Arc Legends

- <span style="color:red">Red</span>  = North
- <span style="color:blue">Blue</span> = Destination
- <span style="color:aqua">Aqua</span> = Bearing (North / East / West / South Orientation)

### Notes

The Ionic has it own GPS but does not have a compass. In this scenario, bearing is determined by comparing current location versus a stored previous location.

The next waypoint is automatically selected when near the current waypoint. Hence, a waypoint in close proximity cannot be set as the current one. To disable this, set "Auto go to next waypoint" = 0 in the companion settings.

## Donations

I only made this project for fun and to learn something new. If this has helped you in any way, please feel free to donate :)

BTC - 1GG9217AMVvBPzB4fo75aEsUGqBTpwEtRh  
ETH - 0x9649696661c7bd58a19f7626ab05beabe101ddd7
