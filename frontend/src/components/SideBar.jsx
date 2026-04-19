import { useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, ListTodo, LogOut, ShieldCheck, User, Users } from "lucide-react";
import { getEmail, isAdmin } from "../utils/auth";

const NAV = [
  { label: "Dashboard", path: "/",      Icon: LayoutDashboard, adminOnly: false },
  { label: "Tasks",     path: "/tasks", Icon: ListTodo,        adminOnly: false },
  { label: "Users",     path: "/admin/users", Icon: Users,     adminOnly: true  },
];

export default function Sidebar({ onLogout }) {
  const navigate  = useNavigate();
  const location  = useLocation();
  const admin     = isAdmin();
  const email     = getEmail();

  // Filter nav items based on role
  const visibleNav = NAV.filter(item => !item.adminOnly || admin);

  return (
    <aside style={s.sidebar}>
      {/* Logo */}
      <div style={s.logo}>
        <ListTodo size={20} color="#0f9b8e" />
        <span style={s.logoText}>TaskManager</span>
      </div>

      {/* User info */}
      <div style={s.userBox}>
        <div style={s.avatar}>
          {admin ? <ShieldCheck size={16} color="#0f9b8e" /> : <User size={16} color="#6b7280" />}
        </div>
        <div>
          <p style={s.userEmail}>{email}</p>
          <p style={{ ...s.userRole, color: admin ? "#0f9b8e" : "#6b7280" }}>
            {admin ? "Admin" : "User"}
          </p>
        </div>
      </div>

      {/* Nav links */}
      <nav style={{ flex: 1 }}>
        {visibleNav.map(({ label, path, Icon }) => {
          const active = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              style={{
                ...s.navBtn,
                background: active ? "#f0fdf4" : "transparent",
                color:      active ? "#0f9b8e" : "#6b7280",
                fontWeight: active ? 600 : 400,
              }}
            >
              <Icon size={16} />
              {label}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <button onClick={onLogout} style={s.logoutBtn}>
        <LogOut size={16} /> Logout
      </button>
    </aside>
  );
}

const s = {
  sidebar:   { width: 220, background: "white", borderRight: "1px solid #eef0f3", display: "flex", flexDirection: "column", padding: "24px 16px" },
  logo:      { display: "flex", alignItems: "center", gap: 8, marginBottom: 32 },
  logoText:  { fontSize: 16, fontWeight: 700, color: "#1f2937" },
  userBox:   { display: "flex", alignItems: "center", gap: 10, padding: "12px 8px", background: "#f9fafb", borderRadius: 10, marginBottom: 24 },
  avatar:    { width: 34, height: 34, borderRadius: "50%", background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  userEmail: { fontSize: 12, fontWeight: 600, color: "#1f2937", margin: 0, maxWidth: 130, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  userRole:  { fontSize: 11, margin: 0, marginTop: 2 },
  navBtn:    { display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 14, marginBottom: 4, textAlign: "left" },
  logoutBtn: { display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "10px 12px", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 14, color: "#dc2626", background: "#fef2f2", fontWeight: 600, marginTop: "auto" },
};