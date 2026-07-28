import React, { useState } from "react";
import { Outlet, useNavigate, Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  LogOut,
  User,
  GraduationCap,
  FileText,
  Home,
  ChevronRight,
} from "lucide-react";
import logo from "../../assets/images/dbatuicon.jpeg";

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Retrieve user session
  const userRaw = sessionStorage.getItem("user");
  const user = userRaw
    ? JSON.parse(userRaw)
    : { name: "Demo User", emp_Id: "DEMO123" };

  const handleLogout = () => {
    sessionStorage.setItem("explicit_logout", "true");
    sessionStorage.removeItem("user");
    navigate("/helpdesk-login", { replace: true });
  };

  const navItems = [
    { label: "Student Result Portal", path: "/results", icon: GraduationCap },
    // { label: "Dashboard", path: "/dashboard", icon: Home },
    // { label: "Reports", path: "/reports", icon: FileText },
  ];

  const SIDEBAR_WIDTH = 240;
  const NAVBAR_HEIGHT = 64;

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f4f6f8",
        fontFamily: "Segoe UI, sans-serif",
      }}
    >
      {/* Top Navbar */}
      <header
        style={{
          height: `${NAVBAR_HEIGHT}px`,
          backgroundColor: "#002147", // DBATU Navy
          color: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: "none",
              border: "none",
              color: "#fff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
            }}
          >
            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                backgroundColor: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#002147",
                fontWeight: "bold",
                fontSize: "12px",
              }}
            >
              {/* DBATU */}
              <img
                src={logo}
                alt="DBATU Logo"
                style={{ width: "24px", height: "24px" }}
              />
            </div>
            <div>
              <h2
                style={{
                  fontSize: "15px",
                  fontWeight: "700",
                  margin: 0,
                  lineHeight: 1.2,
                }}
              >
                Dr. Babasaheb Ambedkar Technological University
              </h2>
              <span style={{ fontSize: "11px", color: "#b0c4de" }}>
                Lonere, Maharashtra
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(255,255,255,0.1)",
              padding: "6px 12px",
              borderRadius: "20px",
            }}
          >
            <User size={16} color="#4ae3b5" />
            <span style={{ fontSize: "13px", fontWeight: "500" }}>
              {user.name || user.emp_Id || user.emp_No}
            </span>
          </div>

          <button
            onClick={handleLogout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              backgroundColor: "#dc2626",
              color: "#fff",
              border: "none",
              padding: "7px 14px",
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            <LogOut size={15} /> Logout
          </button>
        </div>
      </header>

      {/* Fixed Sidebar */}
      <aside
        style={{
          position: "fixed",
          top: `${NAVBAR_HEIGHT}px`,
          left: 0,
          bottom: 0,
          width: sidebarOpen ? `${SIDEBAR_WIDTH}px` : "0px",
          transition: "width 0.2s ease-in-out",
          overflow: "hidden",
          backgroundColor: "#ffffff",
          borderRight: "1px solid #e5e7eb",
          zIndex: 900,
        }}
      >
        <nav
          style={{
            padding: "15px 10px",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 14px",
                  borderRadius: "6px",
                  textDecoration: "none",
                  color: isActive ? "#002147" : "#4b5563",
                  backgroundColor: isActive ? "#e0f2fe" : "transparent",
                  fontWeight: isActive ? "600" : "500",
                  fontSize: "14px",
                  whiteSpace: "nowrap",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight size={16} />}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Scrollable Content Container */}
      <main
        style={{
          marginTop: `${NAVBAR_HEIGHT}px`,
          marginLeft: sidebarOpen ? `${SIDEBAR_WIDTH}px` : "0px",
          transition: "margin-left 0.2s ease-in-out",
          padding: "24px",
          minHeight: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}
