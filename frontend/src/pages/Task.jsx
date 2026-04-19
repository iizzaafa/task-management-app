import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2, X, Save, AlertTriangle } from "lucide-react";
import api from "../api/axios";
import { isAdmin, logout } from "../utils/auth";
import { getUserDisplayName } from "../utils/format";
import SideBar from "../components/SideBar";

const STATUS_META = {
  pending:     { label: "Pending",     pillBg: "#FAEEDA", pillText: "#633806", border: "#EF9F27" },
  in_progress: { label: "In progress", pillBg: "#E6F1FB", pillText: "#0C447C", border: "#378ADD" },
  completed:   { label: "Completed",   pillBg: "#E1F5EE", pillText: "#085041", border: "#1D9E75" },
};

export default function Tasks() {
  const [tasks,         setTasks]         = useState([]);
  const [users,         setUsers]         = useState([]);
  const [title,         setTitle]         = useState("");
  const [description,   setDescription]   = useState("");
  const [assignUserId,  setAssignUserId]  = useState("");
  const [editingTask,   setEditingTask]   = useState(null);
  const [error,         setError]         = useState("");
  const admin    = isAdmin();
  const navigate = useNavigate();

  const fetchTasks = () =>
    api.get("/tasks")
      .then(({ data }) => setTasks(data))
      .catch((err) => {
        if (err.response?.status !== 401) {
          setError(err.response?.data?.error || "Failed to load tasks");
        }
      });

  const fetchUsers = () => {
    if (!admin) return;
    api.get("/auth/admin/users")
      .then(({ data }) => {
        setUsers(data);
        const selfEmail = sessionStorage.getItem("email");
        const self = data.find(u => u.email === selfEmail);
        if (self) setAssignUserId(String(self.id));
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []);

  const addTask = async () => {
    if (!title.trim()) { setError("Title is required"); return; }
    try {
      const payload = { title, description };
      if (admin && assignUserId) {
        payload.user_id = parseInt(assignUserId, 10);
      }
      await api.post("/tasks", payload);
      setTitle("");
      setDescription("");
      setError("");
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add task");
    }
  };

  const deleteTask = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await api.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete task");
    }
  };

  const saveEdit = async () => {
    try {
      const payload = {
        title:       editingTask.title,
        description: editingTask.description,
        status:      editingTask.status,
      };
      if (admin && editingTask.user_id) {
        payload.user_id = parseInt(editingTask.user_id, 10);
      }
      await api.put(`/tasks/${editingTask.id}`, payload);
      setEditingTask(null);
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update task");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/tasks/${id}`, { status });
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update status");
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f9fafb" }}>
      <SideBar onLogout={() => logout(navigate)} />

      <main style={{ flex: 1, padding: 32, overflow: "auto" }}>
        <header style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 22, fontWeight: 600, color: "#1f2937", margin: "0 0 4px" }}>
            Tasks
          </h2>
          <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>
            {admin ? "Managing all users' tasks" : "Managing your tasks"}
          </p>
        </header>

        {error && (
          <div style={s.errorBanner}>
            <AlertTriangle size={14} /> {error}
          </div>
        )}

        <div style={s.card}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: "#1f2937", margin: "0 0 16px" }}>
            <Plus size={15} style={{ marginRight: 6, verticalAlign: "middle" }} />
            Add New Task
          </h3>
          <input
            placeholder="Task title *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={s.input}
          />
          <input
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={s.input}
          />

          {admin && (
            <div style={{ marginBottom: 10 }}>
              <label style={s.label}>Assign to:</label>
              <select
                value={assignUserId}
                onChange={(e) => setAssignUserId(e.target.value)}
                style={s.input}
              >
                <option value="">-- Select user --</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {getUserDisplayName(u.email, u.id)} ({u.role})
                  </option>
                ))}
              </select>
            </div>
          )}

          <button onClick={addTask} style={s.addBtn}>
            <Plus size={15} /> Add Task
          </button>
        </div>

        {editingTask && (
          <div style={{ ...s.card, border: "2px solid #0f9b8e", marginTop: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: "#0f9b8e", margin: "0 0 16px" }}>
              <Pencil size={15} style={{ marginRight: 6, verticalAlign: "middle" }} /> Edit Task
            </h3>
            <input
              value={editingTask.title}
              onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
              style={s.input}
              placeholder="Title"
            />
            <input
              value={editingTask.description || ""}
              onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
              style={s.input}
              placeholder="Description"
            />
            <select
              value={editingTask.status}
              onChange={(e) => setEditingTask({ ...editingTask, status: e.target.value })}
              style={s.input}
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            {admin && (
              <div style={{ marginBottom: 10 }}>
                <label style={s.label}>Assigned to:</label>
                <select
                  value={editingTask.user_id}
                  onChange={(e) => setEditingTask({ ...editingTask, user_id: e.target.value })}
                  style={s.input}
                >
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {getUserDisplayName(u.email, u.id)} ({u.role})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
              <button onClick={saveEdit} style={s.saveBtn}><Save size={14} /> Save</button>
              <button onClick={() => setEditingTask(null)} style={s.cancelBtn}><X size={14} /> Cancel</button>
            </div>
          </div>
        )}

        <div style={{ marginTop: 24 }}>
          {tasks.length === 0 ? (
            <div style={s.emptyState}>📭 No tasks yet. Add one above!</div>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                admin={admin}
                onEdit={setEditingTask}
                onDelete={deleteTask}
                onStatusChange={updateStatus}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
}

function TaskCard({ task, admin, onEdit, onDelete, onStatusChange }) {
  const meta = STATUS_META[task.status] ?? STATUS_META.pending;
  const userDisplay = getUserDisplayName(task.user_email, task.user_id);

  return (
    <div style={{ ...s.taskCard, borderLeft: `4px solid ${meta.border}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div style={{ flex: 1 }}>
          {admin && (
            <p style={s.userLabel}>{userDisplay}</p>
          )}
          <p style={s.taskTitle}>{task.title}</p>
          {task.description && <p style={s.taskDesc}>{task.description}</p>}
        </div>
        <span style={{ ...s.statusPill, background: meta.pillBg, color: meta.pillText }}>
          {meta.label}
        </span>
      </div>

      <select
        value={task.status}
        onChange={(e) => onStatusChange(task.id, e.target.value)}
        style={s.statusSelect}
      >
        <option value="pending">Pending</option>
        <option value="in_progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button onClick={() => onEdit(task)} style={s.editBtn}><Pencil size={13} /> Edit</button>
        <button onClick={() => onDelete(task.id)} style={s.deleteBtnTask}><Trash2 size={13} /> Delete</button>
      </div>
    </div>
  );
}

const s = {
  errorBanner:   { display: "flex", alignItems: "center", gap: 8, color: "#c62828", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "8px 12px", marginBottom: 16, fontSize: 13 },
  card:          { background: "white", border: "1px solid #eef0f3", borderRadius: 12, padding: "20px 24px" },
  label:         { display: "block", fontSize: 12, color: "#6b7280", fontWeight: 600, marginBottom: 4 },
  input:         { width: "100%", padding: "10px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 14, marginBottom: 10, boxSizing: "border-box", outline: "none" },
  addBtn:        { display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 20px", background: "#0f9b8e", color: "white", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 600, marginTop: 6 },
  saveBtn:       { display: "inline-flex", alignItems: "center", gap: 6, flex: 1, justifyContent: "center", padding: "10px 0", background: "#0f9b8e", color: "white", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 },
  cancelBtn:     { display: "inline-flex", alignItems: "center", gap: 6, flex: 1, justifyContent: "center", padding: "10px 0", background: "#f3f4f6", color: "#374151", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 },
  emptyState:    { textAlign: "center", color: "#9ca3af", fontSize: 14, padding: "60px 0" },
  taskCard:      { background: "white", border: "1px solid #eef0f3", borderRadius: 12, padding: 20, marginBottom: 12, transition: "box-shadow 0.2s" },

  userLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: "#0f9b8e",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    margin: 0,
    marginBottom: 4,
  },

  taskTitle:     { fontSize: 15, fontWeight: 600, color: "#1f2937", margin: 0, marginBottom: 4 },
  taskDesc:      { fontSize: 13, color: "#6b7280", margin: 0, marginBottom: 6 },
  statusPill:    { fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 20, whiteSpace: "nowrap" },
  statusSelect:  { width: "100%", padding: "8px 10px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 13, cursor: "pointer", background: "#fafafa" },
  editBtn:       { display: "inline-flex", alignItems: "center", gap: 5, flex: 1, justifyContent: "center", padding: "8px 0", background: "#0f9b8e", color: "white", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 600 },
  deleteBtnTask: { display: "inline-flex", alignItems: "center", gap: 5, flex: 1, justifyContent: "center", padding: "8px 0", background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 600 },
};