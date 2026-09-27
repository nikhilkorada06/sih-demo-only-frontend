import React, { useEffect, useRef, useState } from "react";
import "../css/department-exchange.css";

// Fictional local data only. No network request or cross-application storage.
const mockData = {
  highestQualification: "B.Tech",
  institution: "Sahyadri Demo Institute of Technology",
  course: "Computer Science and Engineering",
  academicYear: "2020–2024",
  academicStatus: "Graduated",
};
const fields = [
  ["highestQualification", "Highest qualification"],
  ["institution", "Institution"],
  ["course", "Course"],
  ["academicYear", "Academic year"],
  ["academicStatus", "Academic status"],
];

export function ReceivedInformation({ data }) {
  if (!data) return null;
  return (
    <div className="department-received">
      <h3>Education Information</h3>
      <p className="department-source">
        Source: Education Department · Demo data
      </p>
      <dl className="department-fields">
        {fields.map(([key, label]) => (
          <React.Fragment key={key}>
            <dt>{label}</dt>
            <dd>{data[key]}</dd>
          </React.Fragment>
        ))}
      </dl>
    </div>
  );
}

export default function DepartmentExchange({ data, onReceive, onBusyChange }) {
  const [phase, setPhase] = useState("idle");
  const timers = useRef([]);
  const busy = phase === "connecting" || phase === "fetching";
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const request = () => {
    if (busy) return;
    setPhase("connecting");
    onBusyChange(true);
    timers.current = [
      setTimeout(() => setPhase("fetching"), 850),
      setTimeout(() => {
        onReceive({ ...mockData });
        setPhase("received");
        onBusyChange(false);
      }, 2000),
    ];
  };
  return (
    <section className="department-exchange" aria-label="Education Information">
      <p className="department-kicker">↔ Inter-Department Data Exchange</p>
      <h3>Education Information</h3>
      <p>
        Request academic information for the application review. The received
        qualification fills the application field; the supporting PDF is still
        required.
      </p>
      <p className="department-demo">
        Frontend simulation · Fictional sample record, not matched to the
        applicant.
      </p>
      <div
        className={`department-transfer ${busy ? "is-transferring" : ""}`}
        aria-hidden="true"
      >
        <strong>
          Employment Department
          <small>
            {busy
              ? "Requesting information"
              : data
                ? "Information received"
                : "Requesting department"}
          </small>
        </strong>
        <span className="department-connector">
          {data && !busy ? "✓" : "⇄"}
          <i />
          <i />
          <i />
        </span>
        <strong>
          Education Department<small>academic records · Demo source</small>
        </strong>
      </div>
      <p
        className="department-status"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {phase === "connecting"
          ? "Connecting to Education Department…"
          : phase === "fetching"
            ? "Fetching academic information…"
            : data
              ? "✓ Data received from Education Department"
              : "No information has been fetched."}
      </p>
      {!busy && <ReceivedInformation data={data} />}
      <button
        className="btn btn-secondary"
        type="button"
        disabled={busy}
        onClick={request}
      >
        {busy
          ? "Request in progress…"
          : data
            ? "Refresh Education Data"
            : "Fetch from Education Department"}
      </button>
    </section>
  );
}
