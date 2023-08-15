import { stationStore } from "../models/station-store.js";
import { readingStore } from "../models/reading-store.js";

export const stationController = {
  async index(request, response) {
    const station = await stationStore.getStationById(request.params.id);
    let index = station.readings ? station.readings.length - 1 : null;
    const viewData = {
      name: "station",
      station: station,
      code: station.readings[index].code,
      temp: station.readings[index].temp,
      tempF: (station.readings[index].temp * 9) / 5 + 32,
      windSpeed: station.readings[index].windSpeed,
      pressure: station.readings[index].pressure,
    };

    response.render("station-view", viewData);
  },

  async addReading(request, response) {
    const station = await stationStore.getStationById(request.params.id);
    const newReading = {
      code: request.body.code,
      temp: request.body.temp,
      windSpeed: request.body.windSpeed,
      pressure: request.body.pressure,
      // duration: Number(request.body.duration),
    };
    console.log(`adding reading ${newReading.code}`);
    await readingStore.addReading(station._id, newReading);
    response.redirect("/station/" + station._id);
  },
};
