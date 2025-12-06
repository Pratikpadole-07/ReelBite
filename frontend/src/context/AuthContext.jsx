import { createContext, useEffect, useState } from "react";
import api from "../assets/api/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [foodPartner, setFoodPartner] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🟦 Auto detect current auth (Cookie-based)
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
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAuth();
  }, []);

  // 🟩 User login
  const loginUser = (userData) => {
    setUser(userData);
    setFoodPartner(null);
  };

  // 🟧 Partner login
  const loginPartner = (partnerData) => {
    setFoodPartner(partnerData);
    setUser(null);
  };

  // 🔴 Logout
  const logout = async () => {
    try {
      if (foodPartner) await api.post("/auth/food-partner/logout");
      if (user) await api.post("/auth/logout");

      setUser(null);
      setFoodPartner(null);

      window.location.href = foodPartner
        ? "/food-partner/login"
        : "/user/login";
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        foodPartner,
        loading,
        setUser,
        setFoodPartner,
        loginUser,
        loginPartner,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
