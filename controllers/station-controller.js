import { stationStore } from "../models/station-store.js";
import { readingStore } from "../models/reading-store.js";
import { accountsController } from "./accounts-controller.js";

export const stationController = {
  async index(request, response) {
    const loggedInUser = await accountsController.getLoggedInUser(request);

    // Check if loggedInUser exists and has the required properties
    if (!loggedInUser || !loggedInUser._id || !loggedInUser.firstName) {
      response.redirect("/login"); // Redirect to login page
      return;
    }
    const station = await stationStore.getStationById(request.params.id);
    // //defining trands
    // let stationTrend;
    // if (station.length >= 3) {
    //   let lastReading = station.readings.length - 1;
    //   let secondLastReading = station.readings.length - 2;
    //   let thirdLastReading = station.readings.length - 3;

    //   if (lastReading.temp > secondLastReading.temp && secondLastReading.temp > thirdLastReading.temp) {
    //     station.trend = "Rising";
    //   } else if (lastReading.temp < secondLastReading.temp && secondLastReading.temp < thirdLastReading.temp) {
    //     station.trend = "Dropping";
    //   } else {
    //     station.trend = "Unchanged";
    //   }

    //   // Wind trends
    //   if (
    //     lastReading.windSpeed > secondLastReading.windSpeed &&
    //     secondLastReading.windSpeed > thirdLastReading.windSpeed
    //   ) {
    //     stationTrend = "Rising";
    //   } else if (
    //     lastReading.windSpeed < secondLastReading.windSpeed &&
    //     secondLastReading.windSpeed < thirdLastReading.windSpeed
    //   ) {
    //     stationTrend = "Dropping";
    //   } else {
    //     stationTrend = "Unchanged";
    //   }

    //   // Pressure trends
    //   if (lastReading.pressure > secondLastReading.pressure && secondLastReading.pressure > thirdLastReading.pressure) {
    //     station.pressureTrend = "Rising";
    //   } else if (
    //     lastReading.pressure < secondLastReading.pressure &&
    //     secondLastReading.pressure < thirdLastReading.pressure
    //   ) {
    //     station.pressureTrend = "Dropping";
    //   } else {
    //     station.pressureTrend = "Unchanged";
    //   }
    // } else {
    //   station.trend = "N/A";
    //   station.windTrend = "N/A";
    //   station.pressureTrend = "N/A";
    // }
    // ///////////////////////////////

    let index = station.readings ? station.readings.length - 1 : null;
    let item = station.readings[index];
    let wBft;
    if (item && item.windSpeed !== null) {
      if (item.windSpeed === "1") {
        wBft = "Calm";
      } else if (item.windSpeed > "1" && item.windSpeed <= "5") {
        wBft = "Light Air";
      } else if (item.windSpeed >= "6" && item.windSpeed <= "11") {
        wBft = "Light Breeze";
      } else if (item.windSpeed >= "12" && item.windSpeed <= "19") {
        wBft = "Gentle Breeze";
      } else if (item.windSpeed >= "20" && item.windSpeed <= "28") {
        wBft = "Moderate Breeze";
      } else if (item.windSpeed >= "29" && item.windSpeed <= "38") {
        wBft = "Fresh Breeze";
      } else if (item.windSpeed >= "39" && item.windSpeed <= "49") {
        wBft = "Strong Breeze";
      } else if (item.windSpeed >= "50" && item.windSpeed <= "61") {
        wBft = "Near Gale";
      } else if (item.windSpeed >= "62" && item.windSpeed <= "74") {
        wBft = "Gale";
      } else if (item.windSpeed >= "75" && item.windSpeed <= "88") {
        wBft = "Severe Gale";
      } else if (item.windSpeed >= "89" && item.windSpeed <= "102") {
        wBft = "Strong storm";
      } else if (item.windSpeed >= "103" && item.windSpeed <= "117") {
        wBft = "Violent storm";
      } else {
        wBft = "";
      }
    }

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
    let windCompass;

    if (item && item.windSpeed !== null) {
      if (item.windSpeed < 11.25) {
        windCompass = "N";
      } else if (item.windSpeed >= 348.75) {
        windCompass = "N";
      } else if (item.windSpeed < 33.75) {
        windCompass = "NNE";
      } else if (item.windSpeed < 56.25) {
        windCompass = "NE";
      } else if (item.windSpeed < 78.75) {
        windCompass = "ENE";
      } else if (item.windSpeed < 101.25) {
        windCompass = "E";
      } else if (item.windSpeed < 123.75) {
        windCompass = "ESE";
      } else if (item.windSpeed < 146.25) {
        windCompass = "SE";
      } else if (item.windSpeed < 168.75) {
        windCompass = "SSE";
      } else if (item.windSpeed < 191.25) {
        windCompass = "S";
      } else if (item.windSpeed < 213.75) {
        windCompass = "SSW";
      } else if (item.windSpeed < 236.25) {
        windCompass = "SW";
      } else if (item.windSpeed < 258.75) {
        windCompass = "WSW";
      } else if (item.windSpeed < 281.25) {
        windCompass = "W";
      } else if (item.windSpeed < 303.75) {
        windCompass = "WNW";
      } else if (item.windSpeed < 326.25) {
        windCompass = "NW";
      } else if (item.windSpeed < 348.75) {
        windCompass = "NW";
      } else {
        windCompass = "";
      }
    }
    const viewData = {
      name: "station",
      station: station,
      code: item ? codeAction : null,
      temp: item ? item.temp : null,
      tempF: item ? (item.temp * 9) / 5 + 32 : null,
      windSpeed: item ? item.windSpeed : null,
      windDirection: item ? windCompass : null,
      windBft: item ? wBft : null,
      pressure: item ? item.pressure : null,
      loggedInUser: loggedInUser,
      // trend: stationTrend,
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
      date: new Date().toLocaleString(),
    };
    console.log(`adding reading ${newReading.code}`);
    await readingStore.addReading(station._id, newReading);
    response.redirect("/station/" + station._id);
  },
  async deleteReading(request, response) {
    let stationId = request.params.stationid;
    const readingId = request.params._id;
    console.log(`Updating reading ${readingId} from station ${stationId}`);
    await readingStore.deleteReading(readingId);
    // response.redirect(303, "/station/" + stationId);
    console.log(request.body);

    console.log(request.params);
    response.redirect(303, "/station/" + stationId);
    // response.redirect(303, "/dashboard");
  },
};
