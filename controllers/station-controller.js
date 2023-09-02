import { stationStore } from "../models/station-store.js";
import { readingStore } from "../models/reading-store.js";
import { accountsController } from "./accounts-controller.js";
import axios from "axios";

export const stationController = {
  async index(request, response) {
    let toggle = false;

    const loggedInUser = await accountsController.getLoggedInUser(request);

    // Check if loggedInUser exists and has the required properties
    if (!loggedInUser || !loggedInUser._id || !loggedInUser.firstName) {
      response.redirect("/login"); // Redirect to login page
      return;
    }
    const station = await stationStore.getStationById(request.params.id);

    let index = station.readings ? station.readings.length - 1 : null;
    let item = station.readings[index];
    // let wBft;
    // if (item && item.windSpeed !== null) {
    //   if (item.windSpeed === "1") {
    //     wBft = "Calm";
    //   } else if (item.windSpeed > "1" && item.windSpeed <= "5") {
    //     wBft = "Light Air";
    //   } else if (item.windSpeed >= "6" && item.windSpeed <= "11") {
    //     wBft = "Light Breeze";
    //   } else if (item.windSpeed >= "12" && item.windSpeed <= "19") {
    //     wBft = "Gentle Breeze";
    //   } else if (item.windSpeed >= "20" && item.windSpeed <= "28") {
    //     wBft = "Moderate Breeze";
    //   } else if (item.windSpeed >= "29" && item.windSpeed <= "38") {
    //     wBft = "Fresh Breeze";
    //   } else if (item.windSpeed >= "39" && item.windSpeed <= "49") {
    //     wBft = "Strong Breeze";
    //   } else if (item.windSpeed >= "50" && item.windSpeed <= "61") {
    //     wBft = "Near Gale";
    //   } else if (item.windSpeed >= "62" && item.windSpeed <= "74") {
    //     wBft = "Gale";
    //   } else if (item.windSpeed >= "75" && item.windSpeed <= "88") {
    //     wBft = "Severe Gale";
    //   } else if (item.windSpeed >= "89" && item.windSpeed <= "102") {
    //     wBft = "Strong storm";
    //   } else if (item.windSpeed >= "103" && item.windSpeed <= "117") {
    //     wBft = "Violent storm";
    //   } else {
    //     wBft = "";
    //   }
    // }
    let wBft;
    if (item && item.windSpeed !== null) {
      const windSpeed = item.windSpeed;

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
    // autogenerate report
    const oneCallRequest = `https://api.openweathermap.org/data/3.0/onecall?lat=${station.latitude}&lon=${station.longitude}&appid=1034f20414a780ad33f80a0fca6c250d`;
    // const oneCallRequest = `https://api.openweathermap.org/data/2.5/onecall?lat=${station.latitude}&lon=${station.longitude}&units=metric&appid=1034f20414a780ad33f80a0fca6c250d`;
    let report = {};
    const result = await axios.get(oneCallRequest);

    if (result.status == 200) {
      const reading = result.data;
      report.timezone = reading.timezone;
      report.pressure = reading.current.pressure;
      report.windSpeed = reading.current.wind_speed;
      report.windDegree = reading.current.wind_deg;
      report.code = reading.current.weather[0].main;
      report.temp = reading.current.temp;

      // new code added
      report.tempTrend = [];
      report.trendLabels = [];
      const trends = result.data.daily;
      for (let i = 0; i < trends.length; i++) {
        report.tempTrend.push((trends[i].temp.day - 273.15).toFixed());

        const date = new Date(trends[i].dt * 1000);
        report.trendLabels.push(`${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`);
      }
      // console.log(report.tempTrend, "report.tempTrend");
      // console.log(report.trendLabels, "report.trendLabels");
      // end of new code added
    }
    // end of autogenerate report logic
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
      reading: report,
      toggle,
    };

    response.render("station-view", viewData);
  },

  async addReading(request, response) {
    let final = {};
    // autogenerate report
    const oneCallRequest = `https://api.openweathermap.org/data/3.0/onecall?lat=52.1624&lon=-7.1524&appid=1034f20414a780ad33f80a0fca6c250d`;
    let report = {};
    const result = await axios.get(oneCallRequest);

    if (result.status == 200) {
      const reading = result.data;
      report.timezone = reading.timezone;
      report.pressure = reading.current.pressure;
      report.windSpeed = reading.current.wind_speed;
      report.windDegree = reading.current.wind_deg;
      report.code = reading.current.weather[0].main;
      report.temp = reading.current.temp;
      //  tempF: lastMatchingReading ? (lastMatchingReading.temp * 9) / 5 + 32 : "N/A",
    }
    // end of autogenerate report logic
    const station = await stationStore.getStationById(request.params.id);
    const newReading = {
      code: request.body.code,
      temp: request.body.temp,
      windSpeed: request.body.windSpeed,
      windDirection: request.body.windDirection,
      pressure: request.body.pressure,
      date: new Date().toLocaleString(),
    };

    console.log(`adding reading ${newReading.code}`);
    await readingStore.addReading(station._id, newReading);
    response.redirect("/station/" + station._id);
  },
  async generateReading(request, response) {
    const loggedInUser = await accountsController.getLoggedInUser(request);

    // Check if loggedInUser exists and has the required properties
    if (!loggedInUser || !loggedInUser._id || !loggedInUser.firstName) {
      response.redirect("/login"); // Redirect to login page
      return;
    }
    const station = await stationStore.getStationById(request.params.id);
    // console.log(station, "station");
    let final = {};
    // autogenerate report
    const oneCallRequest = `https://api.openweathermap.org/data/3.0/onecall?lat=${station.latitude}&lon=${station.longitude}&appid=1034f20414a780ad33f80a0fca6c250d`;
    let report = {};
    const result = await axios.get(oneCallRequest);

    if (result.status == 200) {
      const reading = result.data;
      // test;
      let codeAction;
      if (reading) {
        switch (reading.current.weather[0].main) {
          case "Clear":
            codeAction = "100";
            break;
          case "Mist":
            codeAction = "200";
            break;
          case "Clouds":
            codeAction = "300";
            break;
          case "Drizzle":
            codeAction = "400";
            break;
          case "Heavy Showers":
            codeAction = "500";
            break;
          case "Rain":
            codeAction = "600";
            break;
          case "Snow":
            codeAction = "700";
            break;
          case "Thunder":
            codeAction = "800";
            break;
          default:
            codeAction = "N/A";
            break;
        }
      }
      // test
      report.timezone = reading.timezone;
      report.pressure = reading.current.pressure;
      report.windSpeed = reading.current.wind_speed;
      report.windDegree = reading.current.wind_deg;
      report.code = codeAction;
      report.temp = reading.current.temp;
    }
    // const station = await stationStore.getStationById(request.params.id);

    // console.log(station._id, "station");
    await readingStore.addReading(station._id, {
      code: report.code,
      pressure: report.pressure,
      windSpeed: report.windSpeed,
      windDirection: report.windDegree,
      temp: (report.temp - 273.15).toFixed(),
      date: new Date().toLocaleString(),
    });
    console.log(`generated reading ${report.code}`);
    response.redirect("/station/" + station._id);
  },
  async deleteReading(request, response) {
    let stationId = request.params.stationid;
    const readingId = request.params._id;
    console.log(`Updating reading ${readingId} from station ${stationId}`);
    await readingStore.deleteReading(readingId);
    // response.redirect(303, "/station/" + stationId);
    // console.log(request.body);

    console.log(request.params);
    response.redirect(303, "/station/" + stationId);
    // response.redirect(303, "/dashboard");
  },
};
