import { CheckCircle, XCircle } from "lucide-react";
import { getPasswordStrength, getPasswordRules } from "../utils/validation";

export default function PasswordStrength({ password }) {
  const strength = getPasswordStrength(password);
  const rules = getPasswordRules(password);

  if (!password) return null;

  return (
    <div style={{ marginBottom: 16 }}>
      {/* Strength bar */}
      <div style={{ height: 4, borderRadius: 2, background: "#eee", marginBottom: 4 }}>
        <div style={{
          height: 4,
          borderRadius: 2,
          width: strength.width,
          background: strength.color,
          transition: "width 0.3s",
        }} />
      </div>
      <small style={{ color: strength.color, fontWeight: "bold" }}>
        Strength: {strength.label}
      </small>

      {/* Rules */}
      <div style={{
        background: "#f9f9f9",
        padding: 12,
        borderRadius: 8,
        marginTop: 8,
        fontSize: 12,
      }}>
        {rules.map((rule, i) => (
          <div key={i} style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            margin: "4px 0",
            color: rule.passed ? "#0f9b8e" : "#aaa",
          }}>
            {rule.passed
              ? <CheckCircle size={14} color="#0f9b8e" />
              : <XCircle size={14} color="#aaa" />
            }
            {rule.label}
          </div>
        ))}
      </div>
    </div>
  );
}