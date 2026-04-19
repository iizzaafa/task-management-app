import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ClipboardList, Clock, Loader,
  CheckCircle2, AlertTriangle,
} from "lucide-react";

import api from "../api/axios";
import { isAdmin, logout } from "../utils/auth";
import { getUserDisplayName } from "../utils/format";
import SideBar from "../components/SideBar";

const STATUS_META = {
  pending: {
    label: "Pending",
    dot: "#EF9F27",
    pillBg: "#FAEEDA",
    pillText: "#633806",
  },
  in_progress: {
    label: "In progress",
    dot: "#378ADD",
    pillBg: "#E6F1FB",
    pillText: "#0C447C",
  },
  completed: {
    label: "Completed",
    dot: "#1D9E75",
    pillBg: "#E1F5EE",
    pillText: "#085041",
  },
};

const STAT_CARDS = [
  {
    key: "total",
    label: "Total",
    subtitle: "all tasks",
    Icon: ClipboardList,
    iconBg: "#F1EFE8",
    iconColor: "#444441",
    valueColor: "#1f2937",
  },
  {
    key: "pending",
    label: "Pending",
    subtitle: "not started",
    Icon: Clock,
    iconBg: "#FAEEDA",
    iconColor: "#854F0B",
    valueColor: "#854F0B",
  },
  {
    key: "in_progress",
    label: "In progress",
    subtitle: "active now",
    Icon: Loader,
    iconBg: "#E6F1FB",
    iconColor: "#185FA5",
    valueColor: "#185FA5",
  },
  {
    key: "completed",
    label: "Completed",
    subtitle: "done",
    Icon: CheckCircle2,
    iconBg: "#E1F5EE",
    iconColor: "#0F6E56",
    valueColor: "#0F6E56",
  },
];

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");

  const admin = isAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.get("/tasks");
        const data = res.data;
        const safeTasks = Array.isArray(data) ? data : data?.tasks || [];
        setTasks(safeTasks);
      } catch (err) {
        if (err.response?.status !== 401) {
          setError(err.response?.data?.error || "Failed to load tasks");
        }
        setTasks([]);
      }
    };

    fetchTasks();
  }, []);

  const safeTasks = Array.isArray(tasks) ? tasks : [];

  const counts = {
    total: safeTasks.length,
    pending: safeTasks.filter(t => t.status === "pending").length,
    in_progress: safeTasks.filter(t => t.status === "in_progress").length,
    completed: safeTasks.filter(t => t.status === "completed").length,
  };

  const completionPct =
    counts.total === 0
      ? 0
      : Math.round((counts.completed / counts.total) * 100);

  const recentTasks = [...safeTasks].slice(-5).reverse();

  return (
    <div style={styles.page}>
      <SideBar onLogout={() => logout(navigate)} />

      <main style={styles.main}>
        <header style={styles.header}>
          <h2 style={styles.title}>Dashboard</h2>
          <p style={styles.subtitle}>
            {admin ? "Overview of all users' tasks" : "Overview of your tasks"}
          </p>
        </header>

        {error && (
          <div style={styles.error}>
            <AlertTriangle size={14} />
            {error}
          </div>
        )}

        <section style={styles.statGrid}>
          {STAT_CARDS.map(card => (
            <StatCard
              key={card.key}
              {...card}
              value={counts[card.key]}
            />
          ))}
        </section>

        <section style={styles.bottomGrid}>
          <TaskList
            tasks={recentTasks}
            admin={admin}
            onViewAll={() => navigate("/tasks")}
          />

          <ProgressCard
            percentage={completionPct}
            completed={counts.completed}
            total={counts.total}
          />
        </section>
      </main>
    </div>
  );
}

function StatCard({ label, value, subtitle, Icon, iconBg, iconColor, valueColor }) {
  return (
    <div style={styles.card}>
      <div style={{ ...styles.icon, background: iconBg, color: iconColor }}>
        <Icon size={16} />
      </div>

      <p style={styles.cardLabel}>{label}</p>
      <p style={{ ...styles.cardValue, color: valueColor }}>{value}</p>
      <p style={styles.cardSubtitle}>{subtitle}</p>
    </div>
  );
}

