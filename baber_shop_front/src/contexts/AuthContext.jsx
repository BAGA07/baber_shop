import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import authService from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [salon, setSalon] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const data = await authService.me();
    setUser(data.user);
    setSalon(data.salon);
    return data;
  }, []);

  useEffect(() => {
    let active = true;

    async function initialize() {
      if (!localStorage.getItem("barber_shop_token")) {
        if (active) setLoading(false);
        return;
      }

      try {
        const data = await authService.me();

        if (active) {
          setUser(data.user);
          setSalon(data.salon);
        }
      } catch {
        localStorage.removeItem("barber_shop_token");

        if (active) {
          setUser(null);
          setSalon(null);
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    initialize();

    return () => {
      active = false;
    };
  }, []);

  const login = async (credentials) => {
    const data = await authService.login(credentials);
    setUser(data.user);
    setSalon(data.salon);
    return data;
  };

  const register = async (formData) => {
    const data = await authService.register(formData);
    setUser(data.user);
    setSalon(data.salon);
    return data;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setSalon(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, salon, loading, login, register, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth doit être utilisé dans AuthProvider.");
  }

  return context;
}
