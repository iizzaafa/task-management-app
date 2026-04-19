export function getUserDisplayName(email, userId) {
  if (!email) return `User ${userId || "?"}`;

  const localPart = email.split("@")[0];

  return localPart
    .replace(/[._-]/g, " ")
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}