export default function Button({ label, onClick, color = "#0f9b8e", icon, disabled = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        flex: 1,
        padding: "12px 0",
        background: disabled ? "#9ca3af" : color,
        color: "white",
        border: "none",
        borderRadius: 4,
        cursor: disabled ? "not-allowed" : "pointer",
        fontSize: 14,
        fontWeight: "bold",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        opacity: disabled ? 0.7 : 1,
        transition: "opacity 0.2s, background 0.2s",
      }}
    >
      {icon && icon}
      {label}
    </button>
  );
}