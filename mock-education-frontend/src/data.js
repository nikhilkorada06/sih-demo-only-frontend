export const institutions = [
  "Sahyadri Demo College, Pune",
  "Vidarbha Demo University, Nagpur",
  "Konkan Demo Institute, Ratnagiri",
  "Deccan Demo School, Nashik",
];
export const levels = [
  "Higher Secondary",
  "Diploma",
  "Undergraduate",
  "Postgraduate",
];
export const statuses = [
  "Submitted",
  "Under Review",
  "Document Verification",
  "Academic Verification",
  "Verified",
  "Approved",
  "Rejected",
  "Additional Information Required",
];
export const sources = ["MahaSetu Submission", "Direct Department Entry"];
export const steps = [
  "Student Information",
  "Academic Information",
  "Family / Eligibility",
  "Documents",
  "Review",
  "Submit",
];
export const services = [
  {
    id: "EDU-SVC-001",
    name: "Post-Matric Scholarship",
    category: "Scholarship",
    description:
      "Support for students continuing their education after Class 10.",
    benefit: "Demo annual tuition assistance up to ₹20,000.",
    levels,
    minMarks: 50,
    maxIncome: 250000,
    documents: [
      "Residence proof",
      "Enrollment certificate",
      "Academic record",
      "Income certificate",
    ],
    days: 21,
    featured: true,
  },
  {
    id: "EDU-SVC-002",
    name: "Higher Education Scholarship",
    category: "Scholarship",
    description: "Tuition support for undergraduate and postgraduate students.",
    benefit: "Demo tuition assistance up to ₹35,000 per academic year.",
    levels: ["Undergraduate", "Postgraduate"],
    minMarks: 60,
    maxIncome: 400000,
    documents: [
      "Residence proof",
      "Enrollment certificate",
      "Academic record",
      "Income certificate",
    ],
    days: 30,
    featured: true,
  },
  {
    id: "EDU-SVC-003",
    name: "Student Education Assistance",
    category: "Assistance",
    description:
      "Help with books, learning materials and essential study expenses.",
    benefit: "Demo learning-material allowance up to ₹10,000.",
    levels,
    minMarks: 0,
    maxIncome: 200000,
    documents: [
      "Residence proof",
      "Enrollment certificate",
      "Income certificate",
    ],
    days: 15,
  },
  {
    id: "EDU-SVC-004",
    name: "Education Certificate / Student Verification",
    category: "Verification",
    description:
      "Request a departmental review of enrollment and academic information.",
    benefit:
      "A simulated student verification outcome for your academic record.",
    levels,
    minMarks: 0,
    maxIncome: null,
    documents: ["Residence proof", "Enrollment certificate", "Academic record"],
    days: 10,
  },
  {
    id: "EDU-SVC-005",
    name: "Merit-Based Education Scheme",
    category: "Merit",
    description:
      "Recognition and educational support for high-performing students.",
    benefit: "Demo merit award up to ₹25,000.",
    levels,
    minMarks: 85,
    maxIncome: null,
    documents: ["Residence proof", "Enrollment certificate", "Academic record"],
    days: 21,
    featured: true,
  },
].map((s) => ({
  ...s,
  status: "Open",
  department: "Maharashtra Education Department",
}));
export const students = [
  {
    fullName: "Aditi Demo Patil",
    studentId: "DEMO-STU-001",
    institution: institutions[0],
    course: "B.Sc. Computer Science",
    university: "Sahyadri Demo University",
    academicYear: "2026–27",
    marks: "88",
    district: "Pune",
    level: "Undergraduate",
  },
  {
    fullName: "Rohan Demo Deshmukh",
    studentId: "DEMO-STU-002",
    institution: institutions[1],
    course: "M.Com.",
    university: "Vidarbha Demo University",
    academicYear: "2026–27",
    marks: "72",
    district: "Nagpur",
    level: "Postgraduate",
  },
  {
    fullName: "Sara Demo Shaikh",
    studentId: "DEMO-STU-003",
    institution: institutions[3],
    course: "Class 12 Science",
    university: "Deccan Demo Board",
    academicYear: "2026–27",
    marks: "91",
    district: "Nashik",
    level: "Higher Secondary",
  },
].map((s) => ({
  ...s,
  dateOfBirth: "2005-06-15",
  phone: "9000000000",
  email: "student@example.test",
  address: "12 Demo Road",
  enrollmentYear: "2025",
  previousQualification: "Class 10",
  category: "General",
  income: "150000",
  resident: "Yes",
  enrolled: "Yes",
}));
export function eligibility(service, values) {
  const checks = [
    ["Maharashtra resident", values.resident === "Yes"],
    ["Currently enrolled student", values.enrolled === "Yes"],
    [
      `Course level: ${service.levels.join(", ")}`,
      service.levels.includes(values.level),
    ],
    [
      `Minimum marks: ${service.minMarks}%`,
      values.marks !== "" &&
        values.marks != null &&
        Number(values.marks) >= service.minMarks &&
        Number(values.marks) <= 100,
    ],
    ...(service.maxIncome === null
      ? []
      : [
          [
            `Annual family income up to ₹${service.maxIncome.toLocaleString("en-IN")}`,
            values.income !== "" &&
              values.income != null &&
              Number(values.income) >= 0 &&
              Number(values.income) <= service.maxIncome,
          ],
        ]),
  ];
  return { eligible: checks.every(([, passed]) => passed), checks };
}
