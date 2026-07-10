import { test, expect } from "@playwright/test";

test.describe("Profile Page", () => {
  test("should display profile for a valid address", async ({ page }) => {
    const address = "0x0000000000000000000000000000000000000000";
    await page.goto(`/profile/${address}`);
    await expect(page.locator(".profile")).toBeVisible();

    // Should show the address
    await page.waitForTimeout(2000);
    const addressText = await page.locator(".address-truncated").first().textContent();
    expect(addressText).toBeTruthy();
  });

  test("should show NFTs section on profile", async ({ page }) => {
    const address = "0x0000000000000000000000000000000000000000";
    await page.goto(`/profile/${address}`);
    await expect(page.getByText("Collected")).toBeVisible();
  });

  test("should format address correctly", async ({ page }) => {
    const address = "0x1234567890abcdef1234567890abcdef12345678";
    await page.goto(`/profile/${address}`);
    await page.waitForTimeout(2000);
    // The address should be visible somewhere
    const body = await page.locator("body").textContent();
    expect(body).toContain("0x1234");
  });
});
