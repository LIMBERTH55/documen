import { chromium } from "playwright-core";
import fs from "node:fs";
import path from "node:path";

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const outDir = "C:\\Users\\RYZEN7\\Desktop\\2025\\test-output";
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ executablePath: chromePath, headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  acceptDownloads: true,
});
const page = await context.newPage();
const errors = [];
page.on("console", (message) => {
  if (message.type() === "error") errors.push(`console: ${message.text()}`);
});
page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));

const results = {};

await page.goto("http://127.0.0.1:5173/gestion/2025/correspondencia/examenes", {
  waitUntil: "networkidle",
});
results.initialRows = await page.locator(".records-table tbody tr").count();
results.paginationPages = await page.locator(".pagination__page").allTextContents();

await page.getByRole("button", { name: "Nuevo registro" }).click();
await page.locator("#record-form-carrera").fill("Ingeniería de Sistemas");
await page.locator("#record-form-codigo").fill("MEX-2025-TEST");
await page
  .locator("#record-form-descripcion")
  .fill("Registro de prueba automatizado para validar el sistema de gestión documental.");
await page.locator("#record-form-fecha").fill("2025-12-21");
await page.getByRole("button", { name: "Registrar documento" }).click();
await page.waitForTimeout(300);
results.addToast = await page.locator(".toast p").last().textContent();

await page.getByPlaceholder("Ej. MEX-2025-041").fill("MEX-2025-TEST");
await page.waitForTimeout(200);
results.searchByCodeRows = await page.locator(".records-table tbody tr").count();
results.searchByCodeText = await page.locator(".records-table tbody").innerText();

await page.getByRole("button", { name: "Editar registro MEX-2025-TEST" }).click();
await page
  .locator("#record-form-descripcion")
  .fill("Registro de prueba actualizado correctamente para validar la edición.");
await page.getByRole("button", { name: "Guardar cambios" }).click();
await page.waitForTimeout(300);
results.editToast = await page.locator(".toast p").last().textContent();
results.editedText = await page.locator(".records-table tbody").innerText();

await page.getByRole("button", { name: "Eliminar registro MEX-2025-TEST" }).click();
await page.getByRole("button", { name: "Sí, eliminar" }).click();
await page.waitForTimeout(300);
results.deleteToast = await page.locator(".toast p").last().textContent();
results.afterDeleteRows = await page.locator(".records-table tbody tr").count();

await page.getByRole("button", { name: "Limpiar filtros" }).first().click();
await page.getByPlaceholder("Ej. Ingeniería de Sistemas").fill("Medicina Humana");
await page.waitForTimeout(200);
results.searchByCareerRows = await page.locator(".records-table tbody tr").count();
results.searchByCareerText = await page.locator(".records-table tbody").innerText();

await page.getByPlaceholder("Ej. Ingeniería de Sistemas").fill("");
await page.getByPlaceholder("Palabras clave del documento").fill("recuperación");
await page.waitForTimeout(200);
results.searchByDescriptionRows = await page.locator(".records-table tbody tr").count();
await page.getByPlaceholder("Palabras clave del documento").fill("");
await page.waitForTimeout(200);

await page.locator(".records-table thead").getByRole("button", { name: "Carrera" }).click();
await page.waitForTimeout(200);
results.sortFirstCareer = await page
  .locator(".records-table tbody tr")
  .first()
  .locator(".career-cell__name")
  .textContent();

await page.getByRole("button", { name: "Ir a la página 2" }).click();
await page.waitForTimeout(200);
results.page2Info = await page.locator(".table-footer__info").textContent();
results.page2Rows = await page.locator(".records-table tbody tr").count();

const downloadPromise = page.waitForEvent("download", { timeout: 30000 });
await page.getByRole("button", { name: "Exportar Word" }).click();
const download = await downloadPromise;
const downloadPath = path.join(outDir, download.suggestedFilename());
await download.saveAs(downloadPath);
results.downloadPath = downloadPath;
results.downloadName = download.suggestedFilename();
results.downloadSize = fs.statSync(downloadPath).size;

await page.screenshot({ path: path.join(outDir, "module-with-pagination.png"), fullPage: true });

console.log(JSON.stringify({ results, errors }, null, 2));
await browser.close();
