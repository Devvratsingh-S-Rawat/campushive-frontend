import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On first load, check if there's a token from a previous session and
  // confirm it's still valid — this is what makes "stay logged in after
  // refresh" work, without trusting a stale token blindly.
  useEffect(() => {
    const token = localStorage.getItem("campushive_token");
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get("/auth/me")
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem("campushive_token");
        localStorage.removeItem("campushive_user");
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("campushive_token", res.data.access_token);
    setUser(res.data.user);
    return res.data.user;
  }

  async function signup({ email, password, name, role, college_name }) {
    const res = await api.post("/auth/signup", {
      email,
      password,
      name,
      role,
      college_name,
    });
    localStorage.setItem("campushive_token", res.data.access_token);
    setUser(res.data.user);
    return res.data.user;
  }

  function logout() {
    localStorage.removeItem("campushive_token");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Usage in any page: const { user, login, logout } = useAuth();
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
