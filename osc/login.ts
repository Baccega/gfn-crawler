import { type Page } from "playwright";

export async function login(page: Page) {
  if (
    !process.env.LOGIN_URL_OSC ||
    !process.env.USERNAME_OSC ||
    !process.env.PASSWORD_OSC
  ) {
    console.log("No login URL, username, or password provided");
    throw new Error("Login failed");
  }

  await page.goto(process.env.LOGIN_URL_OSC);
  await page
    .getByRole("textbox", { name: "Indirizzo e-mail" })
    .fill(process.env.USERNAME_OSC);
  await page
    .getByRole("textbox", { name: "Password" })
    .fill(process.env.PASSWORD_OSC);
  await page.getByRole("link", { name: "" }).click();
}

export async function logout(page: Page) {
  await page
    .locator("#login-form > div > div.form-group > span > a.hidden-xs")
    .click();
}
