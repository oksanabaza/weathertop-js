import { stationStore } from "../models/station-store.js";
import { readingStore } from "../models/reading-store.js";

export const dashboardController = {
  async index(request, response) {
    const stations = await stationStore.getAllStations();
    const readings = await readingStore.getAllReadings();
    const sortedStations = stations.slice().sort((a, b) => a.name.localeCompare(b.name));

    const combinedData = sortedStations.map((station) => {
      const matchingReadings = readings.filter((reading) => reading.stationid === station._id);
      const lastMatchingReading = matchingReadings.length > 0 ? matchingReadings[matchingReadings.length - 1] : null;
      let codeAction;
      if (lastMatchingReading) {
        switch (lastMatchingReading.code) {
          case "100":
            codeAction = "Clear";
            break;
          case "200":
            codeAction = "Partial clouds";
            break;
          case "300":
            codeAction = "Cloudy";
            break;
          case "400":
            codeAction = "Light Showers";
            break;
          case "500":
            codeAction = "Heavy Showers";
            break;
          case "600":
            codeAction = "Rain";
            break;
          case "700":
            codeAction = "Snow";
            break;
          case "800":
            codeAction = "Thunder";
            break;
          default:
            codeAction = "N/A";
            break;
        }
      }

      return {
        ...station,
        code: lastMatchingReading ? codeAction : null,
        temp: lastMatchingReading ? lastMatchingReading.temp : null,
        windSpeed: lastMatchingReading ? lastMatchingReading.windSpeed : null,
        pressure: lastMatchingReading ? lastMatchingReading.pressure : null,
      };
    });

    const viewData = {
      title: "Station Dashboard",
      data: combinedData,
    };
    response.render("dashboard-view", viewData);
  },

  async addStation(request, response) {
    const newStation = {
      name: request.body.name,
    };
    console.log(`adding station ${newStation.name}`);
    await stationStore.addStation(newStation);
    response.redirect("/dashboard");
  },
};
