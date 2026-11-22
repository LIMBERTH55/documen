import { chromium } from "playwright-core";
import fs from "node:fs";

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const outDir = "C:\\Users\\RYZEN7\\Desktop\\2025\\screenshots";
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({
  executablePath: chromePath,
  headless: true,
});

const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  deviceScaleFactor: 1,
});
const page = await context.newPage();
const errors = [];

page.on("console", (message) => {
  if (message.type() === "error") errors.push(`console: ${message.text()}`);
});
page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));

await page.goto("http://127.0.0.1:5173/", { waitUntil: "networkidle" });
await page.screenshot({ path: `${outDir}/01-dashboard.png`, fullPage: true });

await page.goto("http://127.0.0.1:5173/gestion/2025", { waitUntil: "networkidle" });
await page.screenshot({ path: `${outDir}/02-gestion.png`, fullPage: true });

await page.goto("http://127.0.0.1:5173/gestion/2025/correspondencia", { waitUntil: "networkidle" });
await page.screenshot({ path: `${outDir}/03-correspondencia.png`, fullPage: true });

await page.goto("http://127.0.0.1:5173/gestion/2025/correspondencia/examenes", { waitUntil: "networkidle" });
await page.screenshot({ path: `${outDir}/04-modulo.png`, fullPage: true });

await page.getByRole("button", { name: "Nuevo registro" }).click();
await page.waitForTimeout(350);
await page.screenshot({ path: `${outDir}/05-modal.png`, fullPage: false });
await page.getByRole("button", { name: "Cerrar ventana" }).click();

const mobile = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
});
const mobilePage = await mobile.newPage();
mobilePage.on("pageerror", (error) => errors.push(`mobile pageerror: ${error.message}`));
await mobilePage.goto("http://127.0.0.1:5173/", { waitUntil: "networkidle" });
await mobilePage.screenshot({ path: `${outDir}/06-mobile-dashboard.png`, fullPage: true });
await mobilePage.goto("http://127.0.0.1:5173/gestion/2025/correspondencia/examenes", { waitUntil: "networkidle" });
await mobilePage.screenshot({ path: `${outDir}/07-mobile-modulo.png`, fullPage: true });
await mobilePage.getByRole("button", { name: "Abrir menú de navegación" }).click();
await mobilePage.waitForTimeout(350);
await mobilePage.screenshot({ path: `${outDir}/08-mobile-menu.png`, fullPage: false });

console.log(JSON.stringify({ errors, screenshots: fs.readdirSync(outDir) }, null, 2));
await browser.close();
