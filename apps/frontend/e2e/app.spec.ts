import { expect, test } from "@playwright/test";

const REPO_URL = "https://github.com/stats-organization/github-stats-extended";

test("load initial page correctly", async ({ page }) => {
  await page.goto("");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/GitHub Stats Extended/);

  // Header branding, with the logo beside the wordmark.
  const siteTitle = page.getByRole("link", { name: "GitHub Stats Extended" });
  await expect(siteTitle).toBeVisible();
  await expect(siteTitle.locator("img")).toBeVisible();

  // The two halves of the site, with this one marked as current.
  await expect(
    page.getByRole("link", { name: "Wizard", exact: true }),
  ).toHaveAttribute("aria-current", "page");
  await expect(
    page.getByRole("link", { name: "Docs", exact: true }),
  ).toHaveAttribute("href", "/frontend/docs/");

  await expect(
    page.getByRole("link", { name: "GitHub", exact: true }),
  ).toHaveAttribute("href", REPO_URL);

  // Login buttons
  const publicAccessBtn = page.getByRole("button", {
    name: /github public access/i,
  });
  await expect(publicAccessBtn).toBeVisible();
  await expect(publicAccessBtn).toBeEnabled();

  const privateAccessBtn = page.getByRole("button", {
    name: /github private access/i,
  });
  await expect(privateAccessBtn).toBeVisible();
  await expect(privateAccessBtn).toBeEnabled();

  const guestBtn = page.getByRole("button", { name: /continue as guest/i });
  await expect(guestBtn).toBeVisible();
  await expect(guestBtn).toBeEnabled();
});

test("theme selection applies, persists and reaches the wizard", async ({
  page,
}) => {
  await page.goto("");

  const html = page.locator("html");
  const themeSelect = page.getByRole("combobox", { name: "Select theme" });

  // The site's own control owns `data-theme`, which is also what daisyUI reads.
  await themeSelect.selectOption("dark");
  await expect(html).toHaveAttribute("data-theme", "dark");
  await expect(
    page.evaluate(() => localStorage.getItem("starlight-theme")),
  ).resolves.toBe("dark");

  // The choice survives a reload.
  await page.reload();
  await expect(html).toHaveAttribute("data-theme", "dark");
  await expect(themeSelect).toHaveValue("dark");

  // Switching back works too.
  await themeSelect.selectOption("light");
  await expect(html).toHaveAttribute("data-theme", "light");
});

test("navigates between steps", async ({ page }) => {
  await page.goto("");

  // Scoped to the page content: Astro's dev toolbar has headings of its own.
  const heading = page.locator("main").getByRole("heading", { level: 1 });

  // We are at stage 1
  await expect(heading).toContainText("Login");

  // Go to stage 2
  await page.getByRole("button", { name: "Select card" }).click();
  await expect(heading).toContainText("Select a Card");

  // Go to stage 3
  await page.getByRole("button", { name: "Modify parameters" }).click();
  await expect(heading).toContainText("Modify Card Parameters");

  // Go to stage 4
  await page.getByRole("button", { name: "Select theme" }).click();
  await expect(heading).toContainText("Choose a Theme");

  // Go to stage 5
  await page.getByRole("button", { name: "Display card" }).click();
  await expect(heading).toContainText("Display your Card");
});
