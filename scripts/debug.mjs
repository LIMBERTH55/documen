import { chromium } from "playwright-core";

const browser = await chromium.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: true,
});
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
page.on("console", (m) => console.log("console", m.type(), m.text()));
page.on("pageerror", (e) => console.log("pageerror", e.message));
page.on("framenavigated", (frame) => {
  if (frame === page.mainFrame()) console.log("navigated", frame.url());
});

await page.goto("http://127.0.0.1:5173/gestion/2025/correspondencia/examenes", {
  waitUntil: "networkidle",
});
await page.waitForTimeout(1000);
console.log("final url", page.url());
console.log("h1", await page.locator("h1").allTextContents());
console.log("buttons", await page.getByRole("button").allTextContents());
console.log("body snippet", (await page.locator("body").innerText()).slice(0, 1200));
await page.screenshot({ path: "screenshots/debug-module.png", fullPage: true });
await browser.close();
