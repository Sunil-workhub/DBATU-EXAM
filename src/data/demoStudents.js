// ============================================================================
// DEMO DATA ONLY
// ----------------------------------------------------------------------------
// There is no live PRN → student mapping yet, so for this demo build the
// login accounts and their result records are entered here by hand. Swap
// this file for a real API call (e.g. GET /students/:prn/results) once the
// backend endpoint exists — every component below only reads this shape, so
// nothing else needs to change.
//
// Demo sign-in credentials (shown on the login screen too):
//   PRN: 2130331246058   Password: dbatu@123
//   PRN: 2130331246099   Password: dbatu@123
// ============================================================================

export const DEMO_STUDENTS = [
  {
    prn: "2130331246058",
    password: "dbatu@123",
    name: "Shirke Prajyot Surendra",
    instituteCode: "03033",
    instituteName: "Dr. Babasaheb Ambedkar Technological University, Lonere",
    programme: "Bachelor of Technology (Information Technology)",
    collegeDept: "Engineering and Technology",
    examinationCenter: "-",
    terms: [
      {
        key: "sem8-summer2025",
        termName:
          "Bachelor of Technology (Information Technology) SEMESTER - 8 Summer 2025 ( Regular )",
        examinationHeldIn: "-",
        notificationNoDate: "4890 - Restored Final Copy - 15/05/2026",
        subjects: [
          {
            code: "BTITC801",
            name: "Internet of Things",
            totalScheme: { ca: 20, mid: 20, ese: "20/60", total: "40/100" },
            obtained: { ca: 20, mid: 17, ese: 57, grace: "-", total: 94 },
            credit: 3,
            creditPoint: 10,
            gradePoint: 30,
            grade: "EX",
            absent: false,
          },
          {
            code: "BTITC802",
            name: "Mobile Computing",
            totalScheme: { ca: 20, mid: 20, ese: "20/60", total: "40/100" },
            obtained: { ca: 17, mid: 16, ese: 52, grace: "-", total: 85 },
            credit: 3,
            creditPoint: 8.5,
            gradePoint: 25.5,
            grade: "AB",
            absent: true,
          },
          {
            code: "BTITP803",
            name: "Project Phase II/ Project With Internship",
            totalScheme: { ca: 50, mid: "-", ese: "50/100", total: "60/150" },
            obtained: { ca: 48, mid: "-", ese: 94, grace: "-", total: 142 },
            credit: 24,
            creditPoint: 10,
            gradePoint: 240,
            grade: "EX",
            absent: false,
          },
        ],
        totalMarksObtained: 321,
        totalMarksOutOf: 350,
        finalResult: "First Class With Distinction",
        currentSemester: { credits: 30, gradePoints: 295.5, sgpa: 9.85 },
        cumulative: { credits: 173, gradePoints: 1417, cgpa: 8.19 },
        lastResultProcess: "15/05/2026 12:42 PM",
        lastResultDeclaration: "15/05/2026 12:43 PM",
      },
    ],
  },
  {
    prn: "2130331246099",
    password: "dbatu@123",
    name: "Patil Rohan Vijay",
    instituteCode: "03033",
    instituteName: "Dr. Babasaheb Ambedkar Technological University, Lonere",
    programme: "Bachelor of Technology (Computer Engineering)",
    collegeDept: "Engineering and Technology",
    examinationCenter: "-",
    terms: [
      {
        key: "sem7-winter2024",
        termName:
          "Bachelor of Technology (Computer Engineering) SEMESTER - 7 Winter 2024 ( Regular )",
        examinationHeldIn: "-",
        notificationNoDate: "4512 - Final Copy - 02/01/2025",
        subjects: [
          {
            code: "BTCOC701",
            name: "Cloud Computing",
            totalScheme: { ca: 20, mid: 20, ese: "20/60", total: "40/100" },
            obtained: { ca: 18, mid: 15, ese: 44, grace: "-", total: 77 },
            credit: 3,
            creditPoint: 8,
            gradePoint: 24,
            grade: "A",
            absent: false,
          },
          {
            code: "BTCOC702",
            name: "Machine Learning",
            totalScheme: { ca: 20, mid: 20, ese: "20/60", total: "40/100" },
            obtained: { ca: 19, mid: 17, ese: 49, grace: "-", total: 85 },
            credit: 3,
            creditPoint: 9,
            gradePoint: 27,
            grade: "EX",
            absent: false,
          },
          {
            code: "BTCOL703",
            name: "Machine Learning Lab",
            totalScheme: { ca: "-", mid: "-", ese: "-/50", total: "20/50" },
            obtained: { ca: "-", mid: "-", ese: 18, grace: "-", total: 18 },
            credit: 1,
            creditPoint: 9,
            gradePoint: 9,
            grade: "EX",
            absent: false,
          },
          {
            code: "BTCOE704",
            name: "Elective — Blockchain Technology",
            totalScheme: { ca: 20, mid: 20, ese: "20/60", total: "40/100" },
            obtained: { ca: 15, mid: 12, ese: 33, grace: 2, total: 62 },
            credit: 3,
            creditPoint: 6,
            gradePoint: 18,
            grade: "B",
            absent: false,
          },
        ],
        totalMarksObtained: 242,
        totalMarksOutOf: 300,
        finalResult: "First Class",
        currentSemester: { credits: 10, gradePoints: 78, sgpa: 7.8 },
        cumulative: { credits: 141, gradePoints: 1043, cgpa: 7.4 },
        lastResultProcess: "02/01/2025 10:05 AM",
        lastResultDeclaration: "02/01/2025 10:07 AM",
      },
    ],
  },
];

export function findDemoStudent(prn) {
  return DEMO_STUDENTS.find((s) => s.prn === String(prn).trim()) || null;
}

export function verifyDemoLogin(prn, password) {
  const student = findDemoStudent(prn);
  if (!student || student.password !== password) return null;
  // Never keep the demo password in the session payload.
  const { password: _drop, ...safeStudent } = student;
  return safeStudent;
}
