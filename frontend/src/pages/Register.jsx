import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, UserPlus, AlertCircle, CheckCircle } from "lucide-react";
import api from "../api/axios";
import SplitLayout from "../components/SplitLayout";
import InputField from "../components/InputField";
import Button from "../components/Button";
import PasswordStrength from "../components/PasswordStrength";
import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from "../utils/validation";

export default function Register() {
  const [email, setEmail]                     = useState("");
  const [password, setPassword]               = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError]                     = useState("");
  const [success, setSuccess]                 = useState("");
  const [loading, setLoading]                 = useState(false);
  const navigate                              = useNavigate();

  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    const emailError = validateEmail(email);
    if (emailError) { setError(emailError); return; }

    const passwordError = validatePassword(password);
    if (passwordError) { setError(passwordError); return; }

    const confirmError = validateConfirmPassword(password, confirmPassword);
    if (confirmError) { setError(confirmError); return; }

    setLoading(true);
    try {
      await api.post("/auth/register", {
        email: email.trim().toLowerCase(),
        password,
      });

      setPassword("");
      setConfirmPassword("");

      setSuccess("Account created successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      if (err.response?.status === 409) {
        setError("This email is already registered");
      } else if (err.response?.status === 400) {
        setError(err.response.data?.error || "Invalid input");
      } else if (err.response?.status >= 500) {
        setError("Server error. Please try again later");
      } else if (err.code === "ERR_NETWORK") {
        setError("Cannot connect to server");
      } else {
        setError("Registration failed. Please try again");
      }
      setPassword("");
      setConfirmPassword("");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) {
      handleSubmit();
    }
  };

  return (
    <SplitLayout>
      <h2 style={s.heading}>Create Account</h2>
      <p style={s.sub}>REGISTER A NEW ACCOUNT</p>

      {error && (
        <div style={s.errorBox}>
          <AlertCircle size={14} /> {error}
        </div>
      )}

      {success && (
        <div style={s.successBox}>
          <CheckCircle size={14} /> {success}
        </div>
      )}

      <InputField
        label="Email"
        type="email"
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onKeyPress={handleKeyPress}
        required
        disabled={loading}
        autoComplete="email"
      />
      <InputField
        label="Password"
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyPress={handleKeyPress}
        color="#555"
        required
        disabled={loading}
        autoComplete="new-password"
      />

      <PasswordStrength password={password} />

      <InputField
        label="Confirm Password"
        type="password"
        placeholder="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        onKeyPress={handleKeyPress}
        color="#555"
        required
        disabled={loading}
        autoComplete="new-password"
      />

      <p style={s.hint}>
        Admin accounts are created by existing administrators only.
      </p>

      <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
        <Button
          label="BACK TO LOGIN"
          onClick={() => navigate("/login")}
          color="#374151"
          icon={<LogIn size={15} />}
          disabled={loading}
        />
        <Button
          label={loading ? "CREATING..." : "REGISTER"}
          onClick={handleSubmit}
          color="#0f9b8e"
          icon={<UserPlus size={15} />}
          disabled={loading}
        />
      </div>
    </SplitLayout>
  );
}

const s = {
  heading:  { fontSize: 28, fontWeight: 600, color: "#0f9b8e", margin: "0 0 4px" },
  sub:      { fontSize: 12, color: "#9ca3af", letterSpacing: 1, marginBottom: 32 },
  errorBox: {
    display: "flex", alignItems: "center", gap: 8,
    background: "#fef2f2", border: "1px solid #fecaca",
    borderRadius: 8, padding: "10px 14px",
    marginBottom: 16, fontSize: 13, color: "#c62828",
  },
  successBox: {
    display: "flex", alignItems: "center", gap: 8,
    background: "#f0fdf4", border: "1px solid #bbf7d0",
    borderRadius: 8, padding: "10px 14px",
    marginBottom: 16, fontSize: 13, color: "#0f9b8e",
  },
  hint: {
    fontSize: 12, color: "#9ca3af",
    margin: "12px 0 8px", fontStyle: "italic",
  },
};