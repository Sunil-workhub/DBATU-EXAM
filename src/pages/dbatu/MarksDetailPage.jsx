import React, { useState, useEffect } from "react";
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

import BgImage from "../../assets/images/dbatuicon.jpeg";

function LogoLoader({ text = "Loading student examination records..." }) {
  return (
    <div style={loaderContainerStyle}>
      <style>{`
        @keyframes customPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
            box-shadow: 0 0 0 0 rgba(0, 33, 71, 0.4);
          }
          50% {
            transform: scale(1.08);
            opacity: 0.85;
            box-shadow: 0 0 0 15px rgba(0, 33, 71, 0);
          }
        }
        @keyframes customRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      <div style={loaderWrapperStyle}>
        <div style={loaderRingStyle} />
        <div style={loaderLogoWrapperStyle}>
          <img src={BgImage} alt="DBATU Logo Loader" style={loaderImageStyle} />
        </div>
      </div>
      {text && <p style={loaderTextStyle}>{text}</p>}
    </div>
  );
}

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

export default function StudentResultPortal() {
  const [studentDatabase, setStudentDatabase] = useState(null);
  const [inputPrn, setInputPrn] = useState("123456789");
  const [studentData, setStudentData] = useState(null);
  const [activeSem, setActiveSem] = useState("Sem 1");
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadJsonDatabase() {
      try {
        setLoading(true);
        setError("");

        const res = await fetch("/data/student_db.json");
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const db = await res.json();
        if (!db || Object.keys(db).length === 0) {
          throw new Error("JSON Database is empty or invalid.");
        }

        setStudentDatabase(db);

        // Set default active PRN
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
        console.error("Failed to load JSON DB:", err);
        setError(`Failed to load student records: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }

    loadJsonDatabase();
  }, []);

  const handleSearch = () => {
    setError("");
    const query = inputPrn.trim();
    if (!studentDatabase) {
      setError("Database is not loaded yet.");
      return;
    }

    setSearching(true);

    setTimeout(() => {
      if (studentDatabase[query]) {
        setStudentData(studentDatabase[query]);
        const availableSems = Object.keys(studentDatabase[query].semesters);
        setActiveSem(availableSems[0] || "Sem 1");
      } else {
        setError(`No examination records found for PRN: ${query}`);
        setStudentData(null);
      }
      setSearching(false);
    }, 400);
  };

  const currentSemAttempts = studentData?.semesters[activeSem] || [];

  if (loading) {
    return (
      <div style={{ padding: "60px 0" }}>
        <LogoLoader text="Loading Academic Examination Database..." />
      </div>
    );
  }

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
      {/* Search Header */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: "14px",
          padding: "16px 20px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03)",
          border: "1px solid #f1f5f9",
          marginBottom: "20px",
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
              fontSize: "16px",
              fontWeight: 700,
              color: "#0f172a",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <GraduationCap size={20} color="#002147" /> Student Statement of
            Marks
          </h2>
        </div>

        <div
          style={{ display: "flex", gap: "10px", width: "min(400px, 100%)" }}
        >
          <div style={{ position: "relative", flex: 1 }}>
            <input
              type="text"
              value={inputPrn}
              onChange={(e) => setInputPrn(e.target.value)}
              placeholder="Enter Student PRN..."
              style={{
                width: "100%",
                padding: "8px 12px 8px 36px",
                border: "1.5px solid #cbd5e1",
                borderRadius: "8px",
                fontSize: "12.5px",
                outline: "none",
                fontWeight: 600,
                color: "#0f172a",
                boxSizing: "border-box",
              }}
            />
            <Search
              size={15}
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
            disabled={searching}
            style={{
              padding: "8px 18px",
              backgroundColor: "#002147",
              color: "#ffffff",
              border: "none",
              borderRadius: "8px",
              fontWeight: "600",
              fontSize: "12.5px",
              cursor: searching ? "not-allowed" : "pointer",
              opacity: searching ? 0.8 : 1,
            }}
          >
            {searching ? "Searching..." : "Search"}
          </button>
        </div>
      </div>

      {searching ? (
        <div style={{ padding: "40px 0" }}>
          <LogoLoader
            text={`Fetching examination record for PRN ${inputPrn}...`}
          />
        </div>
      ) : (
        <>
          {error && (
            <div
              style={{
                padding: "12px 16px",
                backgroundColor: "#fef2f2",
                color: "#b91c1c",
                borderRadius: "10px",
                fontSize: "12.5px",
                border: "1px solid #fecaca",
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Info size={16} /> {error}
            </div>
          )}

          {studentData && (
            <div
              style={{
                background: "#ffffff",
                borderRadius: "14px",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.04)",
                border: "1px solid #e2e8f0",
                overflow: "hidden",
              }}
            >
              {/* University Header */}
              <div
                style={{
                  background:
                    "linear-gradient(135deg, #002147 0%, #0d3b66 100%)",
                  padding: "22px 24px",
                  color: "#ffffff",
                  borderBottom: "3px solid #f59e0b",
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <h1
                    style={{
                      margin: 0,
                      fontSize: "18px",
                      fontWeight: "800",
                      letterSpacing: "0.5px",
                      textTransform: "uppercase",
                    }}
                  >
                    Dr. Babasaheb Ambedkar Technological University
                  </h1>
                  <p
                    style={{
                      margin: "2px 0 0",
                      fontSize: "12px",
                      color: "#93c5fd",
                      fontWeight: "500",
                    }}
                  >
                    Lonere, Raigad, Maharashtra
                  </p>
                </div>

                {/* Profile Box */}
                <div
                  style={{
                    marginTop: "18px",
                    paddingTop: "16px",
                    borderTop: "1px solid rgba(255, 255, 255, 0.12)",
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "12px",
                  }}
                >
                  <div style={profileBoxStyle}>
                    <span style={profileLabelStyle}>STUDENT NAME</span>
                    <span style={profileValueStyle}>
                      {studentData.studentName}
                    </span>
                  </div>
                  <div style={profileBoxStyle}>
                    <span style={profileLabelStyle}>PRN NUMBER</span>
                    <span
                      style={{ ...profileValueStyle, letterSpacing: "0.5px" }}
                    >
                      {studentData.prn}
                    </span>
                  </div>
                  <div style={profileBoxStyle}>
                    <span style={profileLabelStyle}>PROGRAMME</span>
                    <span style={profileValueStyle}>
                      {studentData.programme}
                    </span>
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
                  padding: "12px 20px 0",
                  borderBottom: "1px solid #e2e8f0",
                }}
              >
                <div
                  style={{
                    fontSize: "10.5px",
                    fontWeight: "700",
                    color: "#64748b",
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                    marginBottom: "6px",
                  }}
                >
                  ACADEMIC SEMESTERS:
                </div>
                <div style={{ display: "flex", gap: "6px", overflowX: "auto" }}>
                  {Object.keys(studentData.semesters).map((semKey) => {
                    const isActive = semKey === activeSem;
                    const attemptsCount = studentData.semesters[semKey].length;
                    return (
                      <button
                        key={semKey}
                        onClick={() => setActiveSem(semKey)}
                        style={{
                          padding: "8px 14px",
                          fontSize: "12px",
                          fontWeight: isActive ? "700" : "600",
                          color: isActive ? "#002147" : "#475569",
                          backgroundColor: isActive ? "#ffffff" : "#f1f5f9",
                          border: isActive
                            ? "1px solid #cbd5e1"
                            : "1px solid #e2e8f0",
                          borderBottom: isActive ? "3px solid #002147" : "none",
                          borderTopLeftRadius: "6px",
                          borderTopRightRadius: "6px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <BookOpen
                          size={13}
                          color={isActive ? "#002147" : "#94a3b8"}
                        />
                        <span>{semKey}</span>
                        <span
                          style={{
                            fontSize: "9.5px",
                            fontWeight: "800",
                            padding: "1px 5px",
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

              {/* Semester Content */}
              <div
                style={{
                  padding: "20px",
                  maxHeight: "750px",
                  overflowY: "auto",
                }}
              >
                {currentSemAttempts.map((attempt, idx) => (
                  <div
                    key={idx}
                    style={{
                      marginBottom: "24px",
                      border: "1px solid #cbd5e1",
                      borderRadius: "10px",
                      padding: "16px",
                      backgroundColor: "#ffffff",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: "#f1f5f9",
                        borderRadius: "8px",
                        padding: "10px 14px",
                        marginBottom: "14px",
                        border: "1px solid #e2e8f0",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "8px",
                      }}
                    >
                      <div>
                        <span style={metaLabelStyle}>EXAM / TERM NAME</span>
                        <p style={metaValueStyle}>{attempt.examName}</p>
                      </div>
                      <div>
                        <span
                          style={{
                            fontSize: "10.5px",
                            fontWeight: "800",
                            padding: "3px 8px",
                            borderRadius: "5px",
                            backgroundColor: attempt.seasonType.includes(
                              "Regular",
                            )
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

                    {/* Table */}
                    <div
                      style={{
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        overflow: "hidden",
                      }}
                    >
                      <div style={{ overflowX: "auto" }}>
                        <table
                          style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            fontSize: "11.5px",
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
                                  width: "95px",
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
                                        sub.grace !== "-"
                                          ? "#b45309"
                                          : "#64748b",
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
                                        padding: "2px 6px",
                                        borderRadius: "4px",
                                        fontSize: "10.5px",
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

                      <div
                        style={{
                          backgroundColor: "#f8fafc",
                          padding: "10px 14px",
                          borderTop: "1.5px solid #e2e8f0",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          flexWrap: "wrap",
                          gap: "10px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          <Award size={16} color="#002147" />
                          <span
                            style={{
                              fontSize: "11.5px",
                              fontWeight: "700",
                              color: "#334155",
                            }}
                          >
                            TOTAL MARKS:
                          </span>
                          <span
                            style={{
                              fontSize: "12px",
                              fontWeight: "800",
                              color: "#002147",
                              backgroundColor: "#e0f2fe",
                              padding: "2px 8px",
                              borderRadius: "5px",
                            }}
                          >
                            {attempt.summary.totalMarks}
                          </span>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          {attempt.summary.finalResult.includes("FAIL") ? (
                            <AlertTriangle size={15} color="#dc2626" />
                          ) : (
                            <CheckCircle2 size={15} color="#16a34a" />
                          )}
                          <span
                            style={{
                              fontSize: "11.5px",
                              fontWeight: "700",
                              color: "#334155",
                            }}
                          >
                            RESULT:
                          </span>
                          <span
                            style={{
                              fontSize: "11.5px",
                              fontWeight: "800",
                              color: attempt.summary.finalResult.includes(
                                "FAIL",
                              )
                                ? "#dc2626"
                                : "#16a34a",
                              backgroundColor:
                                attempt.summary.finalResult.includes("FAIL")
                                  ? "#fee2e2"
                                  : "#dcfce7",
                              padding: "2px 8px",
                              borderRadius: "5px",
                            }}
                          >
                            {attempt.summary.finalResult}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Metrics Cards */}
                    <div
                      style={{
                        marginTop: "12px",
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(260px, 1fr))",
                        gap: "12px",
                      }}
                    >
                      <div style={metricCardStyle}>
                        <div style={metricCardHeaderStyle}>
                          <TrendingUp size={15} color="#002147" />
                          <span
                            style={{
                              fontSize: "11.5px",
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
                                fontSize: "14px",
                              }}
                            >
                              {attempt.summary.sgpa}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div style={metricCardStyle}>
                        <div style={metricCardHeaderStyle}>
                          <Award size={15} color="#0f766e" />
                          <span
                            style={{
                              fontSize: "11.5px",
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
                            <span style={metricLabelStyle}>
                              CUM. GRADE POINTS
                            </span>
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
                                fontSize: "14px",
                              }}
                            >
                              {attempt.summary.cgpa}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {attempt.summary.resultClass && (
                      <div
                        style={{
                          marginTop: "12px",
                          backgroundColor: "#f0fdf4",
                          border: "1px solid #bbf7d0",
                          borderRadius: "8px",
                          padding: "10px 14px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          <GraduationCap size={18} color="#15803d" />
                          <span
                            style={{
                              fontSize: "11.5px",
                              fontWeight: "700",
                              color: "#166534",
                            }}
                          >
                            FINAL PROGRAMME CLASS / DIVISION:
                          </span>
                        </div>
                        <span
                          style={{
                            fontSize: "12.5px",
                            fontWeight: "800",
                            color: "#15803d",
                            backgroundColor: "#ffffff",
                            padding: "3px 10px",
                            borderRadius: "5px",
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

              {/* Disclaimer */}
              <div
                style={{
                  padding: "10px 16px",
                  backgroundColor: "#fff1f2",
                  borderTop: "1px solid #ffe4e6",
                  display: "flex",
                  gap: "8px",
                  alignItems: "center",
                }}
              >
                <Info size={15} color="#e11d48" style={{ flexShrink: 0 }} />
                <p
                  style={{
                    margin: 0,
                    fontSize: "11px",
                    color: "#9f1239",
                    fontWeight: "500",
                  }}
                >
                  You may use these online results for quick reference, but they
                  do not replace your official grades. Please ensure you verify
                  your final marks against the original printed transcript
                  provided by the University.
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Layout Tokens
const loaderContainerStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "16px",
};
const loaderWrapperStyle = {
  position: "relative",
  width: "80px",
  height: "80px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
const loaderRingStyle = {
  position: "absolute",
  inset: 0,
  borderRadius: "50%",
  border: "3px solid transparent",
  borderTopColor: "#002147",
  borderRightColor: "#002147",
  animation: "customRotate 0.9s linear infinite",
};
const loaderLogoWrapperStyle = {
  width: "60px",
  height: "60px",
  borderRadius: "50%",
  overflow: "hidden",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#ffffff",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  animation: "customPulse 1.8s ease-in-out infinite",
};
const loaderImageStyle = {
  width: "48px",
  height: "48px",
  objectFit: "contain",
};
const loaderTextStyle = {
  margin: 0,
  fontSize: "13px",
  fontWeight: "700",
  color: "#002147",
  letterSpacing: "0.2px",
};
const profileBoxStyle = {
  backgroundColor: "rgba(255, 255, 255, 0.08)",
  borderRadius: "8px",
  padding: "8px 12px",
  backdropFilter: "blur(4px)",
  border: "1px solid rgba(255, 255, 255, 0.12)",
};
const profileLabelStyle = {
  display: "block",
  fontSize: "9.5px",
  fontWeight: "700",
  color: "#93c5fd",
  marginBottom: "1px",
};
const profileValueStyle = {
  fontSize: "12px",
  fontWeight: "700",
  color: "#ffffff",
};
const metaLabelStyle = {
  fontSize: "9.5px",
  fontWeight: "700",
  color: "#64748b",
  display: "block",
  marginBottom: "1px",
};
const metaValueStyle = {
  margin: 0,
  fontSize: "12px",
  fontWeight: "700",
  color: "#0f172a",
};
const thStyle = {
  padding: "8px 10px",
  fontWeight: "700",
  fontSize: "10.5px",
  textTransform: "uppercase",
  borderRight: "1px solid #cbd5e1",
};
const subThStyle = {
  padding: "6px 4px",
  fontWeight: "700",
  fontSize: "10px",
  borderRight: "1px solid #cbd5e1",
};
const tdStyle = {
  padding: "8px 6px",
  borderRight: "1px solid #e2e8f0",
  fontSize: "11.5px",
};
const tdMutedStyle = { ...tdStyle, color: "#64748b" };
const metricCardStyle = {
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  border: "1px solid #e2e8f0",
  padding: "12px",
};
const metricCardHeaderStyle = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  marginBottom: "8px",
  paddingBottom: "4px",
  borderBottom: "1px solid #f1f5f9",
};
const metricGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "6px",
  textAlign: "center",
};
const metricItemStyle = {
  padding: "6px 4px",
  backgroundColor: "#f8fafc",
  borderRadius: "5px",
};
const metricLabelStyle = {
  display: "block",
  fontSize: "9px",
  fontWeight: "700",
  color: "#64748b",
  marginBottom: "1px",
};
const metricValueStyle = {
  fontSize: "12.5px",
  fontWeight: "800",
  color: "#0f172a",
};
