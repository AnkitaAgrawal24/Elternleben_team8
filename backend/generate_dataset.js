import fs from "fs";
import csvParser from "csv-parser";
import path from "path";

const schedulePath = "./data/schedule.csv";
const videosPath = "./data/videos.csv";
const servicesPath = "./data/services.txt";
const familySupportPath = "./data/family_support.json";
const outputPath = "./data/dataset.json";

// Helper to read a CSV file and return as array of objects
function readCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (data) => results.push(data))
      .on("end", () => {
        console.log(` Finished reading ${filePath}`);
        resolve(results);
      })
      .on("error", (error) => reject(error));
  });
}

// Helper to read a text file
function readText(filePath) {
  return fs.promises.readFile(filePath, "utf-8");
}

// Helper to read a JSON file
function readJSON(filePath) {
  return fs.promises.readFile(filePath, "utf-8").then(JSON.parse);
}

async function generateDataset() {
  try {
    const scheduleData = await readCSV(schedulePath);
    const videosData = await readCSV(videosPath);
    const servicesData = await readText(servicesPath);
    const familySupportData = await readJSON(familySupportPath);

    const finalData = {
      schedule: scheduleData,
      videos: videosData,
      services: servicesData,
      family_support: familySupportData,
    };

    fs.writeFileSync(outputPath, JSON.stringify(finalData, null, 2));
    console.log(` Dataset saved to ${outputPath}`);
  } catch (err) {
    console.error(" Error generating dataset:", err);
  }
}

generateDataset();
