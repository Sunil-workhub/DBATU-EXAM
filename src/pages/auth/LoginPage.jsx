import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// DBATU Branding Assets
import DBATULogo from "../../assets/images/batulogo.webp";
import BgImage from "../../assets/images/dbatuicon.jpeg";
import BgImage1 from "../../assets/images/batubg.jfif";

/* ── UI Design System Tokens ─────────────────────────────────────── */
const ACCENT = "#002147"; // DBATU Primary Deep Navy
const ACCENT_DARK = "#001838";
const TEXT_MAIN = "#111111";
const TEXT_SUB = "#6b7280";
const BORDER = "#e4e8ed";
const ERROR = "#ef4444";
const SUCCESS = "#16a34a";
const INPUT_FOCUS = "rgba(0, 33, 71, 0.12)";

const getInputStyle = (hasError) => ({
  height: 48,
  padding: "0 16px",
  borderRadius: 10,
  border: `1.5px solid ${hasError ? ERROR : BORDER}`,
  background: hasError ? "#fef2f2" : "#f8f9fb",
  fontSize: 13.5,
  color: TEXT_MAIN,
  outline: "none",
  transition: "all 0.15s",
  width: "100%",
  boxSizing: "border-box",
});

const getPasswordInputStyle = (hasError) => ({
  height: 48,
  padding: "0 44px 0 16px",
  borderRadius: 10,
  border: `1.5px solid ${hasError ? ERROR : BORDER}`,
  background: hasError ? "#fef2f2" : "#f8f9fb",
  fontSize: 13.5,
  color: TEXT_MAIN,
  outline: "none",
  transition: "all 0.15s",
  width: "100%",
  boxSizing: "border-box",
});

const setFocusStyle = (element) => {
  element.style.borderColor = ACCENT;
  element.style.boxShadow = `0 0 0 3px ${INPUT_FOCUS}`;
  element.style.background = "#fff";
};

const setBlurStyle = (element, hasError) => {
  element.style.borderColor = hasError ? ERROR : BORDER;
  element.style.boxShadow = "none";
  element.style.background = hasError ? "#fef2f2" : "#f8f9fb";
};

const EyeIcon = ({ open }) =>
  open ? (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ) : (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );

