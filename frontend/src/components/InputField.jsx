import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";

const iconMap = {
  email: <Mail size={15} color="#aaa" />,
  password: <Lock size={15} color="#aaa" />,
  text: <User size={15} color="#aaa" />,
};

export default function InputField({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  onKeyPress,
  color = "#0f9b8e",
  required = false,
  disabled = false,
  autoComplete,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div style={{ marginBottom: 24, opacity: disabled ? 0.6 : 1 }}>
      <label style={{ fontSize: 13, color: color, fontWeight: "bold" }}>
        {label} {required && <span style={{ color: "red" }}>*</span>}
      </label>

      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        {/* Left icon */}
        <span style={{
          position: "absolute",
          left: 0,
          top: "50%",
          transform: "translateY(-50%)",
          marginTop: 2,
        }}>
          {iconMap[type] || null}
        </span>

        {/* Input */}
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onKeyPress={onKeyPress}
          disabled={disabled}
          autoComplete={autoComplete}
          style={{
            width: "100%",
            padding: "10px 30px",
            border: "none",
            borderBottom: "1px solid #ddd",
            outline: "none",
            fontSize: 14,
            boxSizing: "border-box",
            marginTop: 4,
            background: "transparent",
            cursor: disabled ? "not-allowed" : "text",
          }}
        />

        {/* Eye icon */}
        {isPassword && (
          <span
            onClick={() => !disabled && setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: 0,
              top: "50%",
              transform: "translateY(-50%)",
              cursor: disabled ? "not-allowed" : "pointer",
              marginTop: 2,
            }}
          >
            {showPassword
              ? <EyeOff size={16} color="#aaa" />
              : <Eye size={16} color="#aaa" />
            }
          </span>
        )}
      </div>
    </div>
  );
}