function TaskList({ tasks, admin, onViewAll }) {
  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <h3 style={styles.cardTitle}>Recent tasks</h3>
        <button onClick={onViewAll} style={styles.linkBtn}>
          View all →
        </button>
      </div>

      {tasks.length === 0 ? (
        <div style={styles.empty}>No tasks yet.</div>
      ) : (
        tasks.map((task, i) => (
          <TaskRow
            key={task.id}
            task={task}
            admin={admin}
            isLast={i === tasks.length - 1}
          />
        ))
      )}
    </div>
  );
}

function TaskRow({ task, admin, isLast }) {
  const meta = STATUS_META[task.status] || STATUS_META.pending;
  const userDisplay = getUserDisplayName(task.user_email, task.user_id);

  return (
    <div style={{ ...styles.row, borderBottom: isLast ? "none" : "1px solid #eee" }}>
      <span style={{ ...styles.dot, background: meta.dot }} />

      <div style={styles.rowContent}>
        {admin && (
          <p style={styles.userLabel}>{userDisplay}</p>
        )}
        <p style={styles.taskTitle}>{task.title}</p>
        {task.description && (
          <p style={styles.taskDesc}>{task.description}</p>
        )}
      </div>

      <span style={{ ...styles.statusPill, background: meta.pillBg, color: meta.pillText }}>
        {meta.label}
      </span>
    </div>
  );
}

function ProgressCard({ percentage, completed, total }) {
  const radius = 46;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (percentage / 100) * circ;

  const remaining = Math.max(total - completed, 0);

  return (
    <div style={styles.card}>
      <h3 style={styles.cardTitle}>Progress</h3>

      <div style={styles.progressBox}>
        <svg width="120" height="120">
          <circle cx="60" cy="60" r={radius} stroke="#eee" strokeWidth="10" fill="none" />
          <circle
            cx="60"
            cy="60"
            r={radius}
            stroke="#0F6E56"
            strokeWidth="10"
            fill="none"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            transform="rotate(-90 60 60)"
          />
          <text x="60" y="55" textAnchor="middle" fontSize="20">
            {percentage}%
          </text>
        </svg>

        <p style={styles.legend}>
          Done: {completed} | Remaining: {remaining}
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: { display: "flex", minHeight: "100vh", background: "#f9fafb" },
  main: { flex: 1, padding: 32 },

  header: { marginBottom: 24 },
  title: { fontSize: 22, fontWeight: 600 },
  subtitle: { fontSize: 13, color: "#666" },

  error: {
    display: "flex",
    gap: 8,
    padding: 10,
    background: "#fee2e2",
    borderRadius: 8,
    marginBottom: 16,
    color: "#991b1b",
  },

  statGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 12,
    marginBottom: 24,
  },

  bottomGrid: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: 12,
  },

  card: {
    background: "#fff",
    borderRadius: 12,
    padding: 16,
    border: "1px solid #eee",
  },

  icon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  cardLabel: { fontSize: 12, color: "#666" },
  cardValue: { fontSize: 24, fontWeight: 600 },
  cardSubtitle: { fontSize: 11, color: "#999" },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  cardTitle: { fontSize: 14, fontWeight: 600 },
  linkBtn: { border: "none", background: "none", color: "#0ea5a4", cursor: "pointer" },

  empty: { textAlign: "center", padding: 20, color: "#999" },

  row: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: 10,
  },

  rowContent: { flex: 1, minWidth: 0 },

  userLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: "#0f9b8e",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    margin: 0,
    marginBottom: 2,
  },

  taskTitle: { fontSize: 14, fontWeight: 500, margin: 0 },
  taskDesc: { fontSize: 12, color: "#666", margin: 0, marginTop: 2 },

  dot: { width: 8, height: 8, borderRadius: "50%", flexShrink: 0 },

  statusPill: {
    padding: "2px 8px",
    borderRadius: 20,
    fontSize: 11,
    flexShrink: 0,
  },

  progressBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  legend: { fontSize: 12, color: "#666", marginTop: 10 },
};