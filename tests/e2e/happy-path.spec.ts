import { expect, test } from "@playwright/test";

test("sign up, create outing, invite, submit preferences, and compare", async ({ page }) => {
  await page.goto("/sign-up");
  await page.getByLabel("Full name").fill("Taylor Demo");
  await page.getByLabel("Email").fill("taylor@example.com");
  await page.getByLabel("Password").fill("password123");
  await page.getByRole("button", { name: "Create account" }).click();

  await expect(page.getByText("Welcome back, Taylor")).toBeVisible();

  await page.getByRole("link", { name: /Create outing/i }).click();
  await page.getByLabel("Trip name").fill("Summer friends trip");
  await page.getByLabel("Rough location").fill("Driveable golf weekend");
  await page.getByLabel("Date start").fill("2026-06-10");
  await page.getByLabel("Date end").fill("2026-06-13");
  await page.getByRole("button", { name: "Create outing" }).click();

  await expect(page.getByText("Summer friends trip")).toBeVisible();

  await page.getByLabel("Invite by email").fill("newfriend@example.com");
  await page.getByRole("button", { name: "Send invite" }).click();
  await expect(page.getByText("Invite sent")).toBeVisible();

  await page.getByLabel("Budget min").fill("800");
  await page.getByLabel("Budget max").fill("1300");
  await page.getByLabel("Available dates").fill("2026-06-10, 2026-06-11");
  await page.getByRole("button", { name: "Save preferences" }).click();
  await expect(page.getByText("Preferences saved")).toBeVisible();

  await page.getByRole("link", { name: "Compare options" }).click();
  await expect(page.getByText("Compare destinations, golf, and lodging side by side")).toBeVisible();
});

test("protects outing access for non-members and admin page for non-admins", async ({ page }) => {
  await page.goto("/sign-in");
  await page.getByLabel("Email").fill("host@outing.golf");
  await page.getByLabel("Password").fill("anything");
  await page.getByRole("button", { name: "Sign in" }).click();

  await page.goto("/admin");
  await expect(page).toHaveURL(/\/dashboard$/);

  await page.getByRole("button", { name: "Sign out" }).click();

  await page.goto("/sign-up");
  await page.getByLabel("Full name").fill("New Person");
  await page.getByLabel("Email").fill("newperson@example.com");
  await page.getByLabel("Password").fill("password123");
  await page.getByRole("button", { name: "Create account" }).click();

  await page.goto("/outings/outing_demo");
  await expect(page.getByText("This outing isn’t available to you")).toBeVisible();

  await page.getByRole("button", { name: "Sign out" }).click();

  await page.goto("/sign-in");
  await page.getByLabel("Email").fill("admin@outing.golf");
  await page.getByLabel("Password").fill("anything");
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.goto("/admin");
  await expect(
    page.getByText("Simple controls for content, featured options, and launch readiness")
  ).toBeVisible();
});
