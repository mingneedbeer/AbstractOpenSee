import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("should display the hero section", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("Discover, collect, and sell");
    await expect(page.locator(".hero-badge")).toContainText("Abstract Testnet");
  });

  test("should have navigation links", async ({ page }) => {
    await page.goto("/");
    const navLinks = page.locator(".nav-link");
    const links = await navLinks.allTextContents();
    expect(links).toContain("Explore");
    expect(links).toContain("Create");
  });

  test("should have connect wallet button", async ({ page }) => {
    await page.goto("/");
    const connectBtn = page.getByRole("button", { name: /connect/i });
    await expect(connectBtn).toBeVisible();
  });

  test("should navigate to explore page", async ({ page }) => {
    await page.goto("/");
    await page.getByText("Explore").first().click();
    await expect(page).toHaveURL(/\/explore/);
    await expect(page.locator("h1")).toContainText("Explore");
  });

  test("should navigate to create page", async ({ page }) => {
    await page.goto("/");
    await page.getByText("Create").first().click();
    await expect(page).toHaveURL(/\/create/);
    await expect(page.locator("h1")).toContainText("List an NFT");
  });

  test("should display features section", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".feature-card")).toHaveCount(3);
    await expect(page.getByText("Low Fees")).toBeVisible();
    await expect(page.getByText("Fast Settlement")).toBeVisible();
    await expect(page.getByText("Self-Custody")).toBeVisible();
  });
});
