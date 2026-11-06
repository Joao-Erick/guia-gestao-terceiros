import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api } from "./api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const [offline, setOffline] = useState(null);

  useEffect(() => {
    api("/api/me")
      .then((d) => setUser(d.user))
      .catch((e) => setOffline(e.message))
      .finally(() => setReady(true));
  }, []);

  const login = useCallback(async (body) => {
    const data = await api("/api/auth/login", { method: "POST", body });
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (body) => {
    const data = await api("/api/auth/register", { method: "POST", body });
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    await api("/api/auth/logout", { method: "POST" });
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, ready, offline, setUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
