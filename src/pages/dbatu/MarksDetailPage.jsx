import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import {
  Search,
  Award,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Info,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";

const DUMMY_NAMES = {
  123456789: "Student One (Dummy)",
  234567891: "Student Two (Dummy)",
  345678912: "Student Three (Dummy)",
};

const getGradeBadgeStyle = (grade) => {
  if (!grade) return { bg: "#f3f4f6", color: "#374151", border: "#e5e7eb" };
  if (grade.includes("EX") || grade.includes("AA")) {
    return { bg: "#dcfce7", color: "#15803d", border: "#bbf7d0" };
  }
  if (["AB", "BB", "BC", "CD", "DE", "DD"].some((g) => grade.includes(g))) {
    return { bg: "#e0f2fe", color: "#0369a1", border: "#bae6fd" };
  }
  if (grade.includes("FF")) {
    return { bg: "#fee2e2", color: "#b91c1c", border: "#fecaca" };
  }
  return { bg: "#f3f4f6", color: "#374151", border: "#e5e7eb" };
};

const getResultClass = (cgpaVal) => {
  const cgpa = parseFloat(cgpaVal);
  if (isNaN(cgpa) || cgpa === 0) return "-";
  if (cgpa >= 7.75) return "First Class with Distinction";
  if (cgpa >= 6.75) return "First Class";
  if (cgpa >= 6.0) return "Higher Second Class";
  if (cgpa >= 5.0) return "Second Class";
  return "Pass Class";
};

export default function StudentResultPortal() {
  const [studentDatabase, setStudentDatabase] = useState(null);
  const [inputPrn, setInputPrn] = useState("123456789");
  const [studentData, setStudentData] = useState(null);
  const [activeSem, setActiveSem] = useState("Sem 1");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const buildStudentDatabase = (newDataRows, seasonsRows, subjectMap) => {
    const seasonsMap = {};
    const seasonTypeMap = {};
    seasonsRows.forEach((r) => {
      const id = r.srno || r.id;
      if (id) {
        seasonsMap[id] = r.name || `Exam Season ${id}`;
        seasonTypeMap[id] = r.season_type || "Regular";
      }
    });

    const db = {};
    const prnList = [
      ...new Set(newDataRows.map((r) => String(r.prn_no).trim())),
    ];

    prnList.forEach((prn) => {
      if (!prn || prn === "undefined" || prn === "null") return;
      const dfPrn = newDataRows.filter((r) => String(r.prn_no).trim() === prn);
      const prog = dfPrn[0]?.Program || "Bachelor of Technology";
      const sems = [...new Set(dfPrn.map((r) => r.sem))].sort((a, b) => a - b);

      const semData = {};
      const passedSubjectsMap = {};
      const activeBacklogs = new Set();

      sems.forEach((sem) => {
        const dfSem = dfPrn.filter((r) => r.sem === sem);
        const seasonIds = [...new Set(dfSem.map((r) => r.exam_season_id))];

        const attempts = [];
        seasonIds.forEach((sid) => {
          const dfAttempt = dfSem.filter((r) => r.exam_season_id === sid);
          const examName = seasonsMap[sid] || `Exam Season ${sid}`;
          const stype = seasonTypeMap[sid] || "Regular";

          const subjects = [];
          let currCreditsVal = 0.0;
          let currGpXCreditsVal = 0.0;
          let totalObtMarks = 0;
          let totalMaxMarks = 0;
          let currentAttemptHasFail = false;

          dfAttempt.forEach((r) => {
            const subCode = String(r.Subject || "").trim();
            const subName = subjectMap[subCode] || subCode;

            const credits = parseFloat(r.CreditsforResult) || 0.0;
            const gp = parseFloat(r.GradePoints) || 0.0;
            const grace =
              r.GraceMarks && parseFloat(r.GraceMarks) > 0
                ? String(Math.round(r.GraceMarks))
                : "-";

            const obtTotal = parseInt(r.TotalMarks) || 0;
            const grade = String(r.Grade || "-");
            const res = String(r.Result || "Pass");

            const isSubjectFail =
              res.toUpperCase() === "FAIL" || grade.toUpperCase() === "FF";

            if (isSubjectFail) {
              currentAttemptHasFail = true;
              activeBacklogs.add(subCode);
            } else {
              activeBacklogs.delete(subCode);
              passedSubjectsMap[subCode] = {
                credits: credits,
                gp: gp,
                creditPoints: credits * gp,
              };
            }

            const ca =
              r.ContinuousAssessment1Marks !== undefined &&
              r.ContinuousAssessment1Marks !== null &&
              r.ContinuousAssessment1Marks >= 0
                ? String(Math.round(r.ContinuousAssessment1Marks))
                : "-";
            const mid =
              r.MidExamMarks !== undefined &&
              r.MidExamMarks !== null &&
              r.MidExamMarks >= 0
                ? String(Math.round(r.MidExamMarks))
                : "-";
            const ese =
              r.EndExamMarks !== undefined &&
              r.EndExamMarks !== null &&
              r.EndExamMarks >= 0
                ? String(Math.round(r.EndExamMarks))
                : "-";

            const maxCA = ca !== "-" ? 20 : 0;
            const maxMID = mid !== "-" ? 20 : 0;
            const maxESE = ese !== "-" ? 60 : 0;
            const maxTotal =
              maxCA + maxMID + maxESE > 0 ? maxCA + maxMID + maxESE : 100;

            if (!isSubjectFail) {
              currCreditsVal += credits;
              currGpXCreditsVal += credits * gp;
            }

            totalObtMarks += obtTotal;
            totalMaxMarks += maxTotal;

            subjects.push({
              code: subCode,
              name: subName,
              totCA: maxCA > 0 ? String(maxCA) : "-",
              totMID: maxMID > 0 ? String(maxMID) : "-",
              totESE: maxESE > 0 ? String(maxESE) : "-",
              totOverall: String(maxTotal),
              obtCA: ca,
              obtMID: mid,
              obtESE: ese,
              grace: grace,
              obtTotal: String(obtTotal),
              credit: isSubjectFail ? "-" : credits.toFixed(1),
              gradePoint: isSubjectFail ? "-" : gp.toFixed(1),
              creditPoint: isSubjectFail ? "-" : (gp * credits).toFixed(1),
              grade: grade,
            });
          });

          // Semester performance values (Set to "-" if current attempt has fail)
          const currCreditsDisp = currentAttemptHasFail
            ? "-"
            : currCreditsVal.toFixed(1);
          const currGradePointsDisp = currentAttemptHasFail
            ? "-"
            : currGpXCreditsVal.toFixed(1);
          const sgpaDisp = currentAttemptHasFail
            ? "-"
            : currCreditsVal > 0
              ? (currGpXCreditsVal / currCreditsVal).toFixed(2)
              : "0.00";

          // Cumulative performance values (Set to "-" if any backlogs exist)
          let cumCreditsDisp = "-";
          let cumGradePointsDisp = "-";
          let cgpaDisp = "-";

          if (activeBacklogs.size === 0) {
            let cumTotalCreditsVal = 0.0;
            let cumTotalGpXCreditsVal = 0.0;
            Object.values(passedSubjectsMap).forEach((item) => {
              cumTotalCreditsVal += item.credits;
              cumTotalGpXCreditsVal += item.creditPoints;
            });
            cumCreditsDisp = cumTotalCreditsVal.toFixed(1);
            cumGradePointsDisp = cumTotalGpXCreditsVal.toFixed(1);
            cgpaDisp =
              cumTotalCreditsVal > 0
                ? (cumTotalGpXCreditsVal / cumTotalCreditsVal).toFixed(2)
                : "0.00";
          }

          const finalRes = currentAttemptHasFail
            ? "FAIL"
            : subjects.some((s) => s.grace !== "-")
              ? "Pass With Grace"
              : "Pass";

          let resultClass = null;
          if (sem === 8 || sem === "8") {
            resultClass =
              finalRes !== "FAIL" && cgpaDisp !== "-"
                ? getResultClass(cgpaDisp)
                : "-";
          }

          attempts.push({
            examSeasonId: sid,
            examName: examName,
            seasonType: stype,
            status: currentAttemptHasFail ? "Fail" : "Pass",
            subjects: subjects,
            summary: {
              totalMarks: `${totalObtMarks} / ${totalMaxMarks}`,
              finalResult: finalRes,
              currCredits: currCreditsDisp,
              currGradePoints: currGradePointsDisp,
              sgpa: sgpaDisp,
              cumCredits: cumCreditsDisp,
              cumGradePoints: cumGradePointsDisp,
              cgpa: cgpaDisp,
              resultClass: resultClass,
            },
          });
        });

        semData[`Sem ${sem}`] = attempts;
      });

      db[prn] = {
        prn: prn,
        studentName: DUMMY_NAMES[prn] || `Student ${prn} (Dummy)`,
        programme: prog,
        collegeDepartment: "Department of Engineering",
        semesters: semData,
      };
    });

    return db;
  };

  useEffect(() => {
    async function loadPublicExcelFiles() {
      try {
        setLoading(true);
        setError("");

        const filePaths = [
          encodeURI("/data/Newdata.xlsx"),
          encodeURI("/data/exam_seasons.csv"),
          encodeURI("/data/civil.xlsx"),
          encodeURI("/data/comp.xlsx"),
          encodeURI("/data/it.xlsx"),
        ];

        const [newDataRes, seasonsRes, civilRes, compRes, itRes] =
          await Promise.all(
            filePaths.map((path, idx) =>
              fetch(path).then((res) => {
                if (!res.ok) {
                  throw new Error(
                    `Failed to load ${path} (Status: ${res.status})`,
                  );
                }
                return idx === 1 ? res.text() : res.arrayBuffer();
              }),
            ),
          );

        const wbNew = XLSX.read(newDataRes, { type: "array" });
        const newDataRows = XLSX.utils.sheet_to_json(
          wbNew.Sheets[wbNew.SheetNames[0]],
        );

        if (!newDataRows.length) {
          throw new Error(
            "Newdata.xlsx loaded but contained no rows. Check that the first sheet has data.",
          );
        }

        const seasonsParsed = Papa.parse(seasonsRes, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: true,
        });
        const seasonsRows = seasonsParsed.data;

        const subjectMap = {};
        [civilRes, compRes, itRes].forEach((buf) => {
          const wb = XLSX.read(buf, { type: "array" });
          wb.SheetNames.forEach((sheet) => {
            const rows = XLSX.utils.sheet_to_json(wb.Sheets[sheet]);
            rows.forEach((r) => {
              if (r.subject_code && r.subject_name) {
                const code = String(r.subject_code).trim();
                const name = String(r.subject_name).trim();
                if (code && code !== "nan") subjectMap[code] = name;
              }
            });
          });
        });

        const db = buildStudentDatabase(newDataRows, seasonsRows, subjectMap);

        if (Object.keys(db).length === 0) {
          throw new Error(
            "Excel files loaded successfully, but no valid PRN records could be built from Newdata.xlsx. Check that the 'prn_no' column is populated.",
          );
        }

        setStudentDatabase(db);
        if (db["123456789"]) {
          setStudentData(db["123456789"]);
          setActiveSem(Object.keys(db["123456789"].semesters)[0] || "Sem 1");
        } else {
          const firstPrn = Object.keys(db)[0];
          setStudentData(db[firstPrn]);
          setActiveSem(Object.keys(db[firstPrn].semesters)[0] || "Sem 1");
          setInputPrn(firstPrn);
        }
      } catch (err) {
        console.error("Error loading public files:", err);
        setError(`Failed to load data from public Excel files: ${err.message}`);
        setStudentDatabase(null);
      } finally {
        setLoading(false);
      }
    }

    loadPublicExcelFiles();
  }, []);

  const handleSearch = () => {
    setError("");
    const query = inputPrn.trim();
    if (!studentDatabase) {
      setError(
        "Student data hasn't finished loading yet, or failed to load. Please wait or refresh the page.",
      );
      return;
    }
    if (studentDatabase[query]) {
      setStudentData(studentDatabase[query]);
      const availableSems = Object.keys(studentDatabase[query].semesters);
      setActiveSem(availableSems[0] || "Sem 1");
    } else {
      setError(`No examination records found for PRN: ${query}`);
      setStudentData(null);
    }
  };

  const handleSelectSamplePRN = (samplePrn) => {
    setInputPrn(samplePrn);
    if (studentDatabase && studentDatabase[samplePrn]) {
      setStudentData(studentDatabase[samplePrn]);
      const availableSems = Object.keys(studentDatabase[samplePrn].semesters);
      setActiveSem(availableSems[0] || "Sem 1");
    }
    setError("");
  };

  const currentSemAttempts = studentData?.semesters[activeSem] || [];

  return (
    <div
      style={{
        maxWidth: "1240px",
        margin: "0 auto",
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        color: "#1e293b",
        padding: "16px",
      }}
    >
      {/* Sample PRN Quick Selector */}
      {studentDatabase && (
        <div
          style={{
            background: "#ffffff",
            borderRadius: "12px",
            padding: "12px 18px",
            border: "1px solid #e2e8f0",
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            overflowX: "auto",
          }}
        >
          <span
            style={{
              fontSize: "12px",
              fontWeight: 700,
              color: "#64748b",
              whiteSpace: "nowrap",
            }}
          >
            Available PRNs in Excel:
          </span>
          {Object.keys(studentDatabase).map((p) => (
            <button
              key={p}
              onClick={() => handleSelectSamplePRN(p)}
              style={{
                padding: "5px 12px",
                borderRadius: "6px",
                border:
                  inputPrn === p ? "1px solid #002147" : "1px solid #cbd5e1",
                backgroundColor: inputPrn === p ? "#002147" : "#f8fafc",
                color: inputPrn === p ? "#ffffff" : "#334155",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {p} ({studentDatabase[p].studentName})
            </button>
          ))}
        </div>
      )}

      {/* Main Search Bar Box */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: "16px",
          padding: "20px 24px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03)",
          border: "1px solid #f1f5f9",
          marginBottom: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: "18px",
              fontWeight: 700,
              color: "#0f172a",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <GraduationCap size={22} color="#002147" /> Student Statement of
            Marks
          </h2>
          <p
            style={{ margin: "2px 0 0", fontSize: "12.5px", color: "#64748b" }}
          >
            {loading
              ? "Loading excel files from public folder..."
              : "Data live-fetched from Excel files in public folder"}
          </p>
        </div>

        <div
          style={{ display: "flex", gap: "10px", width: "min(420px, 100%)" }}
        >
          <div style={{ position: "relative", flex: 1 }}>
            <input
              type="text"
              value={inputPrn}
              onChange={(e) => setInputPrn(e.target.value)}
              placeholder="Enter Student PRN..."
              style={{
                width: "100%",
                padding: "10px 14px 10px 38px",
                border: "1.5px solid #cbd5e1",
                borderRadius: "10px",
                fontSize: "13.5px",
                outline: "none",
                fontWeight: 600,
                color: "#0f172a",
                boxSizing: "border-box",
              }}
            />
            <Search
              size={16}
              color="#94a3b8"
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
              }}
            />
          </div>
          <button
            onClick={handleSearch}
            style={{
              padding: "10px 20px",
              backgroundColor: "#002147",
              color: "#ffffff",
              border: "none",
              borderRadius: "10px",
              fontWeight: "600",
              fontSize: "13.5px",
              cursor: "pointer",
            }}
          >
            Search
          </button>
        </div>
      </div>

      {error && (
        <div
          style={{
            padding: "14px 18px",
            backgroundColor: "#fef2f2",
            color: "#b91c1c",
            borderRadius: "12px",
            fontSize: "13.5px",
            border: "1px solid #fecaca",
            marginBottom: "24px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <Info size={18} /> {error}
        </div>
      )}

      {studentData && (
        <div
          style={{
            background: "#ffffff",
            borderRadius: "16px",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.04)",
            border: "1px solid #e2e8f0",
            overflow: "hidden",
          }}
        >
          {/* Header Banner */}
          <div
            style={{
              background: "linear-gradient(135deg, #002147 0%, #0d3b66 100%)",
              padding: "28px",
              color: "#ffffff",
              borderBottom: "4px solid #f59e0b",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <h1
                style={{
                  margin: 0,
                  fontSize: "22px",
                  fontWeight: "800",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                }}
              >
                Dr. Babasaheb Ambedkar Technological University
              </h1>
              <p
                style={{
                  margin: "4px 0 0",
                  fontSize: "13px",
                  color: "#93c5fd",
                  fontWeight: "500",
                }}
              >
                Lonere, Raigad, Maharashtra
              </p>
            </div>

            {/* Student Profile Quick Data */}
            <div
              style={{
                marginTop: "24px",
                paddingTop: "20px",
                borderTop: "1px solid rgba(255, 255, 255, 0.12)",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "16px",
              }}
            >
              <div style={profileBoxStyle}>
                <span style={profileLabelStyle}>STUDENT NAME</span>
                <span style={profileValueStyle}>{studentData.studentName}</span>
              </div>
              <div style={profileBoxStyle}>
                <span style={profileLabelStyle}>PRN NUMBER</span>
                <span style={{ ...profileValueStyle, letterSpacing: "1px" }}>
                  {studentData.prn}
                </span>
              </div>
              <div style={profileBoxStyle}>
                <span style={profileLabelStyle}>PROGRAMME</span>
                <span style={profileValueStyle}>{studentData.programme}</span>
              </div>
              <div style={profileBoxStyle}>
                <span style={profileLabelStyle}>DEPARTMENT</span>
                <span style={profileValueStyle}>
                  {studentData.collegeDepartment}
                </span>
              </div>
            </div>
          </div>

          {/* Semester Tabs */}
          <div
            style={{
              backgroundColor: "#f8fafc",
              padding: "14px 24px 0",
              borderBottom: "1px solid #e2e8f0",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                fontWeight: "700",
                color: "#64748b",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
                marginBottom: "8px",
              }}
            >
              ACADEMIC SEMESTERS:
            </div>
            <div style={{ display: "flex", gap: "8px", overflowX: "auto" }}>
              {Object.keys(studentData.semesters).map((semKey) => {
                const isActive = semKey === activeSem;
                const attemptsCount = studentData.semesters[semKey].length;
                return (
                  <button
                    key={semKey}
                    onClick={() => setActiveSem(semKey)}
                    style={{
                      padding: "10px 18px",
                      fontSize: "13px",
                      fontWeight: isActive ? "700" : "600",
                      color: isActive ? "#002147" : "#475569",
                      backgroundColor: isActive ? "#ffffff" : "#f1f5f9",
                      border: isActive
                        ? "1px solid #cbd5e1"
                        : "1px solid #e2e8f0",
                      borderBottom: isActive ? "3px solid #002147" : "none",
                      borderTopLeftRadius: "8px",
                      borderTopRightRadius: "8px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <BookOpen
                      size={14}
                      color={isActive ? "#002147" : "#94a3b8"}
                    />
                    <span>{semKey}</span>
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: "800",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        backgroundColor: "#e2e8f0",
                        color: "#334155",
                      }}
                    >
                      {attemptsCount} {attemptsCount > 1 ? "Exams" : "Exam"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Scrollable Semester Attempts View */}
          <div
            style={{ padding: "24px", maxHeight: "750px", overflowY: "auto" }}
          >
            {currentSemAttempts.map((attempt, idx) => (
              <div
                key={idx}
                style={{
                  marginBottom: "28px",
                  border: "1px solid #cbd5e1",
                  borderRadius: "12px",
                  padding: "20px",
                  backgroundColor: "#ffffff",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
                }}
              >
                {/* Term Name Header */}
                <div
                  style={{
                    backgroundColor: "#f1f5f9",
                    borderRadius: "10px",
                    padding: "14px 18px",
                    marginBottom: "16px",
                    border: "1px solid #e2e8f0",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "10px",
                  }}
                >
                  <div>
                    <span style={metaLabelStyle}>EXAM / TERM NAME</span>
                    <p style={metaValueStyle}>{attempt.examName}</p>
                  </div>
                  <div>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: "800",
                        padding: "4px 10px",
                        borderRadius: "6px",
                        backgroundColor: attempt.seasonType.includes("Regular")
                          ? "#dcfce7"
                          : "#fef3c7",
                        color: attempt.seasonType.includes("Regular")
                          ? "#15803d"
                          : "#b45309",
                      }}
                    >
                      {attempt.seasonType}
                    </span>
                  </div>
                </div>

                {/* Subject Marks Table */}
                <div
                  style={{
                    border: "1px solid #e2e8f0",
                    borderRadius: "10px",
                    overflow: "hidden",
                  }}
                >
                  <div style={{ overflowX: "auto" }}>
                    <table
                      style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        fontSize: "12.5px",
                        textAlign: "center",
                      }}
                    >
                      <thead>
                        <tr
                          style={{
                            backgroundColor: "#f8fafc",
                            color: "#475569",
                            borderBottom: "1px solid #cbd5e1",
                          }}
                        >
                          <th
                            rowSpan={2}
                            style={{
                              ...thStyle,
                              textAlign: "left",
                              width: "110px",
                            }}
                          >
                            Code
                          </th>
                          <th
                            rowSpan={2}
                            style={{ ...thStyle, textAlign: "left" }}
                          >
                            Subject Name
                          </th>
                          <th colSpan={4} style={thStyle}>
                            Total Marks
                          </th>
                          <th colSpan={5} style={thStyle}>
                            Marks Obtained
                          </th>
                          <th rowSpan={2} style={thStyle}>
                            Credit
                          </th>
                          <th rowSpan={2} style={thStyle}>
                            Grade Pt
                          </th>
                          <th rowSpan={2} style={thStyle}>
                            Credit Pt
                          </th>
                          <th rowSpan={2} style={thStyle}>
                            Grade
                          </th>
                        </tr>
                        <tr
                          style={{
                            backgroundColor: "#f1f5f9",
                            color: "#64748b",
                            borderBottom: "1.5px solid #cbd5e1",
                          }}
                        >
                          <th style={subThStyle}>CA</th>
                          <th style={subThStyle}>MID</th>
                          <th style={subThStyle}>ESE</th>
                          <th style={subThStyle}>Total</th>
                          <th style={subThStyle}>CA</th>
                          <th style={subThStyle}>MID</th>
                          <th style={subThStyle}>ESE</th>
                          <th style={subThStyle}>Grace</th>
                          <th style={subThStyle}>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {attempt.subjects.map((sub, i) => {
                          const badge = getGradeBadgeStyle(sub.grade);
                          return (
                            <tr
                              key={i}
                              style={{
                                borderBottom: "1px solid #f1f5f9",
                                backgroundColor:
                                  i % 2 === 0 ? "#ffffff" : "#f8fafc",
                              }}
                            >
                              <td
                                style={{
                                  ...tdStyle,
                                  textAlign: "left",
                                  fontWeight: "700",
                                  color: "#0f172a",
                                }}
                              >
                                {sub.code}
                              </td>
                              <td
                                style={{
                                  ...tdStyle,
                                  textAlign: "left",
                                  fontWeight: "600",
                                  color: "#334155",
                                }}
                              >
                                {sub.name}
                              </td>
                              <td style={tdMutedStyle}>{sub.totCA}</td>
                              <td style={tdMutedStyle}>{sub.totMID}</td>
                              <td style={tdMutedStyle}>{sub.totESE}</td>
                              <td
                                style={{
                                  ...tdMutedStyle,
                                  fontWeight: "700",
                                  color: "#475569",
                                }}
                              >
                                {sub.totOverall}
                              </td>
                              <td style={tdStyle}>{sub.obtCA}</td>
                              <td style={tdStyle}>{sub.obtMID}</td>
                              <td style={tdStyle}>{sub.obtESE}</td>
                              <td
                                style={{
                                  ...tdStyle,
                                  color:
                                    sub.grace !== "-" ? "#b45309" : "#64748b",
                                  fontWeight:
                                    sub.grace !== "-" ? "800" : "normal",
                                }}
                              >
                                {sub.grace}
                              </td>
                              <td
                                style={{
                                  ...tdStyle,
                                  fontWeight: "700",
                                  color: "#0f172a",
                                }}
                              >
                                {sub.obtTotal}
                              </td>
                              <td style={tdStyle}>{sub.credit}</td>
                              <td style={tdStyle}>{sub.gradePoint}</td>
                              <td style={tdStyle}>{sub.creditPoint}</td>
                              <td style={tdStyle}>
                                <span
                                  style={{
                                    display: "inline-block",
                                    padding: "3px 8px",
                                    borderRadius: "6px",
                                    fontSize: "11px",
                                    fontWeight: "800",
                                    backgroundColor: badge.bg,
                                    color: badge.color,
                                    border: `1px solid ${badge.border}`,
                                  }}
                                >
                                  {sub.grade}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Summary Footer */}
                  <div
                    style={{
                      backgroundColor: "#f8fafc",
                      padding: "14px 18px",
                      borderTop: "1.5px solid #e2e8f0",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "12px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <Award size={18} color="#002147" />
                      <span
                        style={{
                          fontSize: "12.5px",
                          fontWeight: "700",
                          color: "#334155",
                        }}
                      >
                        TOTAL MARKS:
                      </span>
                      <span
                        style={{
                          fontSize: "13.5px",
                          fontWeight: "800",
                          color: "#002147",
                          backgroundColor: "#e0f2fe",
                          padding: "3px 10px",
                          borderRadius: "6px",
                        }}
                      >
                        {attempt.summary.totalMarks}
                      </span>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      {attempt.summary.finalResult.includes("FAIL") ? (
                        <AlertTriangle size={16} color="#dc2626" />
                      ) : (
                        <CheckCircle2 size={16} color="#16a34a" />
                      )}
                      <span
                        style={{
                          fontSize: "12.5px",
                          fontWeight: "700",
                          color: "#334155",
                        }}
                      >
                        RESULT:
                      </span>
                      <span
                        style={{
                          fontSize: "12.5px",
                          fontWeight: "800",
                          color: attempt.summary.finalResult.includes("FAIL")
                            ? "#dc2626"
                            : "#16a34a",
                          backgroundColor: attempt.summary.finalResult.includes(
                            "FAIL",
                          )
                            ? "#fee2e2"
                            : "#dcfce7",
                          padding: "3px 10px",
                          borderRadius: "6px",
                        }}
                      >
                        {attempt.summary.finalResult}
                      </span>
                    </div>
                  </div>
                </div>

                {/* SGPA & CGPA Cards */}
                <div
                  style={{
                    marginTop: "16px",
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                    gap: "14px",
                  }}
                >
                  <div style={metricCardStyle}>
                    <div style={metricCardHeaderStyle}>
                      <TrendingUp size={16} color="#002147" />
                      <span
                        style={{
                          fontSize: "12.5px",
                          fontWeight: "700",
                          color: "#002147",
                        }}
                      >
                        SEMESTER PERFORMANCE
                      </span>
                    </div>
                    <div style={metricGridStyle}>
                      <div style={metricItemStyle}>
                        <span style={metricLabelStyle}>CREDITS</span>
                        <span style={metricValueStyle}>
                          {attempt.summary.currCredits}
                        </span>
                      </div>
                      <div style={metricItemStyle}>
                        <span style={metricLabelStyle}>GRADE POINTS</span>
                        <span style={metricValueStyle}>
                          {attempt.summary.currGradePoints}
                        </span>
                      </div>
                      <div
                        style={{
                          ...metricItemStyle,
                          backgroundColor:
                            attempt.summary.sgpa === "-"
                              ? "#fef2f2"
                              : "#eff6ff",
                        }}
                      >
                        <span
                          style={{
                            ...metricLabelStyle,
                            color:
                              attempt.summary.sgpa === "-"
                                ? "#b91c1c"
                                : "#1d4ed8",
                          }}
                        >
                          SGPA
                        </span>
                        <span
                          style={{
                            ...metricValueStyle,
                            color:
                              attempt.summary.sgpa === "-"
                                ? "#b91c1c"
                                : "#1d4ed8",
                            fontSize: "16px",
                          }}
                        >
                          {attempt.summary.sgpa}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={metricCardStyle}>
                    <div style={metricCardHeaderStyle}>
                      <Award size={16} color="#0f766e" />
                      <span
                        style={{
                          fontSize: "12.5px",
                          fontWeight: "700",
                          color: "#0f766e",
                        }}
                      >
                        CUMULATIVE PERFORMANCE
                      </span>
                    </div>
                    <div style={metricGridStyle}>
                      <div style={metricItemStyle}>
                        <span style={metricLabelStyle}>CUM. CREDITS</span>
                        <span style={metricValueStyle}>
                          {attempt.summary.cumCredits}
                        </span>
                      </div>
                      <div style={metricItemStyle}>
                        <span style={metricLabelStyle}>CUM. GRADE POINTS</span>
                        <span style={metricValueStyle}>
                          {attempt.summary.cumGradePoints}
                        </span>
                      </div>
                      <div
                        style={{
                          ...metricItemStyle,
                          backgroundColor:
                            attempt.summary.cgpa === "-"
                              ? "#fef2f2"
                              : "#f0fdf4",
                        }}
                      >
                        <span
                          style={{
                            ...metricLabelStyle,
                            color:
                              attempt.summary.cgpa === "-"
                                ? "#b91c1c"
                                : "#15803d",
                          }}
                        >
                          CGPA
                        </span>
                        <span
                          style={{
                            ...metricValueStyle,
                            color:
                              attempt.summary.cgpa === "-"
                                ? "#b91c1c"
                                : "#15803d",
                            fontSize: "16px",
                          }}
                        >
                          {attempt.summary.cgpa}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Final Degree Class Card */}
                {attempt.summary.resultClass && (
                  <div
                    style={{
                      marginTop: "14px",
                      backgroundColor: "#f0fdf4",
                      border: "1px solid #bbf7d0",
                      borderRadius: "10px",
                      padding: "12px 18px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <GraduationCap size={20} color="#15803d" />
                      <span
                        style={{
                          fontSize: "13px",
                          fontWeight: "700",
                          color: "#166534",
                        }}
                      >
                        FINAL PROGRAMME CLASS / DIVISION:
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: "800",
                        color: "#15803d",
                        backgroundColor: "#ffffff",
                        padding: "4px 12px",
                        borderRadius: "6px",
                        border: "1px solid #86efac",
                      }}
                    >
                      {attempt.summary.resultClass}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Legal Disclaimer */}
          <div
            style={{
              padding: "14px 20px",
              backgroundColor: "#fff1f2",
              borderTop: "1px solid #ffe4e6",
              display: "flex",
              gap: "10px",
              alignItems: "center",
            }}
          >
            <Info size={16} color="#e11d48" style={{ flexShrink: 0 }} />
            <p
              style={{
                margin: 0,
                fontSize: "11.5px",
                color: "#9f1239",
                fontWeight: "500",
              }}
            >
              The results published online are for immediate information only.
              Original statement of marks is issued by the University
              separately.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

const profileBoxStyle = {
  backgroundColor: "rgba(255, 255, 255, 0.08)",
  borderRadius: "10px",
  padding: "10px 14px",
  backdropFilter: "blur(4px)",
  border: "1px solid rgba(255, 255, 255, 0.12)",
};
const profileLabelStyle = {
  display: "block",
  fontSize: "10px",
  fontWeight: "700",
  color: "#93c5fd",
  marginBottom: "2px",
};
const profileValueStyle = {
  fontSize: "13px",
  fontWeight: "700",
  color: "#ffffff",
};
const metaLabelStyle = {
  fontSize: "10.5px",
  fontWeight: "700",
  color: "#64748b",
  display: "block",
  marginBottom: "2px",
};
const metaValueStyle = {
  margin: 0,
  fontSize: "13px",
  fontWeight: "700",
  color: "#0f172a",
};
const thStyle = {
  padding: "10px 12px",
  fontWeight: "700",
  fontSize: "11.5px",
  textTransform: "uppercase",
  borderRight: "1px solid #cbd5e1",
};
const subThStyle = {
  padding: "8px 6px",
  fontWeight: "700",
  fontSize: "11px",
  borderRight: "1px solid #cbd5e1",
};
const tdStyle = {
  padding: "10px 8px",
  borderRight: "1px solid #e2e8f0",
  fontSize: "12.5px",
};
const tdMutedStyle = { ...tdStyle, color: "#64748b" };
const metricCardStyle = {
  backgroundColor: "#ffffff",
  borderRadius: "10px",
  border: "1px solid #e2e8f0",
  padding: "14px",
};
const metricCardHeaderStyle = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  marginBottom: "10px",
  paddingBottom: "6px",
  borderBottom: "1px solid #f1f5f9",
};
const metricGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "8px",
  textAlign: "center",
};
const metricItemStyle = {
  padding: "8px 4px",
  backgroundColor: "#f8fafc",
  borderRadius: "6px",
};
const metricLabelStyle = {
  display: "block",
  fontSize: "9.5px",
  fontWeight: "700",
  color: "#64748b",
  marginBottom: "2px",
};
const metricValueStyle = {
  fontSize: "14px",
  fontWeight: "800",
  color: "#0f172a",
};
