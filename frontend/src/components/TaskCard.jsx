export default function TaskCard({ task, showOwner, onEdit, onDelete, onStatusChange }) {
  const getStatusStyle = (status) => {
    switch (status) {
      case "completed":  return { bg: "#e8f5e9", color: "#2e7d32", label: "Completed"  };
      case "in_progress": return { bg: "#fff3e0", color: "#e65100", label: "In Progress" };
      default:           return { bg: "#f5f5f5", color: "#757575", label: "Pending"    };
    }
  };

  const borderColor = {
    completed:   "#2e7d32",
    in_progress: "#e65100",
    pending:     "#bdbdbd",
  };

  const status = getStatusStyle(task.status);

  return (
    <div
      style={{
        background: "white", borderRadius: 12, padding: 20, marginBottom: 16,
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        borderLeft: `4px solid ${borderColor[task.status] || "#bdbdbd"}`,
        transition: "transform 0.2s",
      }}
      onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
      onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
    >
      {/* Top row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <h3 style={{ margin: 0, fontSize: 16, color: "#333" }}>{task.title}</h3>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>

          {/* Admin: show task owner */}
          {showOwner && task.user_email && (
            <span style={{
              fontSize: 11, color: "#aaa", background: "#f5f5f5",
              padding: "2px 8px", borderRadius: 20,
            }}>
              {task.user_email}
            </span>
          )}

          <span style={{
            padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: "bold",
            background: status.bg, color: status.color,
          }}>
            {status.label}
          </span>
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p style={{ margin: "0 0 12px", fontSize: 13, color: "#888", lineHeight: 1.5 }}>
          {task.description}
        </p>
      )}

      {/* Status selector */}
      <select
        value={task.status}
        onChange={(e) => onStatusChange(task.id, e.target.value)}
        style={{
          padding: "6px 10px", borderRadius: 6, border: "1px solid #ddd", fontSize: 12,
          marginBottom: 12, cursor: "pointer", background: "#fafafa", width: "100%",
        }}
      >
        <option value="pending">Pending</option>
        <option value="in_progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>

      {/* Buttons */}
      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={() => onEdit(task)}
          style={{
            flex: 1, padding: "8px 0", background: "#0f9b8e", color: "white",
            border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: "bold",
          }}
        >
          ✏️ Edit
        </button>
        <button
          onClick={() => onDelete(task.id)}
          style={{
            flex: 1, padding: "8px 0", background: "#ff5252", color: "white",
            border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: "bold",
          }}
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
}