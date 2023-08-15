import { stationStore } from "../models/station-store.js";
import { readingStore } from "../models/reading-store.js";

export const stationController = {
  async index(request, response) {
    const station = await stationStore.getStationById(request.params.id);
    let index = station.readings ? station.readings.length - 1 : null;
    let item = station.readings[index];
    let codeAction;
    if (item) {
      switch (item.code) {
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

    const viewData = {
      name: "station",
      station: station,
      code: item ? codeAction : null,
      temp: item ? item.temp : null,
      tempF: item ? (item.temp * 9) / 5 + 32 : null,
      windSpeed: item ? item.windSpeed : null,
      pressure: item ? item.pressure : null,
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
    };
    console.log(`adding reading ${newReading.code}`);
    await readingStore.addReading(station._id, newReading);
    response.redirect("/station/" + station._id);
  },
};
