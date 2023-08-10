import { stationStore } from "../models/station-store.js";
import { readingStore } from "../models/reading-store.js";

export const stationController = {
  async index(request, response) {
    const station = await stationStore.getStationById(request.params.id);
    // const latestReading = await getLatestReading(station);
    const latestReading = await readingStore.getReadingsByStationId(request.params.id);
    const length = latestReading.length - 1;
    const viewData = {
      title: "Station",
      station: station,
      latestCode: latestReading[length].code,
      latestTemp: latestReading[length].temp,
      latestWindSpeed: latestReading[length].windSpeed,
      latestPressure: latestReading[length].pressure,
    };
    response.render("station-view", viewData);
  },

  async addReading(request, response) {
    const station = await stationStore.getStationById(request.params.id);
    const newReading = {
      code: Number(request.body.code),
      temp: Number(request.body.temp),
      windSpeed: Number(request.body.windSpeed),
      pressure: Number(request.body.pressure),
    };

    await readingStore.addReading(station._id, newReading);
    response.redirect("/station/" + station._id);
  },
};
