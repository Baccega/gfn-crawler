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
  console.log("one done");
  // Two case is filtered out
  // const two = await getDiscountedPrice(page, process.env.TEST_URL_2_OSC);
  // console.log("two done");
  const three = await getDiscountedPrice(page, process.env.TEST_URL_3_OSC);
  console.log("three done");
  const four = await getDiscountedPrice(page, process.env.TEST_URL_4_OSC);
  console.log("four done");

  console.log(one);
  // console.log(two);
  console.log(three);
  console.log(four);

  await logout(page);
  console.log("logged out");

  // Teardown
  await context.close();
  await browser.close();
})();
