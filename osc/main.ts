import "dotenv/config";
import { chromium, devices } from "playwright";
import { login, logout } from "./login.ts";
import { getDiscountedPrice } from "./getDiscoutedPrice.ts";
import fs from "fs";
import { readUrlsFromFile, wait } from "./utils.ts";

const BATCH_SIZE = 500;
const RESULTS_CSV_FILE = "discounted_prices.csv";
const FAILED_FILE = "failedUrls.txt";
const FILE_PATH = "filteredUrls.txt";
// const FILE_PATH = "testUrls.txt";

const writeToCsv = (data: string[]) => {
  fs.appendFileSync(RESULTS_CSV_FILE, data.join("\n") + "\n");
};

const processBatch = async (page, urls: string[]) => {
  const results: string[] = [];

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    const discountedPrice = await getDiscountedPrice(page, url);
    if (!discountedPrice) {
      fs.appendFileSync(FAILED_FILE, url + "\n");
      continue;
    }
    const line = `${url};${discountedPrice[0]};${discountedPrice[1]};${discountedPrice[2]};${discountedPrice[3]};${discountedPrice[4]};${discountedPrice[5]};${discountedPrice[6]}`;
    results.push(line);
    console.log(`Processed (${i + 1}/${urls.length}): ${url}`);
    await wait(200);
  }

  // Write the results for this batch to the CSV file
  writeToCsv(results);
};

(async () => {
  const urls = await readUrlsFromFile(FILE_PATH);

  const browser = await chromium.launch();
  const context = await browser.newContext(devices["Desktop Chrome"]);
  const page = await context.newPage();

  await context.route("**.jpg", (route) => route.abort());
  await login(page);
  console.log("Logged in");

  if (!fs.existsSync(RESULTS_CSV_FILE)) {
    fs.writeFileSync(
      RESULTS_CSV_FILE,
      "URL;Codice;APartireDa;PrezzoUnitario;PrezzoPerPz;APartireDa2;PrezzoUnitario2;PrezzoPerPz2\n"
    );
  }

  // Process URLs in batches
  for (let i = 0; i < urls.length; i += BATCH_SIZE) {
    const batch = urls.slice(i, i + BATCH_SIZE);
    console.log(`Processing batch ${Math.floor(i / BATCH_SIZE) + 1}...`);
    await processBatch(page, batch);
    console.log(`Batch ${Math.floor(i / BATCH_SIZE) + 1} completed.`);
  }

  await logout(page);
  console.log("Logged out");

  // Teardown
  await context.close();
  await browser.close();
})();
