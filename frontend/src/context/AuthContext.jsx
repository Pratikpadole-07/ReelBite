import { createContext, useEffect, useState } from "react";
import api from "../assets/api/api";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [foodPartner, setFoodPartner] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAuth = async () => {
    setLoading(true);

    try {
      const resPartner = await api.get("/auth/food-partner/me");
      setFoodPartner(resPartner.data.foodPartner);
      setUser(null);
      setLoading(false);
      return;
    } catch {}

    try {
      const resUser = await api.get("/auth/user/me");
      setUser(resUser.data.user);
      setFoodPartner(null);
      setLoading(false);
      return;
    } catch {}

    setUser(null);
    setFoodPartner(null);
    setLoading(false);
  };

  useEffect(() => {
    fetchAuth();
  }, []);

  const loginUser = async (email, password) => {
    const res = await api.post("/auth/user/login", { email, password });
    setUser(res.data.user);
    setFoodPartner(null);
  };

  const loginFoodPartner = async (email, password) => {
    const res = await api.post("/auth/food-partner/login", { email, password });
    setFoodPartner(res.data.foodPartner);
    setUser(null);
  };

  const logout = async () => {
    try {
      if (user) await api.get("/auth/user/logout");
      if (foodPartner) await api.get("/auth/food-partner/logout");
    } catch {}

    setUser(null);
    setFoodPartner(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        foodPartner,
        setFoodPartner,
        loading,
        loginUser,
        loginFoodPartner,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
