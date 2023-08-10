import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import * as fs from "fs";
import { stationStore } from "../models/station-store.js";
import { readingStore } from "../models/reading-store.js";

export function getLatestReading(station) {
  const readings = readingStore.getReadingsByStationId(station.id);
  let index = readings.lenght - 1;
  return readings[index];
}
