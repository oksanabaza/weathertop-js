import { stationStore } from "../models/station-store.js";
import { readingStore } from "../models/reading-store.js";

export const readingController = {
  async index(request, response) {
    const stationId = request.params.stationid;
    const readingId = request.params.readingid;
    console.log(`Editing reading ${readingId} from station ${stationId}`);
    const viewData = {
      title: "Edit Reading",
      station: await stationStore.getStationById(stationId),
      reading: await readingStore.getReadingById(readingId),
    };
    response.render("reading-view", viewData);
  },

  async update(request, response) {
    const stationId = request.params.stationid;
    const readingId = request.params.readingid;
    const updatedReading = {
      code: Number(request.body.code),
      temp: Number(request.body.temp),
      windSpeed: Number(request.params.windSpeed),
      pressure: Number(request.body.pressure),
    };
    console.log(`Updating reading ${readingId} from station ${stationId}`);
    await readingStore.updateReading(readingId, updatedReading);
    response.redirect("/station/" + stationId);
  },
  //   async delete(request, response) {
  //     const stationId = request.params.stationid;
  //     const readingId = request.params.readingid;
  //     const updatedReading = {
  //       code: Number(request.body.code),
  //       temp: Number(request.body.temp),
  //       windSpeed: Number(request.params.windSpeed),
  //       pressure: Number(request.body.pressure),
  //     };
  //     console.log(`Updating reading ${readingId} from station ${stationId}`);
  //     await readingStore.updateReading(readingId, updatedReading);
  //     response.redirect("/station/" + stationId);
  //   },
};
