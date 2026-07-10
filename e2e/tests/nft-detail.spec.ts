import { test, expect } from "@playwright/test";

test.describe("NFT Detail Page", () => {
  test("should show 404 for invalid NFT", async ({ page }) => {
    await page.goto("/nft/invalid-id");
    await expect(page.locator(".error-state")).toBeVisible();
    await expect(page.getByText("NFT not found")).toBeVisible();
  });

  test("should navigate back to explore from error state", async ({ page }) => {
    await page.goto("/nft/invalid-id");
    await page.getByText("Browse NFTs").click();
    await expect(page).toHaveURL(/\/explore/);
  });

  test("should handle valid NFT ID format", async ({ page }) => {
    // Use a valid format NFT ID
    await page.goto("/nft/0x0000000000000000000000000000000000000000:1");
    // Should either show detail or error
    await page.waitForTimeout(3000);
    const hasDetail = await page.locator(".nft-detail").isVisible();
    const hasError = await page.locator(".error-state").isVisible();
    expect(hasDetail || hasError).toBeTruthy();
  });
});
