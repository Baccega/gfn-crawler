import { type Page } from "playwright";

function splitText(text: string) {
  return text.split("\t");
}

export async function getDiscountedPrice(page: Page, url: string) {
  await page.goto(url);
  const codice = await page
    .getByRole("heading", { name: "CODICE" })
    .innerText();

  const rows = await page
    .locator(
      '//*[@id="ctl00_cpholder_ctl00_salespricesctl_puom"]/table[2]/tbody/tr'
    )
    .all();

  if (rows.length === 0) {
    const rows2 = await page
      .locator("#ctl00_cpholder_ctl00_pnlOutlet > span.bar.w.outlet")
      .innerText();
    return [codice.substring(7), ...rows2.split("\n")];
  }

  const text = await rows[0].innerText();
  return [codice.substring(7), ...splitText(text)];
}
