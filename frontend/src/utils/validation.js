export const validateEmail = (email) => {
  if (!email) return "Email is required";
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email)) return "Invalid email address";
  return null;
};

export const validatePassword = (password) => {
  if (!password) return "Password is required";
  if (password.length < 8) return "Password must be at least 8 characters";
  if (!/[A-Z]/.test(password)) return "Must have at least one uppercase letter";
  if (!/[a-z]/.test(password)) return "Must have at least one lowercase letter";
  if (!/[0-9]/.test(password)) return "Must have at least one number";
  if (!/[!@#$%^&*]/.test(password)) return "Must have at least one special character (!@#$%^&*)";
  return null;
};

export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) return "Please confirm your password";
  if (password !== confirmPassword) return "Passwords do not match";
  return null;
};

export const getPasswordStrength = (password) => {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[!@#$%^&*]/.test(password)) score++;
  if (score <= 2) return { label: "Weak", color: "red", width: "33%" };
  if (score <= 3) return { label: "Medium", color: "orange", width: "66%" };
  return { label: "Strong", color: "green", width: "100%" };
};

export const getPasswordRules = (password) => [
  { label: "At least 8 characters", passed: password.length >= 8 },
  { label: "One uppercase letter", passed: /[A-Z]/.test(password) },
  { label: "One lowercase letter", passed: /[a-z]/.test(password) },
  { label: "One number", passed: /[0-9]/.test(password) },
  { label: "One special character (!@#$%^&*)", passed: /[!@#$%^&*]/.test(password) },
];