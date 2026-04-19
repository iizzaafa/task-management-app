import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { getEmail, getRole, logout } from "../utils/auth";
import Button from "../components/Button";

export default function Settings() {
  const navigate = useNavigate();
  const email    = getEmail();
  const role     = getRole();

  const card = (children) => (
    <div style={{
      background: "white", borderRadius: 12,
      boxShadow: "0 2px 8px rgba(0,0,0,0.06)", marginBottom: 20, overflow: "hidden",
    }}>
      {children}
    </div>
  );

  const row = (label, value) => (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "14px 20px", borderBottom: "1px solid #f5f5f5",
    }}>
      <div>
        <div style={{ fontSize: 11, color: "#aaa", marginBottom: 2 }}>{label}</div>
        <div style={{ fontSize: 14, color: "#333" }}>{value}</div>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: 32 }}>
      <h2 style={{ fontSize: 22, fontWeight: "bold", color: "#333", marginBottom: 4 }}>
        Settings
      </h2>
      <p style={{ fontSize: 13, color: "#999", marginBottom: 28 }}>
        Account and preferences
      </p>

      {card(<>
        {row("Email", email || "—")}
        {row("Role",
          <span style={{
            fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20,
            background: role === "admin" ? "#faeeda" : "#e1f5ee",
            color:      role === "admin" ? "#854f0b" : "#0f6e56",
          }}>
            {role}
          </span>
        )}
        {row("Password", "••••••••")}
      </>)}

      {/* Danger zone */}
      <div style={{
        background: "#fff3f3", border: "1px solid #ffcdd2", borderRadius: 12,
        padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#c62828" }}>Log out</div>
          <div style={{ fontSize: 12, color: "#e57373", marginTop: 2 }}>
            Clears your session and returns to login
          </div>
        </div>
        <Button
          label="LOG OUT"
          onClick={() => logout(navigate)}
          icon={<LogOut size={16} />}
          color="#c62828"
        />
      </div>
    </div>
  );
}