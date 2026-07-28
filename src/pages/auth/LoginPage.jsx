import React, { useState } from "react";
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

  // State for manual login
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  /* 
  // Commented out Quick Access Handler
  const handleQuickAccess = () => {
    const demoUser = {
      emp_Id: "2130331246058",
      name: "SUNIL VARMA",
      role: "Student",
    };
    sessionStorage.setItem("user", JSON.stringify(demoUser));
    navigate("/results", { replace: true });
  };
  */

  const handleManualLogin = (e) => {
    e.preventDefault();
    setErrorMsg("");

    // Validation against sunil / pass@123
    if (username.trim() === "sunil" && password === "pass@123") {
      const userObj = {
        emp_Id: "2130331246058",
        name: "SUNIL VARMA",
        role: "Student",
      };
      sessionStorage.setItem("user", JSON.stringify(userObj));
      navigate("/results", { replace: true });
    } else {
      setErrorMsg("Invalid User ID or Password. Please try again.");
    }
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
          minHeight: "min(560px, 85vh)",
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

        {/* RIGHT LOGIN PANEL */}
        <div
          style={{
            flex: 1,
            background: "#ffffff",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "36px 44px",
            boxSizing: "border-box",
            position: "relative",
          }}
        >
          {/* Logo Container */}
          <div
            style={{
              width: 76,
              height: 76,
              borderRadius: 20,
              background: "#f8fafc",
              border: "1px solid #f1f5f9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)",
            }}
          >
            <img
              src={BgImage}
              alt="DBATU Logo"
              style={{ height: 54, width: 54, objectFit: "contain" }}
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
              margin: "0 0 24px",
              fontSize: 13,
              color: TEXT_SUB,
              textAlign: "center",
              maxWidth: 300,
              lineHeight: 1.4,
            }}
          >
            Enter your credentials to access your examination statement.
          </p>

          {/* MANUAL LOGIN FORM */}
          <form
            onSubmit={handleManualLogin}
            style={{
              width: "100%",
              maxWidth: 320,
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            {errorMsg && (
              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: 10,
                  backgroundColor: "#fef2f2",
                  border: "1px solid #fecaca",
                  color: "#dc2626",
                  fontSize: 12.5,
                  fontWeight: 600,
                  textAlign: "center",
                }}
              >
                {errorMsg}
              </div>
            )}

            {/* User ID Field */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {/* <label
                htmlFor="username"
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#334155",
                  letterSpacing: "0.02em",
                  textTransform: "uppercase",
                }}
              >
                User ID
              </label> */}
              <input
                id="username"
                type="text"
                placeholder="Enter User ID"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{
                  height: 46,
                  padding: "0 14px",
                  borderRadius: 12,
                  border: "1.5px solid #e2e8f0",
                  backgroundColor: "#f8fafc",
                  fontSize: 14,
                  color: TEXT_MAIN,
                  outline: "none",
                  transition: "all 0.2s ease",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = ACCENT;
                  e.target.style.backgroundColor = "#ffffff";
                  e.target.style.boxShadow = "0 0 0 3px rgba(0, 33, 71, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e2e8f0";
                  e.target.style.backgroundColor = "#f8fafc";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Password Field */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {/* <label
                htmlFor="password"
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#334155",
                  letterSpacing: "0.02em",
                  textTransform: "uppercase",
                }}
              >
                Password
              </label> */}
              <input
                id="password"
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  height: 46,
                  padding: "0 14px",
                  borderRadius: 12,
                  border: "1.5px solid #e2e8f0",
                  backgroundColor: "#f8fafc",
                  fontSize: 14,
                  color: TEXT_MAIN,
                  outline: "none",
                  transition: "all 0.2s ease",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = ACCENT;
                  e.target.style.backgroundColor = "#ffffff";
                  e.target.style.boxShadow = "0 0 0 3px rgba(0, 33, 71, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e2e8f0";
                  e.target.style.backgroundColor = "#f8fafc";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Login Submit Button */}
            <button
              type="submit"
              style={{
                height: 48,
                width: "100%",
                borderRadius: 12,
                border: "none",
                background: ACCENT_GRADIENT,
                color: "#ffffff",
                fontSize: 14.5,
                fontWeight: 700,
                cursor: "pointer",
                boxShadow:
                  "0 10px 20px -5px rgba(0, 33, 71, 0.35), 0 4px 6px -2px rgba(0, 33, 71, 0.05)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                marginTop: 6,
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 14px 28px -6px rgba(0, 33, 71, 0.45)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 10px 20px -5px rgba(0, 33, 71, 0.35)";
              }}
            >
              <span>Sign In</span>
              <svg
                width="16"
                height="16"
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
          </form>

          {/*
          ==================================================
          COMMENTED OUT: Quick Access Button
          ==================================================
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
          >
            <span>Quick Access Portal</span>
          </button>
          */}

          {/* Footer Note */}
          <div style={{ marginTop: 28, textAlign: "center" }}>
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
