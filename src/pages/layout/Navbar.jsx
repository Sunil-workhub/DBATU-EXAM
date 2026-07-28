import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, ChevronDown, LogOut, UserRound } from "lucide-react";
import { COLOR, initialsOf } from "../../theme/colors";

export default function Navbar({ onMenuClick, title }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const user = (() => {
    try {
      return JSON.parse(sessionStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    const onClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    sessionStorage.setItem("explicit_logout", "true");
    navigate("/login", { replace: true });
  };

  return (
    <header
      style={{
        height: 62,
        background: "#fff",
        borderBottom: `1px solid ${COLOR.parchmentDeep}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        position: "sticky",
        top: 0,
        zIndex: 20,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <button
          onClick={onMenuClick}
          className="md:hidden"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: COLOR.ink,
            display: "flex",
          }}
        >
          <Menu size={22} />
        </button>
        <div>
          <p
            style={{
              margin: 0,
              fontSize: 14.5,
              fontWeight: 700,
              color: COLOR.ink,
            }}
          >
            {title}
          </p>
          <p style={{ margin: 0, fontSize: 11, color: COLOR.slate }}>
            Dr. Babasaheb Ambedkar Technological University
          </p>
        </div>
      </div>

      <div ref={menuRef} style={{ position: "relative" }}>
        <button
          onClick={() => setMenuOpen((s) => !s)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "6px 8px",
            borderRadius: 10,
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: COLOR.ledger,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {user ? initialsOf(user.name) : <UserRound size={16} />}
          </div>
          <div
            style={{ textAlign: "left", display: "none" }}
            className="sm:block"
          >
            <p
              style={{
                margin: 0,
                fontSize: 12.5,
                fontWeight: 600,
                color: COLOR.ink,
              }}
            >
              {user?.name || "Guest"}
            </p>
            <p
              style={{
                margin: 0,
                fontSize: 10.5,
                color: COLOR.slate,
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              }}
            >
              {user?.prn || ""}
            </p>
          </div>
          <ChevronDown size={15} color={COLOR.slate} />
        </button>

        {menuOpen && (
          <div
            style={{
              position: "absolute",
              right: 0,
              top: "calc(100% + 8px)",
              background: "#fff",
              border: `1px solid ${COLOR.parchmentDeep}`,
              borderRadius: 12,
              boxShadow: "0 12px 32px rgba(0,0,0,0.16)",
              minWidth: 200,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "12px 14px",
                borderBottom: `1px solid ${COLOR.parchmentDeep}`,
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: 12.5,
                  fontWeight: 700,
                  color: COLOR.ink,
                }}
              >
                {user?.name}
              </p>
              <p
                style={{ margin: "2px 0 0", fontSize: 11, color: COLOR.slate }}
              >
                {user?.programme}
              </p>
            </div>
            <button
              onClick={() => {
                setMenuOpen(false);
                navigate("/profile");
              }}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 14px",
                background: "none",
                border: "none",
                fontSize: 12.5,
                color: COLOR.ink,
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <UserRound size={14} /> My Profile
            </button>
            <button
              onClick={handleLogout}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 14px",
                background: "none",
                border: "none",
                fontSize: 12.5,
                color: COLOR.rose,
                cursor: "pointer",
                textAlign: "left",
                borderTop: `1px solid ${COLOR.parchmentDeep}`,
              }}
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
