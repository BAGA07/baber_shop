import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import authService, {
  type AuthResponse,
  type LoginData,
  type RegisterData,
  type Salon,
  type User,
} from "../services/authService";

interface AuthContextValue {
  user: User | null;
  salon: Salon | null;
  loading: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [salon, setSalon] = useState<Salon | null>(null);
  const [loading, setLoading] = useState(true);

  const applyAuthData = useCallback((data: AuthResponse) => {
    setUser(data.user);
    setSalon(data.salon);
  }, []);

  const refreshUser = useCallback(async () => {
    const data = await authService.me();
    applyAuthData(data);
  }, [applyAuthData]);

  useEffect(() => {
    let active = true;

    async function initialize() {
      if (!localStorage.getItem("barber_shop_token")) {
        setLoading(false);
        return;
      }

      try {
        const data = await authService.me();

        if (active) {
          applyAuthData(data);
        }
      } catch {
        localStorage.removeItem("barber_shop_token");

        if (active) {
          setUser(null);
          setSalon(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void initialize();

    return () => {
      active = false;
    };
  }, [applyAuthData]);

  async function login(data: LoginData) {
    const result = await authService.login(data);
    applyAuthData(result);
  }

  async function register(data: RegisterData) {
    const result = await authService.register(data);
    applyAuthData(result);
  }

  async function logout() {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setSalon(null);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        salon,
        loading,
        login,
        register,
        logout,
        refreshUser,
      }}
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
