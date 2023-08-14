import { stationStore } from "../models/station-store.js";
import { readingStore } from "../models/reading-store.js";

export const dashboardController = {
  async index(request, response) {
    const test = ["first string", "second string"];
    const viewData = {
      title: "Station Dashboard",
      stations: await stationStore.getAllStations(),
      test: await readingStore.getAllReadings(),
      // test: test[0],
    };
    // console.log("dashboard rendering");
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
