import { stationStore } from "../models/station-store.js";
import { readingStore } from "../models/reading-store.js";
import { accountsController } from "./accounts-controller.js";

export const dashboardController = {
  async index(request, response) {
    const loggedInUser = await accountsController.getLoggedInUser(request);

    // const stations = await stationStore.getAllStations();
    const stations = await stationStore.getStationsByUserId(loggedInUser._id);
    const readings = await readingStore.getAllReadings();
    const sortedStations = stations.slice().sort((a, b) => a.name.localeCompare(b.name));

    const combinedData = sortedStations.map((station) => {
      const matchingReadings = readings.filter((reading) => reading.stationid === station._id);
      const sortedReadingsByTemp = readings ? matchingReadings.sort((a, b) => a.temp - b.temp) : null;
      const sortedReadingsByWind = readings ? matchingReadings.sort((a, b) => a.windSpeed - b.windSpeed) : null;
      const sortedReadingsByPressure = readings ? matchingReadings.sort((a, b) => a.pressure - b.pressure) : null;
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
      // let wBft;
      // if (lastMatchingReading && lastMatchingReading.windSpeed !== null) {
      //   if (lastMatchingReading.windSpeed === 1) {
      //     wBft = "Calm";
      //   }
      //   if (lastMatchingReading.windSpeed > 1 && lastMatchingReading.windSpeed <= 5) {
      //     wBft = "Light Air";
      //   }
      //   if (lastMatchingReading.windSpeed >= 6 && lastMatchingReading.windSpeed <= 11) {
      //     wBft = "Light Breeze";
      //   }
      //   if (lastMatchingReading.windSpeed >= 12 && lastMatchingReading.windSpeed <= 19) {
      //     wBft = "Gentle Breeze";
      //   }
      //   if (lastMatchingReading.windSpeed >= 20 && lastMatchingReading.windSpeed <= 28) {
      //     wBft = "Moderate Breeze";
      //   }
      //   if (lastMatchingReading.windSpeed >= 29 && lastMatchingReading.windSpeed <= 38) {
      //     wBft = "Fresh Breeze";
      //   }
      //   if (lastMatchingReading.windSpeed >= 39 && lastMatchingReading.windSpeed <= 49) {
      //     wBft = "Strong Breeze";
      //   }
      //   if (lastMatchingReading.windSpeed >= 50 && lastMatchingReading.windSpeed <= 61) {
      //     wBft = "Near Gale";
      //   }
      //   if (lastMatchingReading.windSpeed >= 62 && lastMatchingReading.windSpeed <= 74) {
      //     wBft = "Gale";
      //   }
      //   if (lastMatchingReading.windSpeed >= 75 && lastMatchingReading.windSpeed <= 88) {
      //     wBft = "Severe Gale";
      //   }
      //   if (lastMatchingReading.windSpeed >= 89 && lastMatchingReading.windSpeed <= 102) {
      //     wBft = "Strong storm";
      //   }
      //   if (lastMatchingReading.windSpeed >= 103 && lastMatchingReading.windSpeed <= 117) {
      //     wBft = "Violent storm";
      //   } else {
      //     wBft = "";
      //   }
      // }
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
        pressure: lastMatchingReading ? lastMatchingReading.pressure : "N/A",
        minTemp: lastMatchingReading ? sortedReadingsByTemp[0].temp : "N/A",
        maxTemp: lastMatchingReading ? sortedReadingsByTemp[sortedReadingsByTemp.length - 1].temp : "N/A",
        minWindSpeed: lastMatchingReading ? sortedReadingsByWind[0].windSpeed : "N/A",
        maxWindSpeed: lastMatchingReading ? sortedReadingsByWind[sortedReadingsByTemp.length - 1].windSpeed : "N/A",
        minPressure: lastMatchingReading ? sortedReadingsByPressure[0].pressure : "N/A",
        maxPressure: lastMatchingReading
          ? sortedReadingsByPressure[sortedReadingsByPressure.length - 1].pressure
          : "N/A",
      };
    });

    const viewData = {
      title: "Station Dashboard",
      data: combinedData,
      loggedInUser: loggedInUser.firstName ? loggedInUser.firstName : null,
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
};
