// AuthContext.tsx
import React, { createContext, useState, useEffect, useContext } from "react";
import { IUser, AuthContextType } from "../utils/types";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const navigate = useNavigate();

  // On app load, fetch user info from /profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/auth/profile`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (res.ok) {
          const userData = await res.json();
          setUser(userData.data as IUser);
          setIsSignedIn(true);
        } else {
          setUser(null);
          setIsSignedIn(false);
          navigate("/login");
          localStorage.removeItem("token");
        }
      } catch (err: Error | unknown) {
        console.error("Failed to fetch user profile:", err);
        setUser(null);
        setIsSignedIn(false);
        navigate("/login");
        localStorage.removeItem("token");
      }
    };

    fetchProfile();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isSignedIn, setUser, setIsSignedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
