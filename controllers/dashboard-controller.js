import { readingStore } from "../models/reading-store.js";
import { stationStore } from "../models/station-store.js";
import { getLatestReading } from "../utils/station-utils.js";

export const dashboardController = {
  async index(request, response) {
    // const station = await stationStore.getStationById(request.params.id);
    // const latestReading = await getLatestReading(station);
    const viewData = {
      name: "Station Dashboard",
      stations: await stationStore.getAllStations(),
      test: ["testik1", "testik 2"],
      // latestReading: await readingStore.getReadingsByStationId(request.params.id),
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
