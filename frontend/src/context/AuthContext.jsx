import { createContext, useEffect, useState } from "react";
import api from "../assets/api/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [foodPartner, setFoodPartner] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAuth = async () => {
  try {
    const resPartner = await api.get("/auth/food-partner/me");
    setFoodPartner(resPartner.data.foodPartner);
    setUser(null);
  } catch {
    try {
      const resUser = await api.get("/auth/user/me");
      setUser(resUser.data.user);
      setFoodPartner(null);
    } catch {
      setUser(null);
      setFoodPartner(null);
    }
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchAuth();
  }, []);

  // ---------- LOGIN ----------
  const login = async (email, password) => {
    const res = await api.post(
      "/auth/user/login",
      { email, password },
      { withCredentials: true }
    );

    setUser(res.data.user);
    setFoodPartner(null);
  };

  const loginFoodPartner = async (email, password) => {
    const res = await api.post(
      "/auth/food-partner/login",
      { email, password },
      { withCredentials: true }
    );

    setFoodPartner(res.data.foodPartner);
    setUser(null);
  };

  // ---------- LOGOUT ----------
  const logout = async () => {
    try {
      if (user) await api.get("/auth/user/logout", { withCredentials: true });
      if (foodPartner)
        await api.get("/auth/food-partner/logout", { withCredentials: true });
    } catch {}

    setUser(null);
    setFoodPartner(null);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        foodPartner,
        loading,
        login,
        loginFoodPartner,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
