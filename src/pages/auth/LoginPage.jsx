import React from "react";
import { useNavigate } from "react-router-dom";

// DBATU Branding Assets
import DBATULogo from "../../assets/images/batulogo.webp";
import BgImage from "../../assets/images/dbatuicon.jpeg";
import BgImage1 from "../../assets/images/batubg.jfif";

/* ── UI Design System Tokens ─────────────────────────────────────── */
const ACCENT = "#002147"; // DBATU Primary Deep Navy
const ACCENT_GRADIENT = "linear-gradient(135deg, #002147 0%, #0d3b66 100%)";
const TEXT_MAIN = "#0f172a";
const TEXT_SUB = "#64748b";

export default function LoginPage() {
  const navigate = useNavigate();

  const handleQuickAccess = () => {
    const demoUser = {
      emp_Id: "2130331246058",
      name: "SUNIL VARMA",
      role: "Student",
    };
    sessionStorage.setItem("user", JSON.stringify(demoUser));
    navigate("/results", { replace: true });
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        width: "100vw",
        overflow: "hidden",
        fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif",
        backgroundImage: `url(${BgImage1})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
      }}
    >
      {/* Dark Ambient Backdrop Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at center, rgba(0, 33, 71, 0.45) 0%, rgba(6, 14, 22, 0.82) 100%)",
          backdropFilter: "blur(6px)",
        }}
      />

      {/* Main Glass Card Container */}
      <div
        className="login-card"
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          width: "min(920px, 92vw)",
          minHeight: "min(520px, 85vh)",
          borderRadius: 28,
          overflow: "hidden",
          boxShadow:
            "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.15)",
          background: "#ffffff",
        }}
      >
        {/* LEFT BRANDING PANEL */}
        <div
          className="login-image-panel"
          style={{
            flex: "0 0 46%",
            position: "relative",
            backgroundImage: `url(${BgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "36px 32px",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(0,33,71,0.3) 0%, rgba(0,24,56,0.92) 100%)",
            }}
          />

          {/* Top Badge */}
          <div
            style={{
              position: "relative",
              zIndex: 2,
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              alignSelf: "flex-start",
              backgroundColor: "rgba(255, 255, 255, 0.12)",
              backdropFilter: "blur(8px)",
              padding: "6px 14px",
              borderRadius: 20,
              border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: "#22c55e",
                boxShadow: "0 0 8px #22c55e",
              }}
            />
            <span
              style={{
                fontSize: 11.5,
                fontWeight: 700,
                color: "#ffffff",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}
            >
              Academic Portal
            </span>
          </div>

          {/* Left Panel Title Content */}
          <div style={{ position: "relative", zIndex: 2 }}>
            <h2
              style={{
                margin: "0 0 8px",
                fontSize: 22,
                fontWeight: 800,
                color: "#ffffff",
                lineHeight: 1.3,
                letterSpacing: "-0.02em",
              }}
            >
              Dr. Babasaheb Ambedkar Technological University
            </h2>
            <p
              style={{
                margin: 0,
                fontSize: 13,
                fontWeight: 500,
                color: "#93c5fd",
                lineHeight: 1.5,
              }}
            >
              Official Examination Results & Academic Performance Verification
              Portal
            </p>
          </div>
        </div>

        {/* RIGHT QUICK ACCESS PANEL */}
        <div
          style={{
            flex: 1,
            background: "#ffffff",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 48px",
            boxSizing: "border-box",
            position: "relative",
          }}
        >
          {/* Logo Container */}
          <div
            style={{
              width: 88,
              height: 88,
              borderRadius: 22,
              background: "#f8fafc",
              border: "1px solid #f1f5f9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 20,
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)",
            }}
          >
            <img
              src={DBATULogo}
              alt="DBATU Logo"
              style={{ height: 64, width: 64, objectFit: "contain" }}
            />
          </div>

          <h1
            style={{
              margin: "0 0 6px",
              fontSize: 24,
              fontWeight: 800,
              color: TEXT_MAIN,
              textAlign: "center",
              letterSpacing: "-0.02em",
            }}
          >
            Result Portal
          </h1>
          <p
            style={{
              margin: "0 0 32px",
              fontSize: 13.5,
              color: TEXT_SUB,
              textAlign: "center",
              maxWidth: 300,
              lineHeight: 1.5,
            }}
          >
            Access examination statements, semester marks, and CGPA reports
            instantly.
          </p>

          {/* Primary Action Button (Quick Access) */}
          <button
            type="button"
            onClick={handleQuickAccess}
            style={{
              height: 52,
              width: "100%",
              maxWidth: 320,
              borderRadius: 14,
              border: "none",
              background: ACCENT_GRADIENT,
              color: "#ffffff",
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
              boxShadow:
                "0 12px 24px -6px rgba(0, 33, 71, 0.35), 0 4px 6px -2px rgba(0, 33, 71, 0.05)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 16px 32px -6px rgba(0, 33, 71, 0.45)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 12px 24px -6px rgba(0, 33, 71, 0.35)";
            }}
          >
            <span>Quick Access Portal</span>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>

          {/* Footer Note */}
          <div style={{ marginTop: 40, textAlign: "center" }}>
            <p style={{ fontSize: 11.5, color: "#94a3b8", margin: 0 }}>
              © {new Date().getFullYear()} Dr. Babasaheb Ambedkar Technological
              University
            </p>
          </div>
        </div>
      </div>

      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; padding: 0; }
        @media (max-width: 720px) {
          .login-image-panel { display: none !important; }
        }
      `}</style>
    </div>
  );
}
