import fs from "fs";
import csvParser from "csv-parser";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, "../data");

async function readCSV(filePath) {
  const results = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", (error) => reject(error));
  });
}

export async function loadDataset() {
  try {
    const schedule = await readCSV(path.join(dataDir, "schedule.csv"));
    const videos = await readCSV(path.join(dataDir, "videos.csv"));

    const services = fs.existsSync(path.join(dataDir, "services.txt"))
      ? fs.readFileSync(path.join(dataDir, "services.txt"), "utf-8")
      : "";

    const familySupport = fs.existsSync(
      path.join(dataDir, "family_support.json")
    )
      ? JSON.parse(
          fs.readFileSync(path.join(dataDir, "family_support.json"), "utf-8")
        )
      : {};

    return {
      schedule,
      videos,
      services,
      familySupport,
    };
  } catch (error) {
    console.error("❌ Error loading dataset:", error);
    return {
      schedule: [],
      videos: [],
      services: "",
      familySupport: {},
    };
  }
}
