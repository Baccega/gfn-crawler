import 'dotenv/config'
import { chromium, devices } from "playwright";
import { login, logout } from "./login.ts";
import { getDiscountedPrice } from "./getDiscoutedPrice.ts";

(async () => {
  // Setup
  const browser = await chromium.launch();
  const context = await browser.newContext(devices["Desktop Chrome"]);
  const page = await context.newPage();

  await context.route("**.jpg", (route) => route.abort());

  if (
    process.env.TEST_URL_OSC === undefined ||
    process.env.TEST_URL_2_OSC === undefined ||
    process.env.TEST_URL_3_OSC === undefined ||
    process.env.TEST_URL_4_OSC === undefined
  ) {
    console.log("No test URLs provided");
    return;
  }

  await login(page);

  console.log("logged in");

  const one = await getDiscountedPrice(page, process.env.TEST_URL_OSC);
  const two = await getDiscountedPrice(page, process.env.TEST_URL_2_OSC);
  const three = await getDiscountedPrice(page, process.env.TEST_URL_3_OSC);
  const four = await getDiscountedPrice(page, process.env.TEST_URL_4_OSC);

  console.log(one);
  console.log(two);
  console.log(three);
  console.log(four);

  await logout(page);
  console.log("logged out");

  // Teardown
  await context.close();
  await browser.close();
})();
