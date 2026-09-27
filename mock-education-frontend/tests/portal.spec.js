import { test, expect } from "@playwright/test";
const document = {
  name: "demo.pdf",
  mimeType: "application/pdf",
  buffer: Buffer.from("%PDF-1.7\nDemo education record"),
};
async function completeForm(page) {
  await page
    .getByRole("button", { name: "Fill fictional student details" })
    .click();
  for (let i = 0; i < 3; i++)
    await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page
    .getByLabel("Residence proof *")
    .setInputFiles({
      name: "fake.pdf",
      mimeType: "application/pdf",
      buffer: Buffer.from("invalid"),
    });
  await expect(page.getByRole("alert")).toContainText("valid PDF");
  for (const name of [
    "Residence proof",
    "Enrollment certificate",
    "Academic record",
    "Income certificate",
  ]) {
    await page.getByLabel(`${name} *`).setInputFiles(document);
    await expect(
      page.getByRole("button", { name: "Continue", exact: true }),
    ).toBeEnabled();
  }
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Review", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("checkbox").check();
  await page
    .getByRole("button", { name: "Submit application", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Application submitted successfully" }),
  ).toBeVisible();
}
test("citizen discovery, eligibility, documents, tracking and departmental lifecycle", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await page.getByLabel("Search services").fill("Merit");
  await expect(
    page.getByRole("heading", { name: "Merit-Based Education Scheme" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Post-Matric Scholarship" }),
  ).toHaveCount(0);
  await page.getByLabel("Search services").fill("");
  await page.getByLabel("Service category").selectOption("Verification");
  await expect(page.locator(".card")).toHaveCount(1);
  await page.getByLabel("Service category").selectOption("");
  await page.getByRole("link", { name: "View details" }).first().click();
  await page
    .getByLabel("Maharashtra resident", { exact: true })
    .selectOption("No");
  await page
    .getByLabel("Currently enrolled", { exact: true })
    .selectOption("Yes");
  await page
    .getByLabel("Course level", { exact: true })
    .selectOption("Undergraduate");
  await page.getByLabel("Previous marks (%)", { exact: true }).fill("88");
  await page
    .getByLabel("Annual family income (₹)", { exact: true })
    .fill("100000");
  await page
    .getByRole("button", { name: "Check eligibility", exact: true })
    .click();
  await expect(page.getByRole("alert")).toContainText("Not eligible");
  await page
    .getByLabel("Maharashtra resident", { exact: true })
    .selectOption("Yes");
  await page
    .getByRole("button", { name: "Check eligibility", exact: true })
    .click();
  await expect(page.getByRole("status")).toContainText(
    "Eligible under demo criteria",
  );
  await page.getByRole("link", { name: "Apply now" }).click();
  await completeForm(page);
  await expect(page.locator(".tracker-id")).toHaveText("EDU-APP-10001");
  await page
    .getByRole("link", { name: "Track application", exact: true })
    .last()
    .click();
  await expect(
    page.getByRole("heading", { name: "EDU-APP-10001" }),
  ).toBeVisible();
  await page.getByLabel("Application ID", { exact: true }).fill("UNKNOWN");
  await page
    .getByRole("button", { name: "Track application", exact: true })
    .click();
  await expect(page.getByRole("alert")).toContainText("not found");
  await page.getByRole("link", { name: "Department console" }).click();
  await expect(page.locator(".stat").first()).toContainText("1");
  await page
    .getByRole("link", { name: "MahaSetu simulator", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Receive demo MahaSetu application" })
    .click();
  await expect(page.getByRole("status")).toContainText("EDU-APP-10002");
  await page
    .getByRole("link", { name: "Review application", exact: true })
    .click();
  await page
    .getByLabel("New status")
    .selectOption("Additional Information Required");
  await page
    .getByLabel("Officer note")
    .fill("Provide updated enrollment record");
  await page.getByRole("button", { name: "Update status" }).click();
  await expect(page.getByRole("status")).toContainText("Status updated");
  await expect(
    page.getByText("Provide updated enrollment record Contact", {
      exact: false,
    }),
  ).toBeVisible();
  for (const status of [
    "Document Verification",
    "Academic Verification",
    "Verified",
    "Approved",
  ]) {
    await page.getByLabel("New status").selectOption(status);
    await page.getByRole("button", { name: "Update status" }).click();
    await expect(page.getByRole("status")).toContainText("Status updated");
    await expect(page.locator(".section-heading .badge")).toHaveText(status);
  }
  await page.getByRole("link", { name: "Applications", exact: true }).click();
  await expect(page.locator("tbody tr")).toHaveCount(2);
  await page
    .getByLabel("Source", { exact: true })
    .selectOption("MahaSetu Submission");
  await expect(page.locator("tbody tr")).toHaveCount(1);
  await page.getByRole("link", { name: "Manual entry", exact: true }).click();
  await completeForm(page);
  await expect(page.locator(".tracker-id")).toHaveText("EDU-APP-10003");
  await page.getByRole("link", { name: "Audit logs", exact: true }).click();
  await expect(
    page.getByRole("cell", { name: "Manual application created", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("cell", {
      name: "MahaSetu application received",
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("cell", { name: "Application approved", exact: true }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});
test("all routes render independently and layouts fit mobile, tablet and desktop", async ({
  page,
}) => {
  const routes = [
    "/",
    "/services",
    "/service-details?id=EDU-SVC-001",
    "/apply",
    "/track",
    "/admin",
    "/admin/dashboard",
    "/admin/applications",
    "/admin/application-details?id=missing",
    "/admin/services",
    "/admin/manual-entry",
    "/admin/interoperability",
    "/admin/logs",
    "/missing",
  ];
  for (const width of [390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of routes) {
      await page.goto(route);
      await expect(page.locator("h1")).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
        `${route} at ${width}`,
      ).toBe(true);
    }
  }
});
