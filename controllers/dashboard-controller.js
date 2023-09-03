import { stationStore } from "../models/station-store.js";
import { readingStore } from "../models/reading-store.js";
import { accountsController } from "./accounts-controller.js";
import axios from "axios";

export const dashboardController = {
  async index(request, response) {
    const loggedInUser = await accountsController.getLoggedInUser(request);

    if (!loggedInUser || !loggedInUser._id || !loggedInUser.firstName) {
      response.redirect("/"); // Redirect to login page
      return;
    }
    const stations = await stationStore.getStationsByUserId(loggedInUser._id);
    const readings = await readingStore.getAllReadings();
    const sortedStations = stations.slice().sort((a, b) => a.name.localeCompare(b.name));
    const oneCallRequest = `https://api.openweathermap.org/data/3.0/onecall?lat=52.1624&lon=7.1524&appid=1034f20414a780ad33f80a0fca6c250d`;
    let report = {};
    const result = await axios.get(oneCallRequest);

    if (result.status == 200) {
    }

    const combinedData = sortedStations.map((station) => {
      const matchingReadings = readings.filter((reading) => reading.stationid === station._id);
      const sortedReadingsByTemp = readings ? matchingReadings.sort((a, b) => a.temp - b.temp) : null;
      const sortedReadingsByWind = readings ? matchingReadings.sort((a, b) => a.windSpeed - b.windSpeed) : null;
      const sortedReadingsByPressure = readings ? matchingReadings.sort((a, b) => a.pressure - b.pressure) : null;
      const lastMatchingReading = matchingReadings.length > 0 ? matchingReadings[matchingReadings.length - 1] : null;

      //defining trands
      let tTrend;
      let pTrend;
      let wTrend;
      let matchingReadingsSortByDate;
      matchingReadingsSortByDate = matchingReadings.sort(function (a, b) {
        return new Date(a.date) - new Date(b.date);
      });
      //temp trends
      if (matchingReadings.length >= 3) {
        let lastReading = matchingReadingsSortByDate[matchingReadings.length - 1];
        let secondLastReading = matchingReadingsSortByDate[matchingReadings.length - 2];
        let thirdLastReading = matchingReadingsSortByDate[matchingReadings.length - 3];

        if (lastReading.temp > secondLastReading.temp && secondLastReading.temp > thirdLastReading.temp) {
          tTrend = "Rising";
        } else if (lastReading.temp < secondLastReading.temp && secondLastReading.temp < thirdLastReading.temp) {
          tTrend = "Dropping";
        } else {
          tTrend = "Unchanged";
        }
        // wind trends
        if (
          lastReading.windSpeed > secondLastReading.windSpeed &&
          secondLastReading.windSpeed > thirdLastReading.windSpeed
        ) {
          wTrend = "Rising";
        } else if (
          lastReading.windSpeed < secondLastReading.windSpeed &&
          secondLastReading.windSpeed < thirdLastReading.windSpeed
        ) {
          wTrend = "Dropping";
        } else {
          wTrend = "Unchanged";
        }
        // Pressure trends
        if (
          lastReading.pressure > secondLastReading.pressure &&
          secondLastReading.pressure > thirdLastReading.pressure
        ) {
          pTrend = "Rising";
        } else if (
          lastReading.pressure < secondLastReading.pressure &&
          secondLastReading.pressure < thirdLastReading.pressure
        ) {
          pTrend = "Dropping";
        } else {
          pTrend = "Unchanged";
        }
      } else {
        tTrend = "N/A";
        pTrend = "N/A";
        // pressureTrend = "N/A";
      }

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
      // defining windDirection
      let windCompass;

      if (lastMatchingReading !== null) {
        if (lastMatchingReading.windDirection < 11.25) {
          windCompass = "N";
        } else if (lastMatchingReading.windDirection >= 348.75) {
          windCompass = "N";
        } else if (lastMatchingReading.windDirection < 33.75) {
          windCompass = "NNE";
        } else if (lastMatchingReading.windDirection < 56.25) {
          windCompass = "NE";
        } else if (lastMatchingReading.windDirection < 78.75) {
          windCompass = "ENE";
        } else if (lastMatchingReading.windDirection < 101.25) {
          windCompass = "E";
        } else if (lastMatchingReading.windDirection < 123.75) {
          windCompass = "ESE";
        } else if (lastMatchingReading.windDirection < 146.25) {
          windCompass = "SE";
        } else if (lastMatchingReading.windDirection < 168.75) {
          windCompass = "SSE";
        } else if (lastMatchingReading.windDirection < 191.25) {
          windCompass = "S";
        } else if (lastMatchingReading.windDirection < 213.75) {
          windCompass = "SSW";
        } else if (lastMatchingReading.windDirection < 236.25) {
          windCompass = "SW";
        } else if (lastMatchingReading.windDirection < 258.75) {
          windCompass = "WSW";
        } else if (lastMatchingReading.windDirection < 281.25) {
          windCompass = "W";
        } else if (lastMatchingReading.windDirection < 303.75) {
          windCompass = "WNW";
        } else if (lastMatchingReading.windDirection < 326.25) {
          windCompass = "NW";
        } else if (lastMatchingReading.windDirection < 348.75) {
          windCompass = "NW";
        } else {
          windCompass = "";
        }
      }
      let wBft;
      if (lastMatchingReading && lastMatchingReading.windSpeed !== null) {
        const windSpeed = lastMatchingReading.windSpeed;

        if (windSpeed === 1) {
          wBft = "Calm";
        } else if (windSpeed > 1 && windSpeed <= 5) {
          wBft = "Light Air";
        } else if (windSpeed <= 11) {
          wBft = "Light Breeze";
        } else if (windSpeed <= 19) {
          wBft = "Gentle Breeze";
        } else if (windSpeed <= 28) {
          wBft = "Moderate Breeze";
        } else if (windSpeed <= 38) {
          wBft = "Fresh Breeze";
        } else if (windSpeed <= 49) {
          wBft = "Strong Breeze";
        } else if (windSpeed <= 61) {
          wBft = "Near Gale";
        } else if (windSpeed <= 74) {
          wBft = "Gale";
        } else if (windSpeed <= 88) {
          wBft = "Severe Gale";
        } else if (windSpeed <= 102) {
          wBft = "Strong storm";
        } else if (windSpeed <= 117) {
          wBft = "Violent storm";
        } else {
          wBft = "N/A";
        }
      }
      let wChill;
      wChill =
        lastMatchingReading && lastMatchingReading.windSpeed !== null
          ? 13.12 +
            0.6215 * lastMatchingReading.temp -
            11.37 * Math.pow(lastMatchingReading.windSpeed, 0.16) +
            0.3965 * lastMatchingReading.temp * Math.pow(lastMatchingReading.windSpeed, 0.16)
          : "N/A";

      return {
        ...station,
        code: lastMatchingReading ? codeAction : "N/A",
        temp: lastMatchingReading ? lastMatchingReading.temp : "N/A",
        tempF: lastMatchingReading ? (lastMatchingReading.temp * 9) / 5 + 32 : "N/A",
        windSpeed: lastMatchingReading ? lastMatchingReading.windSpeed : "N/A",
        windBft: lastMatchingReading ? wBft : "N/A",
        windChill: lastMatchingReading ? Math.round(wChill) : "N/A",
        windDirection: lastMatchingReading ? windCompass : "N/A",
        pressure: lastMatchingReading ? lastMatchingReading.pressure : "N/A",
        minTemp: lastMatchingReading ? sortedReadingsByTemp[0].temp : "N/A",
        maxTemp: lastMatchingReading ? sortedReadingsByTemp[sortedReadingsByTemp.length - 1].temp : "N/A",
        minWindSpeed: lastMatchingReading ? sortedReadingsByWind[0].windSpeed : "N/A",
        maxWindSpeed: lastMatchingReading ? sortedReadingsByWind[sortedReadingsByWind.length - 1].windSpeed : "N/A",
        minPressure: lastMatchingReading ? sortedReadingsByPressure[0].pressure : "N/A",
        maxPressure: lastMatchingReading
          ? sortedReadingsByPressure[sortedReadingsByPressure.length - 1].pressure
          : "N/A",
        tempTrend: tTrend,
        pressureTrend: pTrend,
        windTrend: wTrend,
        reading: report,
      };
    });
    // defining data for map
    let mapData = stations.map((station) => [station.latitude, station.longitude]);
    let mapArray = JSON.stringify(mapData);
    //
    const viewData = {
      title: "Station Dashboard",
      data: combinedData,
      loggedInUser: loggedInUser,
      mapArray: mapArray,
    };
    response.render("dashboard-view", viewData);
  },

  async addStation(request, response) {
    const loggedInUser = await accountsController.getLoggedInUser(request);
    const newStation = {
      name: request.body.name,
      latitude: request.body.latitude,
      longitude: request.body.longitude,
      userid: loggedInUser._id,
    };
    console.log(`adding station ${newStation.name}`);
    await stationStore.addStation(newStation);
    response.redirect("/dashboard");
  },
  async deleteStation(request, response) {
    const loggedInUser = await accountsController.getLoggedInUser(request);
    const stationId = request.params.id;
    await stationStore.deleteStationById(stationId);
    response.redirect(303, "/dashboard");
  },
};
