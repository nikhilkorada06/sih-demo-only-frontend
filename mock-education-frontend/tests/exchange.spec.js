import { test, expect } from "@playwright/test";

async function requestData(page, source) {
  const panel = page.locator(".department-exchange");
  const traffic = [];
  const listener = (request) => {
    if (["fetch", "xhr"].includes(request.resourceType()))
      traffic.push(request.url());
  };
  page.on("request", listener);
  const started = Date.now();
  await panel.getByRole("button").click();
  await expect(panel.getByRole("button")).toBeDisabled();
  await expect(panel.getByRole("status")).toHaveText(
    `Connecting to ${source} Department…`,
  );
  await expect(panel.getByRole("status")).toContainText("Fetching");
  await expect(panel.getByRole("status")).toHaveText(
    `✓ Data received from ${source} Department`,
  );
  expect(Date.now() - started).toBeGreaterThanOrEqual(1900);
  await expect(panel.locator(".department-source")).toHaveText(
    `Source: ${source} Department · Demo data`,
  );
  await expect(panel.getByRole("button")).toHaveText(`Refresh ${source} Data`);
  expect(traffic).toEqual([]);
  page.off("request", listener);
}
async function checkResponsive(page) {
  for (const width of [390, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    const box = await page.locator(".department-exchange").boundingBox();
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(width);
    expect(
      await page
        .locator(".department-exchange")
        .evaluate((el) => el.scrollWidth <= el.clientWidth),
    ).toBe(true);
  }
}
const pdf = {
  name: "demo.pdf",
  mimeType: "application/pdf",
  buffer: Buffer.from("%PDF-1.7\nDemo record"),
};

test("Education receives Employment details, refreshes and retains them through review and submission", async ({
  page,
}) => {
  await page.goto("/apply");
  await page
    .getByRole("button", { name: "Fill fictional student details" })
    .click();
  for (let i = 0; i < 2; i++)
    await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(page.locator(".department-status")).toHaveText(
    "No information has been fetched.",
  );
  await requestData(page, "Employment");
  await expect(page.locator(".department-fields")).toContainText(
    "Sahyadri Demo Industries",
  );
  await checkResponsive(page);
  await requestData(page, "Employment");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("button", { name: "Back", exact: true }).click();
  await expect(page.locator(".department-fields")).toContainText("Full Time");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  for (const name of [
    "Residence proof",
    "Enrollment certificate",
    "Academic record",
    "Income certificate",
  ]) {
    await page.getByLabel(`${name} *`).setInputFiles(pdf);
    await expect(
      page.getByRole("button", { name: "Continue", exact: true }),
    ).toBeEnabled();
  }
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(page.locator(".department-source")).toContainText(
    "Employment Department",
  );
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("checkbox").check();
  await page
    .getByRole("button", { name: "Submit application", exact: true })
    .click();
  await expect(page.locator(".tracker-id")).toHaveText("EDU-APP-10001");
  await page.getByRole("link", { name: "Department console" }).click();
  await page.getByRole("link", { name: "EDU-APP-10001" }).click();
  await expect(page.locator(".department-fields")).toContainText(
    "Sahyadri Demo Industries",
  );
});

test("Employment receives Education details, populates qualification and preserves application submission", async ({
  page,
}) => {
  await page.goto("http://127.0.0.1:5176/apply?job=JOB-2023-001");
  await requestData(page, "Education");
  const qualification = page
    .locator(".form-field")
    .filter({
      has: page.locator("label", { hasText: /^Highest Qualification$/ }),
    })
    .locator("input");
  await expect(qualification).toHaveValue("B.Tech");
  await checkResponsive(page);
  await qualification.fill("Manual correction");
  await requestData(page, "Education");
  await expect(qualification).toHaveValue("B.Tech");
  for (const [label, value] of [
    ["Aadhaar Number *", "000000000000"],
    ["Full Name *", "Demo Applicant"],
    ["Date of Birth *", "1998-06-15"],
  ]) {
    await page
      .locator(".form-field")
      .filter({ has: page.locator("label").filter({ hasText: label }) })
      .locator("input")
      .fill(value);
  }
  await page.locator("input[type=file]").setInputFiles(pdf);
  await expect(page.getByText("Selected: demo.pdf")).toBeVisible();
  await page
    .getByRole("button", { name: "Submit application", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Application submitted successfully" }),
  ).toBeVisible();
  await page
    .getByRole("dialog")
    .getByRole("link", { name: "Track application" })
    .click();
  await page
    .getByRole("button", { name: "Track Application", exact: true })
    .click();
  await expect(page.locator(".tracking-result")).toContainText(
    "Demo Applicant",
  );
  // Navigate within the SPA to preserve Employment's existing in-memory store.
  await page.evaluate(() => {
    history.pushState({}, "", "/admin/applications");
    dispatchEvent(new PopStateEvent("popstate"));
  });
  await page.locator("tbody a").first().click();
  await expect(page.locator(".department-fields")).toContainText(
    "Sahyadri Demo Institute of Technology",
  );
  await page.reload();
  await page.goto("http://127.0.0.1:5176/apply");
  await expect(page.locator(".department-status")).toHaveText(
    "No information has been fetched.",
  );
});