export default function LoginPage() {
  const navigate = useNavigate();

  // Core Authentication States
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const errs = {};
    if (!username.trim()) errs.username = "PRN / Registration No. is required";
    if (!password.trim()) errs.password = "Password is required";
    return errs;
  };

  const handleLoginSubmit = async (ev) => {
    ev.preventDefault();
    setApiError("");

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setLoading(true);

    try {
      // Simulate authenticating against your new API backend
      setTimeout(() => {
        const userPayload = {
          emp_Id: username.trim(),
          name: username.trim(),
          role: "Student",
        };

        sessionStorage.setItem("user", JSON.stringify(userPayload));
        navigate("/results", { replace: true });
      }, 600);
    } catch (err) {
      setApiError(err.message || "Authentication failed");
      setLoading(false);
    }
  };

  const handleDemoBypass = () => {
    const demoUser = {
      emp_Id: "2130331246058",
      name: "SHIRKE PRAJYOT SURENDRA",
      role: "Student",
    };
    sessionStorage.setItem("user", JSON.stringify(demoUser));
    navigate("/results", { replace: true });
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          width: "100vw",
          overflow: "hidden",
          fontFamily: "'Inter','Segoe UI',system-ui,sans-serif",
          backgroundImage: `url(${BgImage1})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
        }}
      >
        {/* Dark Backdrop Overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(6, 14, 22, 0.65)",
            backdropFilter: "blur(2px)",
          }}
        />

        <div
          className="login-card"
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            width: "min(940px, 92vw)",
            height: "min(600px, 90vh)",
            borderRadius: 24,
            overflow: "hidden",
            boxShadow:
              "0 32px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.08)",
          }}
        >
          {/* LEFT PANEL */}
          <div
            className="login-image-panel"
            style={{
              flex: "0 0 48%",
              position: "relative",
              backgroundImage: `url(${BgImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              padding: "0 28px 32px",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,33,71,0.85) 100%)",
              }}
            />
            <h2
              style={{
                position: "relative",
                zIndex: 2,
                margin: 0,
                fontSize: 20,
                fontWeight: 800,
                color: "#fff",
                lineHeight: 1.3,
                textShadow: "0 2px 12px rgba(0,0,0,0.5)",
              }}
            >
              Dr. Babasaheb Ambedkar Technological University
              <br />
              <span style={{ fontSize: 13, fontWeight: 500, color: "#cbd5e1" }}>
                Examination & Academic Result Portal
              </span>
            </h2>
          </div>

          {/* RIGHT PANEL */}
          <div
            style={{
              flex: 1,
              background: "#ffffff",
              display: "flex",
              flexDirection: "column",
              padding: "36px 40px",
              overflowY: "auto",
              boxSizing: "border-box",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 20,
              }}
            >
              <img
                src={DBATULogo}
                alt="DBATU Logo"
                style={{ height: 80, objectFit: "contain" }}
              />
            </div>

            <h1
              style={{
                margin: "0 0 4px",
                fontSize: 24,
                fontWeight: 800,
                color: TEXT_MAIN,
                textAlign: "center",
              }}
            >
              Student Portal Login
            </h1>
            <p
              style={{
                margin: "0 0 24px",
                fontSize: 13,
                color: TEXT_SUB,
                textAlign: "center",
              }}
            >
              Enter your university credentials to view results
            </p>

            {apiError && (
              <div
                style={{
                  marginBottom: 16,
                  padding: "10px 14px",
                  borderRadius: 10,
                  background: "#fef2f2",
                  border: "1px solid rgba(239,68,68,0.25)",
                  color: ERROR,
                  fontSize: 12,
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                }}
              >
                <span style={{ fontWeight: "bold" }}>⚠️</span> {apiError}
              </div>
            )}

            <form
              onSubmit={handleLoginSubmit}
              style={{ display: "flex", flexDirection: "column", gap: 14 }}
              noValidate
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (errors.username)
                      setErrors((p) => ({ ...p, username: undefined }));
                  }}
                  placeholder="PRN / User Registration ID"
                  style={getInputStyle(!!errors.username)}
                  onFocus={(e) => setFocusStyle(e.target)}
                  onBlur={(e) => setBlurStyle(e.target, !!errors.username)}
                />
                {errors.username && (
                  <span style={{ fontSize: 11, color: ERROR, paddingLeft: 4 }}>
                    {errors.username}
                  </span>
                )}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password)
                        setErrors((p) => ({ ...p, password: undefined }));
                    }}
                    placeholder="Password"
                    style={getPasswordInputStyle(!!errors.password)}
                    onFocus={(e) => setFocusStyle(e.target)}
                    onBlur={(e) => setBlurStyle(e.target, !!errors.password)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    style={{
                      position: "absolute",
                      right: 13,
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 4,
                      color: TEXT_SUB,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <EyeIcon open={showPassword} />
                  </button>
                </div>
                {errors.password && (
                  <span style={{ fontSize: 11, color: ERROR, paddingLeft: 4 }}>
                    {errors.password}
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  height: 48,
                  width: "100%",
                  borderRadius: 10,
                  border: "none",
                  background: ACCENT,
                  color: "#fff",
                  fontSize: 14.5,
                  fontWeight: 700,
                  cursor: "pointer",
                  marginTop: 6,
                  boxShadow: "0 4px 12px rgba(0, 33, 71, 0.25)",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = ACCENT_DARK)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = ACCENT)
                }
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                margin: "20px 0 12px",
              }}
            >
              <div style={{ flex: 1, height: 1, background: BORDER }} />
              <span style={{ fontSize: 11, color: TEXT_SUB, fontWeight: 600 }}>
                DEMO MODE
              </span>
              <div style={{ flex: 1, height: 1, background: BORDER }} />
            </div>

            <button
              type="button"
              onClick={handleDemoBypass}
              style={{
                height: 42,
                width: "100%",
                borderRadius: 10,
                border: "1.5px dashed #cbd5e1",
                background: "#f8fafc",
                color: "#334155",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              🚀 Direct Demo Quick Access
            </button>

            <div
              style={{ marginTop: "auto", paddingTop: 20, textAlign: "center" }}
            >
              <p style={{ fontSize: 11, color: "#9ca3af", margin: 0 }}>
                © {new Date().getFullYear()} Dr. Babasaheb Ambedkar
                Technological University
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes loginSpin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        body { margin: 0; padding: 0; }
        @media (max-width: 680px) { .login-image-panel { display: none !important; } }
      `}</style>
    </>
  );
}
