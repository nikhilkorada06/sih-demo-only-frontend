import test from "node:test";
import assert from "node:assert/strict";
import { createStore, documentMetadata } from "../src/service.js";
import { eligibility, services, students, sources } from "../src/data.js";

test("eligibility applies service-specific academic, income and residence rules", () => {
  assert.equal(eligibility(services[0], students[0]).eligible, true);
  for (const change of [
    { resident: "No" },
    { enrolled: "No" },
    { marks: "49" },
    { income: "250001" },
    { marks: "" },
  ])
    assert.equal(
      eligibility(services[0], { ...students[0], ...change }).eligible,
      false,
    );
  assert.equal(
    eligibility(services[1], { ...students[0], level: "Higher Secondary" })
      .eligible,
    false,
  );
  assert.equal(
    eligibility(services[4], { ...students[0], marks: "84" }).eligible,
    false,
  );
});
test("independent submission sources, unique IDs, tracking, status and audit lifecycle", async () => {
  const store = createStore();
  await assert.rejects(store.getApplication("EDU-APP-10001"), /not found/);
  const first = await store.receiveDemo();
  const second = await store.submitApplication(
    {
      serviceId: first.serviceId,
      student: first.student,
      documents: first.documents,
    },
    true,
  );
  assert.equal(first.applicationId, "EDU-APP-10001");
  assert.equal(second.applicationId, "EDU-APP-10002");
  assert.equal(first.source, sources[0]);
  assert.equal(second.source, sources[1]);
  await assert.rejects(
    store.submitApplication({
      serviceId: first.serviceId,
      student: first.student,
      documents: {},
    }),
    /Attach every/,
  );
  await assert.rejects(
    store.updateApplication(first.applicationId, "Rejected", ""),
    /reason/,
  );
  await store.updateApplication(
    first.applicationId,
    "Document Verification",
    "Check attachments",
  );
  let app = await store.updateApplication(
    first.applicationId,
    "Academic Verification",
    "Check institution",
  );
  assert.deepEqual(app.verification, {
    documents: "Verified",
    academic: "In progress",
  });
  app = await store.updateApplication(
    first.applicationId,
    "Approved",
    "Demo checks passed",
  );
  assert.equal(app.verification.academic, "Verified");
  assert.equal(
    (await store.getApplication(first.applicationId)).status,
    "Approved",
  );
  assert.equal(
    (await store.getApplication(second.applicationId)).status,
    "Submitted",
  );
  assert.equal((await store.getLogs()).length, 5);
  await store.updateApplication(
    first.applicationId,
    "Under Review",
    "Reopen review",
  );
  assert.equal(
    (await store.getApplication(first.applicationId)).verification.documents,
    "Pending",
  );
  app.student.fullName = "Mutated";
  assert.notEqual(
    (await store.getApplication(first.applicationId)).student.fullName,
    "Mutated",
  );
});
test("documents validate content and size without uploading file bytes", async () => {
  const file = new File(["%PDF-1.7\ndemo"], "demo.pdf", {
    type: "application/pdf",
  });
  assert.deepEqual(await documentMetadata(file), {
    name: "demo.pdf",
    size: file.size,
    type: "application/pdf",
  });
  await assert.rejects(
    documentMetadata(new File(["not a pdf"], "fake.pdf")),
    /valid PDF/,
  );
  await assert.rejects(
    documentMetadata(new File([], "empty.pdf")),
    /non-empty/,
  );
  await assert.rejects(
    documentMetadata(
      new File([new Uint8Array(4 * 1024 * 1024 + 1)], "large.pdf"),
    ),
    /4 MB/,
  );
});
