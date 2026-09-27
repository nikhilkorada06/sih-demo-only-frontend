import { services, students, statuses, sources, eligibility } from "./data.js";
const delay = () => new Promise((resolve) => setTimeout(resolve, 180));
const clone = (value) => structuredClone(value);
export function createStore() {
  let applications = [];
  let logs = [];
  let sequence = 10000;
  const record = (app, actor, action, note = "") => {
    const event = {
      id: logs.length + 1,
      timestamp: new Date().toISOString(),
      actor,
      action,
      applicationId: app.applicationId,
      status: app.status,
      note,
    };
    logs.unshift(event);
    app.history.push(event);
  };
  const submit = (data, source, actor) => {
    const service = services.find((s) => s.id === data.serviceId);
    if (!service) throw new Error("Service not found.");
    if (!eligibility(service, data.student).eligible)
      throw new Error(
        "The student does not meet the demo eligibility criteria.",
      );
    if (service.documents.some((name) => !data.documents?.[name]))
      throw new Error("Attach every required document.");
    const app = {
      applicationId: `EDU-APP-${++sequence}`,
      serviceId: service.id,
      serviceName: service.name,
      student: clone(data.student),
      documents: clone(data.documents),
      employmentInformation: data.employmentInformation
        ? clone(data.employmentInformation)
        : null,
      source,
      submittedAt: new Date().toISOString(),
      status: "Submitted",
      verification: { documents: "Pending", academic: "Pending" },
      note: "",
      history: [],
    };
    applications.unshift(app);
    record(
      app,
      actor,
      source === sources[0]
        ? "MahaSetu application received"
        : actor === "Department officer"
          ? "Manual application created"
          : "Application submitted",
    );
    return clone(app);
  };
  return {
    async getApplications() {
      await delay();
      return clone(applications);
    },
    async getApplication(id) {
      await delay();
      const app = applications.find((a) => a.applicationId === id);
      if (!app)
        throw new Error(
          "Application not found. Check the Education application ID and try again.",
        );
      return clone(app);
    },
    async getLogs() {
      await delay();
      return clone(logs);
    },
    async submitApplication(data, manual = false) {
      await delay();
      return submit(
        data,
        sources[1],
        manual ? "Department officer" : "Citizen",
      );
    },
    async receiveDemo(serviceId = services[0].id) {
      await delay();
      const service = services.find((s) => s.id === serviceId);
      if (!service) throw new Error("Service not found.");
      return submit(
        {
          serviceId,
          student: students[0],
          documents: Object.fromEntries(
            service.documents.map((name) => [
              name,
              {
                name: `Demo ${name}.pdf`,
                size: 1024,
                type: "application/pdf",
                demo: true,
              },
            ]),
          ),
        },
        sources[0],
        "MahaSetu simulator",
      );
    },
    async updateApplication(id, status, note) {
      await delay();
      const app = applications.find((a) => a.applicationId === id);
      if (!app) throw new Error("Application not found.");
      if (!statuses.includes(status))
        throw new Error("Invalid application status.");
      if (
        ["Rejected", "Additional Information Required"].includes(status) &&
        !note.trim()
      )
        throw new Error(
          "Provide a reason or the information required from the student.",
        );
      if (status === app.status) throw new Error("Choose a different status.");
      app.status = status;
      app.note = note.trim();
      // Moving backward reopens the relevant verification stage.
      const rank = statuses.indexOf(status);
      if (rank <= 5)
        app.verification = {
          documents:
            rank >= 3 ? "Verified" : rank === 2 ? "In progress" : "Pending",
          academic:
            rank >= 4 ? "Verified" : rank === 3 ? "In progress" : "Pending",
        };
      const action =
        {
          "Under Review": "Application reviewed",
          "Document Verification": "Document verification triggered",
          "Academic Verification": "Academic verification triggered",
          Approved: "Application approved",
          Rejected: "Application rejected",
        }[status] || "Status changed";
      record(app, "Department officer", action, app.note);
      return clone(app);
    },
  };
}
export const api = createStore();
export async function documentMetadata(file) {
  if (file.size > 4 * 1024 * 1024 || file.size === 0)
    throw new Error("Choose a non-empty file of 4 MB or smaller.");
  const bytes = new Uint8Array(await file.slice(0, 8).arrayBuffer());
  const pdf = new TextDecoder().decode(bytes.slice(0, 5)) === "%PDF-";
  const png = [137, 80, 78, 71, 13, 10, 26, 10].every((b, i) => bytes[i] === b);
  const jpg = bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
  if (!pdf && !png && !jpg)
    throw new Error("Choose a valid PDF, PNG or JPEG document.");
  return {
    name: file.name,
    size: file.size,
    type: pdf ? "application/pdf" : png ? "image/png" : "image/jpeg",
  };
}
