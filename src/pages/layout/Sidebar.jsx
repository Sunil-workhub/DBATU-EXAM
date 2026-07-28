import { NavLink } from "react-router-dom";
import { GraduationCap, X } from "lucide-react";
import { COLOR } from "../../theme/colors";
import menuConfig from "../../config/menuConfig";

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Mobile scrim */}
      {open && (
        <div
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            zIndex: 30,
          }}
          className="md:hidden"
        />
      )}

      <aside
        style={{
          background: COLOR.ledgerDeep,
          width: 240,
          position: "fixed",
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 40,
          display: "flex",
          flexDirection: "column",
          transform: open ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.2s ease",
        }}
        className="md:translate-x-0"
      >
        {/* Emblem */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "22px 20px 18px",
            borderBottom: `1px solid ${COLOR.ledgerLine}`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                border: `2px solid ${COLOR.brassLight}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <GraduationCap size={17} color={COLOR.brassLight} />
            </div>
            <div>
              <p
                style={{
                  margin: 0,
                  fontSize: 12.5,
                  fontWeight: 800,
                  color: "#fff",
                  lineHeight: 1.2,
                }}
              >
                DBATU
              </p>
              <p style={{ margin: 0, fontSize: 10, color: "#9FC0BD" }}>
                Result Portal
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="md:hidden"
            style={{
              background: "none",
              border: "none",
              color: "#9FC0BD",
              cursor: "pointer",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Menu */}
        <nav style={{ flex: 1, padding: "14px 12px", overflowY: "auto" }}>
          {menuConfig.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              onClick={onClose}
              style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 14px",
                marginBottom: 4,
                borderRadius: 10,
                fontSize: 13.5,
                fontWeight: 600,
                textDecoration: "none",
                color: isActive ? "#fff" : "#B9CFCC",
                background: isActive ? "rgba(184,134,59,0.18)" : "transparent",
                borderLeft: isActive
                  ? `3px solid ${COLOR.brassLight}`
                  : "3px solid transparent",
              })}
            >
              {Icon && <Icon size={16} />}
              {label}
            </NavLink>
          ))}
        </nav>

        <div
          style={{
            padding: "16px 20px",
            borderTop: `1px solid ${COLOR.ledgerLine}`,
          }}
        >
          <p style={{ margin: 0, fontSize: 10, color: "#7FA09D" }}>
            © {new Date().getFullYear()} DBATU, Lonere
          </p>
        </div>
      </aside>
    </>
  );
}
