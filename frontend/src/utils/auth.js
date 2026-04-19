export const getToken = () => sessionStorage.getItem("token");
export const getRole  = () => sessionStorage.getItem("role");
export const getEmail = () => sessionStorage.getItem("email");
export const isAdmin  = () => sessionStorage.getItem("role") === "admin";
export const isAuthenticated = () => !!sessionStorage.getItem("token");

export const logout = (navigate) => {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("role");
  sessionStorage.removeItem("email");

  if (navigate) {
    navigate("/login");
  } else {
    window.location.href = "/login";
  }
};