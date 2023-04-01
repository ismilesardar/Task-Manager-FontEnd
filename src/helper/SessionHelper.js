class SessionFunction {
  setToken(token) {
    localStorage.setItem("token", token);
  }
  getToken() {
    return localStorage.getItem("token");
  }
  setUserDetails(user) {
    localStorage.setItem("user", JSON.stringify(user));
  }
  getUserDetails() {
    return JSON.parse(localStorage.getItem("user"));
  }
  removeSession = () => {
    localStorage.clear();
    window.location.href = "/";
  };
}

export const {
  setToken,
  getToken,
  setUserDetails,
  getUserDetails,
  removeSession,
} = new SessionFunction();
