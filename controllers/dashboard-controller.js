import { stationStore } from "../models/station-store.js";
import { readingStore } from "../models/reading-store.js";

export const dashboardController = {
  async index(request, response) {
    const stations = await stationStore.getAllStations();
    const readings = await readingStore.getAllReadings();

    // Combine stations and get the last code for each station
    const combinedData = stations.map((station) => {
      const matchingReadings = readings.filter((reading) => reading.stationid === station._id);
      const lastMatchingReading = matchingReadings.length > 0 ? matchingReadings[matchingReadings.length - 1] : null;

      return {
        ...station,
        testCode: lastMatchingReading ? lastMatchingReading.code : null,
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
