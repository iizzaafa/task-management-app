import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, UserPlus, AlertCircle } from "lucide-react";
import api from "../api/axios";
import SplitLayout from "../components/SplitLayout";
import InputField from "../components/InputField";
import Button from "../components/Button";
import { validateEmail, validatePassword } from "../utils/validation";

export default function Login() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const navigate                = useNavigate();

  const handleSubmit = async () => {
    setError("");

    const emailError = validateEmail(email);
    if (emailError) { setError(emailError); return; }

    const passwordError = validatePassword(password);
    if (passwordError) { setError(passwordError); return; }

    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", {
        email: email.trim().toLowerCase(),
        password,
      });

      if (!data.access_token || !data.role || !data.email) {
        setError("Invalid server response");
        return;
      }

      sessionStorage.setItem("token", data.access_token);
      sessionStorage.setItem("role",  data.role);
      sessionStorage.setItem("email", data.email);

      setPassword("");

      navigate("/");
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Invalid email or password");
      } else if (err.response?.status === 400) {
        setError(err.response.data?.error || "Invalid input");
      } else if (err.response?.status >= 500) {
        setError("Server error. Please try again later");
      } else if (err.code === "ERR_NETWORK") {
        setError("Cannot connect to server");
      } else {
        setError("Login failed. Please try again");
      }
      setPassword("");
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
      <h2 style={s.heading}>Welcome Back</h2>
      <p style={s.sub}>SIGN IN TO YOUR ACCOUNT</p>

      {error && (
        <div style={s.errorBox}>
          <AlertCircle size={14} /> {error}
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
        autoComplete="current-password"
      />

      <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
        <Button
          label="REGISTER"
          onClick={() => navigate("/register")}
          color="#374151"
          icon={<UserPlus size={15} />}
          disabled={loading}
        />
        <Button
          label={loading ? "SIGNING IN..." : "LOGIN"}
          onClick={handleSubmit}
          color="#0f9b8e"
          icon={<LogIn size={15} />}
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
};