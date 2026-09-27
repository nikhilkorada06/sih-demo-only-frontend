import React, { useEffect, useRef, useState } from "react";
import "../css/department-exchange.css";

// Fictional local data only. No network request or cross-application storage.
const mockData = {
  employmentStatus: "Employed",
  employerName: "Sahyadri Demo Industries",
  employmentType: "Full Time",
  joiningDate: "2024-07-15",
  experience: "2 years",
  district: "Mumbai",
};
const fields = [
  ["employmentStatus", "Employment status"],
  ["employerName", "Employer"],
  ["employmentType", "Employment type"],
  ["joiningDate", "Joining date"],
  ["experience", "Experience"],
  ["district", "Employment district"],
];

export function ReceivedInformation({ data }) {
  if (!data) return null;
  return (
    <div className="department-received">
      <h3>Employment Information</h3>
      <p className="department-source">
        Source: Employment Department · Demo data
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
    <section
      className="department-exchange"
      aria-label="Employment Information"
    >
      <p className="department-kicker">↔ Inter-Department Data Exchange</p>
      <h3>Employment Information</h3>
      <p>
        Optional employment information for the eligibility review. This demo
        record does not change scholarship eligibility rules.
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
          Education Department
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
          Employment Department<small>employment records · Demo source</small>
        </strong>
      </div>
      <p
        className="department-status"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {phase === "connecting"
          ? "Connecting to Employment Department…"
          : phase === "fetching"
            ? "Fetching employment information…"
            : data
              ? "✓ Data received from Employment Department"
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
            ? "Refresh Employment Data"
            : "Fetch from Employment Department"}
      </button>
    </section>
  );
}
