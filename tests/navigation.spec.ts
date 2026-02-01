import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto("http://localhost:5173/overview");
  await expect(page.locator("h4")).toContainText("Aircrafts");
  await page.getByRole("link", { name: "Dashboard" }).click();
  await expect(page.locator("h4")).toContainText("Dashboard");
  await page.getByRole("link", { name: "Favorites" }).click();
  await expect(page.locator("h4")).toContainText("Favorites");
});
