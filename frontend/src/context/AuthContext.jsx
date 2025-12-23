import { createContext, useEffect, useState } from "react";
import api from "../assets/api/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  console.log("AUTH PROVIDER MOUNTED");

  const [user, setUser] = useState(null);
  const [foodPartner, setFoodPartner] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= RESTORE SESSION ================= */
const fetchAuth = async () => {
  try {
    const resUser = await api.get("/auth/user/me");
    console.log("USER ME RESPONSE:", resUser.data);
    setUser(resUser.data.user);
    setFoodPartner(null);
    setLoading(false);
    return;
  } catch {}

  try {
    const resPartner = await api.get("/auth/food-partner/me");
    setFoodPartner(resPartner.data.foodPartner);
    setUser(null);
    setLoading(false);
    return;
  } catch {}

  // Only here you are truly unauthenticated
  setUser(null);
  setFoodPartner(null);
  setLoading(false);
};


  useEffect(() => {
    fetchAuth();
  }, []);

  /* ================= LOGIN ================= */
  const loginUser = async (email, password) => {
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

  /* ================= LOGOUT ================= */
  const logout = async () => {
    try {
      if (user) {
        await api.get("/auth/user/logout", { withCredentials: true });
      }
      if (foodPartner) {
        await api.get("/auth/food-partner/logout", { withCredentials: true });
      }
    } catch {}

    setUser(null);
    setFoodPartner(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        foodPartner,
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
