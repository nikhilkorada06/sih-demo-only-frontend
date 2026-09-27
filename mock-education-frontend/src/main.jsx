import DepartmentExchange, {
  ReceivedInformation,
} from "./DepartmentExchange.jsx";
import React, { useEffect, useId, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  services,
  institutions,
  levels,
  statuses,
  sources,
  steps,
  students,
  eligibility,
} from "./data.js";
import { api, documentMetadata } from "./service.js";
import "../css/main.css";
import "../css/forms.css";
import "../css/dashboard.css";
import "../css/responsive.css";

const go = (url) => {
  window.history.pushState({}, "", url);
  window.dispatchEvent(new PopStateEvent("popstate"));
  window.scrollTo(0, 0);
};
const query = (key) => new URLSearchParams(window.location.search).get(key);
const date = (value) =>
  new Date(value).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
function Link({ href, children, className = "" }) {
  return (
    <a
      className={className}
      href={href}
      onClick={(e) => {
        if (
          e.button === 0 &&
          !e.metaKey &&
          !e.ctrlKey &&
          !e.shiftKey &&
          !e.altKey
        ) {
          e.preventDefault();
          go(href);
        }
      }}
    >
      {children}
    </a>
  );
}
function Badge({ value }) {
  return (
    <span
      className={`badge ${["Approved", "Verified", "Open"].includes(value) ? "success" : value === "Rejected" ? "danger" : "neutral"}`}
    >
      {value}
    </span>
  );
}
function Message({ children, success = false }) {
  return children ? (
    <div
      className={`alert ${success ? "success" : ""}`}
      role={success ? "status" : "alert"}
    >
      {children}
    </div>
  ) : null;
}
function Field({ label, children }) {
  const id = useId();
  return (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>
      {React.cloneElement(children, { id })}
    </div>
  );
}
function Shell({ title, admin = false, children }) {
  useEffect(() => {
    document.title = `${title} | Education Department Demo`;
    document.getElementById("main-content")?.focus();
  }, [title]);
  const navigation = admin
    ? [
        ["/admin", "Dashboard"],
        ["/admin/applications", "Applications"],
        ["/admin/services", "Services"],
        ["/admin/manual-entry", "Manual entry"],
        ["/admin/interoperability", "MahaSetu simulator"],
        ["/admin/logs", "Audit logs"],
        ["/", "Citizen portal"],
      ]
    : [
        ["/", "Home"],
        ["/services", "Education services"],
        ["/apply", "Apply"],
        ["/track", "Track application"],
        ["/admin", "Department console"],
      ];
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <div className="top-strip">
        <div className="wide">
          <span>Government of Maharashtra · Education</span>
          <span>SIH demonstration · Not an official government service</span>
        </div>
      </div>
      <header className="wide site-header">
        <Link href="/" className="seal">
          ▤
        </Link>
        <div>
          <p className="brand-kicker">Government of Maharashtra</p>
          <p className="brand-title">Maharashtra Education Department</p>
          <p className="muted">
            विद्यार्थ्यांच्या उज्ज्वल भविष्यासाठी · Learning, opportunity &
            progress
          </p>
        </div>
      </header>
      <div className={admin ? "admin-shell" : ""}>
        <nav
          className={admin ? "admin-sidebar" : "site-nav"}
          aria-label={admin ? "Department navigation" : "Main navigation"}
        >
          {navigation.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className={window.location.pathname === href ? "active" : ""}
            >
              {label}
            </Link>
          ))}
        </nav>
        <main
          id="main-content"
          tabIndex="-1"
          className={admin ? "admin-main" : "container"}
        >
          {children}
        </main>
      </div>
      <footer>
        <div className="wide">
          <strong>Maharashtra Education Department · SIH Demo</strong>
          <p>
            Fictional schemes, institutions and student records. Use
            demonstration information only.
          </p>
          <p>
            Records stay in this page’s memory and reset on reload. Documents
            are represented by file metadata; nothing is uploaded.
          </p>
        </div>
      </footer>
    </>
  );
}
function Heading({ title, children }) {
  return (
    <div className="section-heading">
      <div>
        <p className="eyebrow">Education & student services</p>
        <h1>{title}</h1>
        {children && <p className="muted">{children}</p>}
      </div>
    </div>
  );
}
function ServiceCard({ service }) {
  return (
    <article className="card">
      <div className="card-top">
        <span className="service-icon" aria-hidden="true">
          ▤
        </span>
        <Badge value={service.status} />
      </div>
      <p className="eyebrow">{service.category}</p>
      <h2>{service.name}</h2>
      <p>{service.description}</p>
      <ul className="criteria">
        <li>✓ Maharashtra resident</li>
        <li>✓ Enrolled student</li>
        <li>
          ✓{" "}
          {service.minMarks
            ? `${service.minMarks}% minimum academic marks`
            : "Enrollment documentation"}
        </li>
      </ul>
      <Link
        className="btn btn-secondary"
        href={`/service-details?id=${service.id}`}
      >
        View details
      </Link>
    </article>
  );
}
function Discovery({ home = false }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [featured, setFeatured] = useState(false);
  const filtered = services.filter(
    (s) =>
      `${s.name} ${s.description}`
        .toLowerCase()
        .includes(search.toLowerCase()) &&
      (!category || s.category === category) &&
      (!level || s.levels.includes(level)) &&
      (!featured || s.featured),
  );
  return (
    <Shell title={home ? "Home" : "Education services"}>
      {home ? (
        <section className="hero">
          <p className="eyebrow">Opportunity starts with education</p>
          <h1>
            Supporting every step
            <br />
            of your learning journey.
          </h1>
          <p>
            Discover student assistance, explore scholarships and request
            academic verification through your department portal.
          </p>
          <div className="actions">
            <a className="btn btn-primary" href="#services">
              Explore services
            </a>
            <Link className="btn btn-secondary" href="/track">
              Track your application →
            </Link>
          </div>
          <div className="hero-foot">
            05 demo services <span>One independent education department</span>
          </div>
        </section>
      ) : (
        <Heading title="Education services">
          Find the right support for your academic journey.
        </Heading>
      )}
      <aside className="notice">
        <strong>Important notice</strong> All services are demonstration
        schemes. Eligibility thresholds, benefits and processing periods are
        illustrative, not official policy.
      </aside>
      <section id="services">
        <div className="section-heading">
          <h2>Services & schemes</h2>
          <span>{filtered.length} services available</span>
        </div>
        <div className="panel filters">
          <Field label="Search services">
            <input
              type="search"
              placeholder="Scholarship, assistance, verification…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Field>
          <Field label="Service category">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All categories</option>
              {["Scholarship", "Assistance", "Verification", "Merit"].map(
                (c) => (
                  <option key={c}>{c}</option>
                ),
              )}
            </select>
          </Field>
          <Field label="Course level">
            <select value={level} onChange={(e) => setLevel(e.target.value)}>
              <option value="">All levels</option>
              {levels.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </Field>
          <label className="check">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
            />
            Featured schemes
          </label>
        </div>
        <div className="grid">
          {filtered.map((s) => (
            <ServiceCard key={s.id} service={s} />
          ))}
        </div>
        {!filtered.length && (
          <p className="empty">
            No matching services. Try another search or filter.
          </p>
        )}
      </section>
    </Shell>
  );
}
function Eligibility({ service }) {
  const [values, setValues] = useState({
    resident: "",
    enrolled: "",
    level: "",
    marks: "",
    income: "",
  });
  const [result, setResult] = useState(null);
  return (
    <section className="panel" id="eligibility">
      <h2>Check eligibility</h2>
      <p>Indicative demo check. Departmental verification is still required.</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setResult(eligibility(service, values));
        }}
      >
        <div className="form-grid">
          {[
            ["resident", "Maharashtra resident", ["Yes", "No"]],
            ["enrolled", "Currently enrolled", ["Yes", "No"]],
            ["level", "Course level", levels],
          ].map(([key, label, options]) => (
            <Field key={key} label={label}>
              <select
                required
                value={values[key]}
                onChange={(e) => {
                  setResult(null);
                  setValues({ ...values, [key]: e.target.value });
                }}
              >
                <option value="">Select</option>
                {options.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </Field>
          ))}
          {[
            ["marks", "Previous marks (%)", 100],
            ...(service.maxIncome === null
              ? []
              : [["income", "Annual family income (₹)", undefined]]),
          ].map(([key, label, max]) => (
            <Field key={key} label={label}>
              <input
                required
                type="number"
                min="0"
                max={max}
                step="0.01"
                value={values[key]}
                onChange={(e) => {
                  setResult(null);
                  setValues({ ...values, [key]: e.target.value });
                }}
              />
            </Field>
          ))}
        </div>
        <button className="btn btn-primary">Check eligibility</button>
      </form>
      {result && (
        <Message success={result.eligible}>
          <strong>
            {result.eligible
              ? "Eligible under demo criteria"
              : "Not eligible under demo criteria"}
          </strong>
          <ul>
            {result.checks.map(([label, pass]) => (
              <li key={label}>
                {pass ? "✓" : "✕"} {label}
              </li>
            ))}
          </ul>
        </Message>
      )}
    </section>
  );
}
function Details() {
  const service = services.find((s) => s.id === query("id"));
  if (!service) return <NotFound />;
  return (
    <Shell title={service.name}>
      <Link href="/services">← All services</Link>
      <Heading title={service.name}>
        {service.department} · {service.id}
      </Heading>
      <div className="detail-grid">
        <section className="panel">
          <Badge value={service.status} />
          <h2>About this service</h2>
          <p>{service.description}</p>
          <h3>Benefits</h3>
          <p>{service.benefit}</p>
          <h3>Eligibility</h3>
          <ul>
            <li>Maharashtra resident and currently enrolled student</li>
            <li>Eligible course levels: {service.levels.join(", ")}</li>
            <li>Minimum academic marks: {service.minMarks}%</li>
            <li>
              {service.maxIncome
                ? `Annual family income at most ₹${service.maxIncome.toLocaleString("en-IN")}`
                : "No income ceiling for this demo service"}
            </li>
          </ul>
          <h3>Application steps</h3>
          <ol>
            {steps.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
          <div className="actions">
            <a className="btn btn-secondary" href="#eligibility">
              Check eligibility
            </a>
            <Link
              className="btn btn-primary"
              href={`/apply?service=${service.id}`}
            >
              Apply now
            </Link>
          </div>
        </section>
        <aside className="panel">
          <h2>Before you apply</h2>
          <h3>Required documents</h3>
          <ul>
            {service.documents.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
          <h3>Processing information</h3>
          <p>
            Illustrative processing period: {service.days} working days. No
            actual benefit is issued.
          </p>
          <h3>Important instructions</h3>
          <p>
            Use demo details. Attach a PDF, PNG or JPEG up to 4 MB for each
            document. Enter marks as a percentage; use your institution’s
            conversion when starting from CGPA.
          </p>
          <p>
            Save the tracker ID after submission and keep this browser page
            open.
          </p>
        </aside>
      </div>
      <Eligibility service={service} />
    </Shell>
  );
}
const personalFields = [
  ["fullName", "Full name"],
  ["dateOfBirth", "Date of birth", "date"],
  ["phone", "Mobile number", "tel"],
  ["email", "Email", "email"],
  ["address", "Address"],
  ["district", "District"],
];
const academicFields = [
  ["studentId", "Student ID"],
  ["institution", "Institution", institutions],
  ["university", "University / Board"],
  ["course", "Course"],
  ["level", "Course level", levels],
  ["academicYear", "Academic year"],
  ["enrollmentYear", "Enrollment year", "number"],
  ["previousQualification", "Previous qualification"],
  ["marks", "Previous marks (%)", "number"],
];
const familyFields = [
  ["category", "Category", ["General", "SC", "ST", "OBC", "Other"]],
  ["income", "Annual family income (₹)", "number"],
  ["resident", "Maharashtra resident", ["Yes", "No"]],
  ["enrolled", "Currently enrolled", ["Yes", "No"]],
];
function StudentSummary({ student }) {
  return (
    <dl className="kv">
      {[...personalFields, ...academicFields, ...familyFields].map(
        ([key, label]) => (
          <React.Fragment key={key}>
            <dt>{label}</dt>
            <dd>{student[key] || "—"}</dd>
          </React.Fragment>
        ),
      )}
    </dl>
  );
}
function Apply({ manual = false }) {
  const [serviceId, setServiceId] = useState(
    query("service") || services[0].id,
  );
  const service = services.find((s) => s.id === serviceId);
  const [student, setStudent] = useState({});
  const [documents, setDocuments] = useState({});
  const [employmentInformation, setEmploymentInformation] = useState(null);
  const [exchangeBusy, setExchangeBusy] = useState(false);
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [consent, setConsent] = useState(false);
  const [result, setResult] = useState(null);
  if (!service) return <NotFound />;
  const upload = async (name, file) => {
    setError("");
    setDocuments((current) => {
      const next = { ...current };
      delete next[name];
      return next;
    });
    if (!file) return;
    setBusy(true);
    try {
      const doc = await documentMetadata(file);
      setDocuments((current) => ({ ...current, [name]: doc }));
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };
  const next = async (e) => {
    e.preventDefault();
    if (busy || exchangeBusy) return;
    setError("");
    if (step === 2 && !eligibility(service, student).eligible)
      return setError(
        "Demo eligibility criteria are not met. Review residence, enrollment, course level, marks and income against the service details.",
      );
    if (step === 3 && service.documents.some((d) => !documents[d]))
      return setError("Attach all required documents before continuing.");
    if (step < 5) return setStep(step + 1);
    setBusy(true);
    try {
      setResult(
        await api.submitApplication(
          { serviceId, student, documents, employmentInformation },
          manual,
        ),
      );
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <Shell title={manual ? "Manual application" : "Apply"} admin={manual}>
      <Heading
        title={
          manual
            ? "Create a direct department entry"
            : "Education service application"
        }
      >
        {manual
          ? "Record a student application received directly at the department."
          : "Complete six steps to receive your application tracker ID."}
      </Heading>
      {result ? (
        <section className="panel confirmation" role="status">
          <span className="service-icon">✓</span>
          <h2>Application submitted successfully</h2>
          <p>{result.serviceName}</p>
          <p>Your application tracker ID</p>
          <strong className="tracker-id">{result.applicationId}</strong>
          <p>
            <Badge value={result.source} />
          </p>
          <p>Keep this page open: demo records reset when you reload.</p>
          <Link
            className="btn btn-primary"
            href={`/track?id=${result.applicationId}`}
          >
            Track application
          </Link>
          {manual && (
            <Link className="btn btn-secondary" href="/admin/applications">
              Application register
            </Link>
          )}
        </section>
      ) : (
        <>
          <ol className="stepper">
            {steps.map((s, i) => (
              <li
                key={s}
                className={i === step ? "current" : i < step ? "complete" : ""}
                aria-current={i === step ? "step" : undefined}
              >
                <span>{i < step ? "✓" : i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
          <section className="panel">
            <p className="eyebrow">
              Step {step + 1} of 6 · {sources[1]}
            </p>
            <h2>{steps[step]}</h2>
            <Message>{error}</Message>
            <form onSubmit={next}>
              {step === 0 && (
                <>
                  <Field label="Education service">
                    <select
                      value={serviceId}
                      onChange={(e) => {
                        setServiceId(e.target.value);
                        setDocuments({});
                      }}
                    >
                      {services.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <button
                    className="btn btn-secondary"
                    type="button"
                    onClick={() => setStudent({ ...students[0] })}
                  >
                    Fill fictional student details
                  </button>
                  <p className="muted">
                    All fields are required. Use fictional information for this
                    demonstration.
                  </p>
                </>
              )}
              {step < 3 && (
                <div className="form-grid">
                  {[personalFields, academicFields, familyFields][step].map(
                    ([key, label, type = "text"]) => (
                      <Field key={key} label={`${label} *`}>
                        {Array.isArray(type) ? (
                          <select
                            required
                            value={student[key] || ""}
                            onChange={(e) =>
                              setStudent({ ...student, [key]: e.target.value })
                            }
                          >
                            <option value="">Select</option>
                            {type.map((v) => (
                              <option key={v}>{v}</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            required
                            type={type}
                            value={student[key] ?? ""}
                            min={
                              key === "enrollmentYear"
                                ? 1980
                                : type === "number"
                                  ? 0
                                  : undefined
                            }
                            max={
                              key === "marks"
                                ? 100
                                : key === "enrollmentYear"
                                  ? new Date().getFullYear()
                                  : key === "dateOfBirth"
                                    ? new Date().toISOString().slice(0, 10)
                                    : undefined
                            }
                            step={
                              key === "marks" || key === "income"
                                ? "0.01"
                                : undefined
                            }
                            pattern={
                              key === "phone"
                                ? "[0-9]{10}"
                                : type === "text"
                                  ? ".*\\S.*"
                                  : undefined
                            }
                            title={
                              key === "phone"
                                ? "Enter a 10-digit mobile number"
                                : undefined
                            }
                            onChange={(e) =>
                              setStudent({ ...student, [key]: e.target.value })
                            }
                          />
                        )}
                      </Field>
                    ),
                  )}
                </div>
              )}
              {step === 2 && (
                <DepartmentExchange
                  data={employmentInformation}
                  onReceive={setEmploymentInformation}
                  onBusyChange={setExchangeBusy}
                />
              )}
              {step === 3 && (
                <>
                  <p>
                    PDF, PNG or JPEG · Up to 4 MB each · Metadata only, no
                    server upload.
                  </p>
                  {service.documents.map((name) => (
                    <div className="document-row" key={name}>
                      <Field label={`${name} *`}>
                        <input
                          disabled={busy || exchangeBusy}
                          type="file"
                          accept=".pdf,.png,.jpg,.jpeg"
                          onChange={(e) => upload(name, e.target.files?.[0])}
                        />
                      </Field>
                      {documents[name] && (
                        <p>
                          ✓ {documents[name].name} (
                          {Math.ceil(documents[name].size / 1024)} KB){" "}
                          <button
                            type="button"
                            className="text-button"
                            onClick={() =>
                              setDocuments((current) => {
                                const next = { ...current };
                                delete next[name];
                                return next;
                              })
                            }
                          >
                            Remove {name}
                          </button>
                        </p>
                      )}
                    </div>
                  ))}
                </>
              )}
              {step === 4 && (
                <>
                  <h3>{service.name}</h3>
                  <StudentSummary student={student} />
                  <ReceivedInformation data={employmentInformation} />
                  <h3>Attachments</h3>
                  <ul>
                    {Object.entries(documents).map(([name, doc]) => (
                      <li key={name}>
                        {name}: {doc.name}
                      </li>
                    ))}
                  </ul>
                  <p>Use Back to correct any information before submitting.</p>
                </>
              )}
              {step === 5 && (
                <>
                  <h3>{service.name}</h3>
                  <p>
                    {student.fullName} · {student.studentId}
                  </p>
                  <p>
                    Your application will enter departmental review. This
                    demonstration does not issue a real scholarship or
                    certificate.
                  </p>
                  <label className="check">
                    <input
                      required
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                    />
                    I have reviewed the information and understand this is a
                    demo application.
                  </label>
                </>
              )}
              <div className="form-actions">
                {step > 0 && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    disabled={busy || exchangeBusy}
                    onClick={() => {
                      setStep(step - 1);
                      setError("");
                    }}
                  >
                    Back
                  </button>
                )}
                <button
                  className="btn btn-primary"
                  disabled={busy || exchangeBusy}
                >
                  {busy
                    ? "Processing…"
                    : step === 5
                      ? "Submit application"
                      : "Continue"}
                </button>
              </div>
            </form>
          </section>
        </>
      )}
    </Shell>
  );
}
function ApplicationRecord({ app, full = false }) {
  const stages = [
    "Submitted",
    "Document Verification",
    "Academic Verification",
    "Under Review",
    "Approved",
  ];
  return (
    <>
      <section className="panel">
        <div className="section-heading">
          <h2>{app.applicationId}</h2>
          <Badge value={app.status} />
        </div>
        <dl className="kv">
          <dt>Service</dt>
          <dd>{app.serviceName}</dd>
          <dt>Student</dt>
          <dd>{app.student.fullName}</dd>
          <dt>Source</dt>
          <dd>{app.source}</dd>
          <dt>Submitted</dt>
          <dd>{date(app.submittedAt)}</dd>
          <dt>Document verification</dt>
          <dd>{app.verification.documents}</dd>
          <dt>Academic verification</dt>
          <dd>{app.verification.academic}</dd>
        </dl>
        <h3>Required actions</h3>
        <p>
          {app.status === "Additional Information Required"
            ? `${app.note} Contact the demo department officer with the requested information.`
            : app.status === "Rejected"
              ? `Reason: ${app.note}`
              : app.status === "Approved"
                ? "No further action. Your demo application is approved."
                : "No student action required. Await departmental review."}
        </p>
        {app.note &&
          !["Rejected", "Additional Information Required"].includes(
            app.status,
          ) && <p>Officer note: {app.note}</p>}
        <h3>Processing stages</h3>
        <div className="stage-list">
          {stages.map((s) => (
            <span
              key={s}
              className={
                app.history.some((h) => h.status === s) ? "visited" : ""
              }
            >
              {s === "Submitted"
                ? "Application Submitted"
                : s === "Under Review"
                  ? "Department Review"
                  : s}
            </span>
          ))}
        </div>
        <p className="muted">
          Highlighted stages have a recorded event. Officers may revisit stages;
          the history below shows the actual sequence.
        </p>
      </section>
      {full && (
        <section className="panel">
          <h2>Student information</h2>
          <StudentSummary student={app.student} />
          <ReceivedInformation data={app.employmentInformation} />
          <h3>Document attachments</h3>
          <ul>
            {Object.entries(app.documents).map(([name, doc]) => (
              <li key={name}>
                {name} — {doc.name} · {Math.ceil(doc.size / 1024)} KB{" "}
                {doc.demo && "(simulated MahaSetu document)"}
              </li>
            ))}
          </ul>
        </section>
      )}
      <section className="panel">
        <h2>Application timeline</h2>
        <ol className="timeline">
          {app.history.map((h) => (
            <li key={h.id}>
              <strong>{h.action}</strong>
              <p>
                {date(h.timestamp)} · {h.actor} · {h.status}
              </p>
              {h.note && <p>{h.note}</p>}
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
function Track() {
  const [id, setId] = useState(query("id") || "");
  const [app, setApp] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const load = async (value) => {
    setBusy(true);
    setError("");
    setApp(null);
    try {
      setApp(await api.getApplication(value.trim().toUpperCase()));
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };
  useEffect(() => {
    if (query("id")) load(query("id"));
  }, []);
  return (
    <Shell title="Track application">
      <Heading title="Track your application">
        Follow your application from submission through departmental review.
      </Heading>
      <section className="panel">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            load(id);
          }}
          className="tracking-form"
        >
          <Field label="Application ID">
            <input
              required
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="EDU-APP-10001"
            />
          </Field>
          <button disabled={busy} className="btn btn-primary">
            {busy ? "Retrieving…" : "Track application"}
          </button>
        </form>
      </section>
      <Message>{error}</Message>
      {app && <ApplicationRecord app={app} />}
    </Shell>
  );
}
function useData(method) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const load = () => {
    setError("");
    api[method]()
      .then(setData)
      .catch((e) => setError(e.message));
  };
  useEffect(load, [method]);
  return { data, error, load };
}
function ApplicationTable({ items }) {
  return !items.length ? (
    <p className="empty">
      No applications found. Create a direct entry or simulate a MahaSetu
      submission.
    </p>
  ) : (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {[
              "Application ID",
              "Citizen",
              "Service",
              "Source",
              "Submitted",
              "Status",
              "Verification",
            ].map((t) => (
              <th key={t}>{t}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((a) => (
            <tr key={a.applicationId}>
              <td>
                <Link href={`/admin/application-details?id=${a.applicationId}`}>
                  {a.applicationId}
                </Link>
              </td>
              <td>{a.student.fullName}</td>
              <td>{a.serviceName}</td>
              <td>
                <Badge value={a.source} />
              </td>
              <td>{date(a.submittedAt)}</td>
              <td>
                <Badge value={a.status} />
              </td>
              <td>
                Documents: {a.verification.documents}
                <br />
                Academic: {a.verification.academic}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
function Dashboard() {
  const { data, error } = useData("getApplications");
  const apps = data || [];
  const count = (source) => apps.filter((a) => a.source === source).length;
  return (
    <Shell admin title="Dashboard">
      <Heading title="Department dashboard">
        Education applications and simulated interoperability, in one view.
      </Heading>
      <Message>{error}</Message>
      {!data ? (
        <p role="status">Loading dashboard…</p>
      ) : (
        <>
          <div className="stat-grid">
            {[
              ["Total applications", apps.length],
              ["MahaSetu applications", count(sources[0])],
              ["Direct applications", count(sources[1])],
              [
                "Pending verification",
                apps.filter(
                  (a) =>
                    !["Approved", "Rejected", "Verified"].includes(a.status),
                ).length,
              ],
              ["Approved", apps.filter((a) => a.status === "Approved").length],
              ["Rejected", apps.filter((a) => a.status === "Rejected").length],
            ].map(([label, value]) => (
              <div className="stat" key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
          <section className="panel">
            <h2>Application sources</h2>
            {sources.map((s) => (
              <div className="bar-row" key={s}>
                <span>{s}</span>
                <div className="bar-track">
                  <div
                    className={
                      s === sources[0] ? "bar-fill" : "bar-fill manual"
                    }
                    style={{
                      width: `${apps.length ? (count(s) / apps.length) * 100 : 0}%`,
                    }}
                  />
                </div>
                <strong>{count(s)}</strong>
              </div>
            ))}
            <div className="actions">
              <Link className="btn btn-primary" href="/admin/interoperability">
                Simulate MahaSetu submission
              </Link>
              <Link className="btn btn-secondary" href="/admin/manual-entry">
                Create direct entry
              </Link>
            </div>
          </section>
          <section className="panel">
            <h2>Recent applications</h2>
            <ApplicationTable items={apps.slice(0, 5)} />
          </section>
        </>
      )}
    </Shell>
  );
}
function Register() {
  const { data, error, load } = useData("getApplications");
  const [source, setSource] = useState("");
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const filtered = (data || []).filter(
    (a) =>
      (!source || a.source === source) &&
      (!status || a.status === status) &&
      `${a.applicationId} ${a.student.fullName} ${a.serviceName}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  return (
    <Shell admin title="Application register">
      <Heading title="Application register">
        Review applications from MahaSetu and direct department channels.
      </Heading>
      <div className="panel filters">
        <Field label="Search applications">
          <input value={search} onChange={(e) => setSearch(e.target.value)} />
        </Field>
        <Field label="Source">
          <select value={source} onChange={(e) => setSource(e.target.value)}>
            <option value="">All sources</option>
            {sources.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </Field>
        <Field label="Status">
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All statuses</option>
            {statuses.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </Field>
        <button className="btn btn-secondary" onClick={load}>
          Refresh
        </button>
      </div>
      <Message>{error}</Message>
      {data ? (
        <>
          <p>{filtered.length} records</p>
          <ApplicationTable items={filtered} />
        </>
      ) : (
        <p role="status">Loading applications…</p>
      )}
    </Shell>
  );
}
function AdminDetail() {
  const [app, setApp] = useState(null);
  const [status, setStatus] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    api
      .getApplication(query("id"))
      .then((a) => {
        setApp(a);
        setStatus(a.status);
      })
      .catch((e) => setError(e.message));
  }, []);
  return (
    <Shell admin title="Application review">
      <Heading title="Application review" />
      <Message>{error}</Message>
      <Message success>{message}</Message>
      {app ? (
        <>
          <ApplicationRecord app={app} full />
          <section className="panel">
            <h2>Update application status</h2>
            <p>
              All changes are recorded in the local audit history. Verification
              outcomes are simulated.
            </p>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setBusy(true);
                setError("");
                setMessage("");
                try {
                  setApp(
                    await api.updateApplication(
                      app.applicationId,
                      status,
                      note,
                    ),
                  );
                  setNote("");
                  setMessage("Status updated and audit event recorded.");
                } catch (e) {
                  setError(e.message);
                } finally {
                  setBusy(false);
                }
              }}
            >
              <div className="form-grid">
                <Field label="New status">
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    {statuses.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Officer note">
                  <textarea
                    required={[
                      "Rejected",
                      "Additional Information Required",
                    ].includes(status)}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Reason, required information or review note"
                  />
                </Field>
              </div>
              <button disabled={busy} className="btn btn-primary">
                {busy ? "Updating…" : "Update status"}
              </button>
            </form>
          </section>
        </>
      ) : (
        !error && <p role="status">Loading application…</p>
      )}
    </Shell>
  );
}
function Interoperability() {
  const [serviceId, setServiceId] = useState(services[0].id);
  const [app, setApp] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return (
    <Shell admin title="MahaSetu simulator">
      <Heading title="MahaSetu interoperability simulator">
        An independent department receiving a simulated citizen application.
      </Heading>
      <section className="panel">
        <div className="architecture">
          <strong>
            MahaSetu
            <br />
            <small>Master citizen portal</small>
          </strong>
          <span aria-label="two-way exchange">⇄</span>
          <strong>
            Education Department
            <br />
            <small>Independent departmental node</small>
          </strong>
        </div>
        <p>
          This local simulator follows Employment’s mock async service pattern.
          It creates a labelled MahaSetu submission using fictional student and
          document metadata. It is not connected to the running MahaSetu
          website.
        </p>
        <Field label="Service to simulate">
          <select
            value={serviceId}
            onChange={(e) => {
              setServiceId(e.target.value);
              setApp(null);
            }}
          >
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </Field>
        <details>
          <summary>Preview simulated application</summary>
          <StudentSummary student={students[0]} />
          <p>
            Attachments:{" "}
            {services.find((s) => s.id === serviceId).documents.join(", ")}{" "}
            (demo metadata).
          </p>
        </details>
        <button
          className="btn btn-primary"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            setError("");
            setApp(null);
            try {
              setApp(await api.receiveDemo(serviceId));
            } catch (e) {
              setError(e.message);
            } finally {
              setBusy(false);
            }
          }}
        >
          {busy ? "Receiving…" : "Receive demo MahaSetu application"}
        </button>
        <Message>{error}</Message>
        {app && (
          <Message success>
            Received {app.applicationId} as {app.source}.{" "}
            <Link href={`/admin/application-details?id=${app.applicationId}`}>
              Review application
            </Link>
          </Message>
        )}
      </section>
      <section className="panel">
        <h2>Direct department channel</h2>
        <p>
          Applications entered by citizens or department officers receive a
          Direct Department Entry source label and share the same review
          process.
        </p>
        <Link className="btn btn-secondary" href="/admin/manual-entry">
          Create manual application
        </Link>
      </section>
    </Shell>
  );
}
function Logs() {
  const { data, error, load } = useData("getLogs");
  return (
    <Shell admin title="Audit logs">
      <Heading title="System audit logs">
        Timestamped events for submission, verification and departmental
        decisions.
      </Heading>
      <button className="btn btn-secondary" onClick={load}>
        Refresh
      </button>
      <Message>{error}</Message>
      {!data ? (
        <p role="status">Loading audit logs…</p>
      ) : !data.length ? (
        <p className="empty">
          No events yet. Create an application to begin the audit trail.
        </p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                {[
                  "Timestamp",
                  "Actor",
                  "Action",
                  "Application ID",
                  "Result / status",
                  "Note",
                ].map((t) => (
                  <th key={t}>{t}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((h) => (
                <tr key={h.id}>
                  <td>{date(h.timestamp)}</td>
                  <td>{h.actor}</td>
                  <td>{h.action}</td>
                  <td>
                    <Link
                      href={`/admin/application-details?id=${h.applicationId}`}
                    >
                      {h.applicationId}
                    </Link>
                  </td>
                  <td>
                    <Badge value={h.status} />
                  </td>
                  <td>{h.note || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Shell>
  );
}
function AdminServices() {
  return (
    <Shell admin title="Service register">
      <Heading title="Education service register">
        Five open demonstration services, administered by this department.
      </Heading>
      <div className="grid">
        {services.map((s) => (
          <ServiceCard key={s.id} service={s} />
        ))}
      </div>
      <section className="panel">
        <h2>Demo institutions</h2>
        <ul>
          {institutions.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
        <p>All institutions and student identities are fictional.</p>
      </section>
    </Shell>
  );
}
function NotFound() {
  return (
    <Shell title="Not found">
      <Heading title="Page or service not found" />
      <Link className="btn btn-primary" href="/services">
        Browse education services
      </Link>
    </Shell>
  );
}
function App() {
  const [location, setLocation] = useState(
    window.location.pathname + window.location.search,
  );
  useEffect(() => {
    const listener = () =>
      setLocation(window.location.pathname + window.location.search);
    window.addEventListener("popstate", listener);
    return () => window.removeEventListener("popstate", listener);
  }, []);
  const routes = {
    "/": <Discovery home />,
    "/services": <Discovery />,
    "/service-details": <Details />,
    "/apply": <Apply />,
    "/track": <Track />,
    "/admin": <Dashboard />,
    "/admin/dashboard": <Dashboard />,
    "/admin/applications": <Register />,
    "/admin/application-details": <AdminDetail />,
    "/admin/manual-entry": <Apply manual />,
    "/admin/interoperability": <Interoperability />,
    "/admin/services": <AdminServices />,
    "/admin/logs": <Logs />,
  };
  return (
    <React.Fragment key={location}>
      {routes[window.location.pathname.replace(/\/$/, "") || "/"] || (
        <NotFound />
      )}
    </React.Fragment>
  );
}
createRoot(document.getElementById("root")).render(<App />);
