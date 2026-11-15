import { expect, test } from "@playwright/test";

test("gallery pagination and responsive layout", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/design-system");
  await page.getByLabel("Search components").fill("Paginated Data Table");
  const table = page.locator("#data-table");
  await expect(table.getByText("Showing 1–5 of 84 rows")).toBeVisible();
  await table.getByRole("button", { name: "Next", exact: true }).click();
  await expect(table.getByText("Showing 6–10 of 84 rows")).toBeVisible();
  await table.getByLabel("Search requests").fill("req-084");
  await expect(table.getByText("Showing 1–1 of 1 rows")).toBeVisible();
  await expect(table.getByRole("button", { name: "Next", exact: true })).toBeDisabled();
  await table.getByLabel("Search requests").fill("no-results");
  await expect(table.getByText("No matching rows.")).toBeVisible();
  await expect(page.locator("html")).toHaveJSProperty("scrollWidth", await page.locator("html").evaluate(el => el.clientWidth));
  expect(errors).toEqual([]);
});

test("AI charts render and filters, themes, and data tables work", async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/design-system/analytics");
  await expect(page.getByRole("heading", { name: "AI, in perspective." })).toBeVisible();
  await expect(page.locator(".sky-chart svg.recharts-surface")).toHaveCount(9);
  for (const chart of await page.locator(".sky-chart").all()) {
    const box = await chart.boundingBox();
    expect(box?.width).toBeGreaterThan(100);
    expect(box?.height).toBeGreaterThan(100);
  }
  await page.getByRole("combobox", { name: "Operational window" }).click();
  await page.getByRole("option", { name: "Nov 8–14, 2026" }).click();
  await page.getByRole("combobox", { name: "Model", exact: true }).click();
  await page.getByRole("option", { name: "Scout", exact: true }).click();
  await expect(page.getByText("Showing 1–10 of 14 rows")).toBeVisible();
  await page.getByRole("button", { name: "Dark theme", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.locator("summary").first().click();
  await expect(page.getByRole("table", { name: "Token usage values" })).toBeVisible();
  await expect(page.locator("html")).toHaveJSProperty("scrollWidth", await page.locator("html").evaluate(el => el.clientWidth));
  await page.screenshot({ path: `.checks/analytics-${testInfo.project.name}.png` });
  expect(errors).toEqual([]);
});
