import { defaultConfig } from "../common/constants.js";

function HelloWorld(props) {
  return (
    <Page>
      <Section
        title={<Text bold>Waypoints</Text>}
        description={
          <Text>
            1) Waypoints separated by "|". 2) Name, latitute, and longitude
            separated by tabs. 3) Use decimal degree coordinates.
          </Text>
        }
      >
        <Text italic>
          Visit{" "}
          <Link source="https://geocode.localfocus.nl/">
            geocode.localfocus.nl
          </Link>{" "}
          for geocoding.
        </Text>
        <TextInput
          label="Enter Waypoints"
          placeholder="Paste waypoints here."
          settingsKey="waypointString"
        />
      </Section>
      <Section bold title="Settings">
        <TextInput
          label="Auto go to next waypoint. (in meters)"
          settingsKey="wpIncThresh"
          type="number"
          placeholder={
            defaultConfig.wpIncThresh + " (0 = manually update waypoint)"
          }
        />
        <TextInput
          label="Bearing basis coordinates max age. (in ms)"
          settingsKey="prevLocMaxAge"
          type="number"
          placeholder={defaultConfig.prevLocMaxAge}
        />
        <TextInput
          label="Bearing basis coordinates max distance. (in meters)"
          settingsKey="prevLocMaxDist"
          type="number"
          placeholder={defaultConfig.prevLocMaxDist}
        />
        <TextInput
          label="Max age for device provided bearing (in ms)"
          settingsKey="deviceBearingMaxAge"
          type="number"
          placeholder={defaultConfig.deviceBearingMaxAge}
        />
      </Section>
      <Section
        bold
        title="Advanced Settings"
        description="These will only be applied on app restart. Should be left as default in most cases."
      >
        <Text italic>
          The following parameters will be passed to `geolocation.watchPostion`
          as `PositionOptions` parameters.
        </Text>
        <TextInput
          label="PositionOptions.maximumAge (in ms)"
          settingsKey="poMaxAge"
          type="number"
          placeholder={defaultConfig.poMaxAge}
        />
        <TextInput
          label="PositionOptions.timeout (in ms)"
          settingsKey="poTimeout"
          type="number"
          placeholder={defaultConfig.poTimeout}
        />
      </Section>
    </Page>
  );
}

registerSettingsPage(HelloWorld);
