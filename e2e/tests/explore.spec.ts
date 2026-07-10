import { test, expect } from "@playwright/test";

test.describe("Explore Page", () => {
  test("should display the explore page", async ({ page }) => {
    await page.goto("/explore");
    await expect(page.locator("h1")).toContainText("Explore NFTs");
  });

  test("should show loading state initially", async ({ page }) => {
    await page.goto("/explore");
    const nftGrid = page.locator(".nft-card-link");
    const loading = page.locator(".spinner");
    await expect(loading).toBeVisible();
  });

  test("should display NFT cards after loading", async ({ page }) => {
    // Navigate and wait for potential data to load
    await page.goto("/explore");

    // Wait for either NFTs to load or empty state
    await page.waitForTimeout(3000);

    // Check that the grid container exists
    const grid = page.locator(".grid");
    await expect(grid).toBeVisible();
  });

  test("should have working navigation", async ({ page }) => {
    await page.goto("/explore");
    await expect(page.locator("header")).toBeVisible();
  });

  test("should display empty state when no NFTs", async ({ page }) => {
    await page.goto("/explore");
    // Wait for loading to finish
    await page.waitForTimeout(3000);
    // The empty state or NFT cards should be visible
    const emptyState = page.locator(".empty-state");
    const nftCards = page.locator(".nft-card");

    if (await emptyState.isVisible()) {
      await expect(emptyState).toContainText("No NFTs");
    } else {
      await expect(nftCards.first()).toBeVisible();
    }
  });
});
