import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, UserPlus, ShieldCheck, User, AlertTriangle, CheckCircle } from "lucide-react";
import api from "../api/axios";
import { isAdmin, logout } from "../utils/auth";
import SideBar from "../components/SideBar";

export default function UserManagement() {
  const navigate = useNavigate();
  const [users, setUsers]       = useState([]);
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole]         = useState("user");
  const [message, setMessage]   = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    if (!isAdmin()) {
      navigate("/");
    } else {
      fetchUsers();
    }
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/auth/admin/users");
      setUsers(res.data);
    } catch (err) {
      if (err.response?.status !== 401) {
        setError("Failed to load users");
      }
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/admin/users", { email, password, role });
      setMessage(`${res.data.user.role.toUpperCase()} "${res.data.user.email}" created successfully`);
      setEmail("");
      setPassword("");
      setRole("user");
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId, userEmail) => {
    if (!window.confirm(`Delete user "${userEmail}"?\nAll their tasks will be deleted too.`)) {
      return;
    }

    try {
      await api.delete(`/auth/admin/users/${userId}`);
      setMessage(`User "${userEmail}" deleted`);
      setError("");
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete user");
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f9fafb" }}>
      <SideBar onLogout={() => logout(navigate)} />

      <main style={{ flex: 1, padding: 32, overflow: "auto" }}>
        <header style={{ marginBottom: 24 }}>
          <h2 style={s.title}>User Management</h2>
          <p style={s.subtitle}>Create and manage user accounts</p>
        </header>

        {error && (
          <div style={s.errorBanner}>
            <AlertTriangle size={14} /> {error}
          </div>
        )}

        {message && (
          <div style={s.successBanner}>
            <CheckCircle size={14} /> {message}
          </div>
        )}

        <div style={s.card}>
          <div style={s.cardHeader}>
            <UserPlus size={18} color="#0f9b8e" />
            <h3 style={s.cardTitle}>Create New User</h3>
          </div>

          <form onSubmit={handleCreate} style={s.form}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              style={s.input}
            />
            <input
              type="password"
              placeholder="Password (min 8 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              style={s.input}
            />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={loading}
              style={s.input}
            >
              <option value="user">Regular User</option>
              <option value="admin">Administrator</option>
            </select>
            <button type="submit" disabled={loading} style={s.createBtn}>
              {loading ? "Creating..." : "Create User"}
            </button>
          </form>
        </div>

        <div style={s.card}>
          <div style={s.cardHeader}>
            <h3 style={s.cardTitle}>All Users ({users.length})</h3>
          </div>

          {users.length === 0 ? (
            <p style={s.empty}>No users found</p>
          ) : (
            <table style={s.table}>
              <thead>
                <tr style={s.tableHeader}>
                  <th style={s.th}>ID</th>
                  <th style={s.th}>Email</th>
                  <th style={s.th}>Role</th>
                  <th style={s.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} style={s.tableRow}>
                    <td style={s.td}>{u.id}</td>
                    <td style={s.td}>{u.email}</td>
                    <td style={s.td}>
                      <span style={{
                        ...s.badge,
                        background: u.role === "admin" ? "#f0fdf4" : "#f3f4f6",
                        color: u.role === "admin" ? "#0f9b8e" : "#6b7280",
                      }}>
                        {u.role === "admin" ? <ShieldCheck size={12} /> : <User size={12} />}
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td style={s.td}>
                      <button
                        onClick={() => handleDelete(u.id, u.email)}
                        style={s.deleteBtn}
                        title="Delete user"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}

const s = {
  title:         { fontSize: 22, fontWeight: 600, color: "#1f2937", margin: "0 0 4px" },
  subtitle:      { fontSize: 13, color: "#6b7280", margin: 0 },
  errorBanner:   { display: "flex", alignItems: "center", gap: 8, color: "#c62828", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "8px 12px", marginBottom: 16, fontSize: 13 },
  successBanner: { display: "flex", alignItems: "center", gap: 8, color: "#0f9b8e", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "8px 12px", marginBottom: 16, fontSize: 13 },
  card:          { background: "white", border: "1px solid #eef0f3", borderRadius: 12, padding: 24, marginBottom: 20 },
  cardHeader:    { display: "flex", alignItems: "center", gap: 8, marginBottom: 16 },
  cardTitle:     { fontSize: 15, fontWeight: 600, color: "#1f2937", margin: 0 },
  form:          { display: "grid", gap: 12 },
  input:         { padding: "10px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 14, outline: "none" },
  createBtn:     { padding: "10px 16px", background: "#0f9b8e", color: "white", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer" },
  table:         { width: "100%", borderCollapse: "collapse" },
  tableHeader:   { borderBottom: "2px solid #eef0f3" },
  th:            { padding: "10px 12px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase" },
  tableRow:      { borderBottom: "1px solid #f3f4f6" },
  td:            { padding: "12px", fontSize: 14, color: "#1f2937" },
  badge:         { display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600 },
  deleteBtn:     { background: "transparent", border: "none", color: "#dc2626", cursor: "pointer", padding: 4, display: "flex", alignItems: "center" },
  empty:         { textAlign: "center", color: "#9ca3af", fontSize: 14, padding: 24 },
};