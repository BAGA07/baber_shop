const API_URL = import.meta.env.VITE_API_URL;

export interface User {
  id: number;
  name: string;
  email: string;
  role?: string;
  salon_id?: number;
}

export interface Salon {
  id: number;
  name: string;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  city?: string | null;
}

export interface AuthResponse {
  token?: string;
  user: User;
  salon: Salon;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  salon_name: string;
  salon_phone: string;
  salon_email: string;
  salon_address: string;
  salon_city: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export class ApiError extends Error {
  data: {
    message?: string;
    errors?: Record<string, string[]>;
  };
  status: number;

  constructor(
    message: string,
    status: number,
    data: ApiError["data"],
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = localStorage.getItem("barber_shop_token");

  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");
  headers.set("Content-Type", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(
      data.message || "Une erreur est survenue.",
      response.status,
      data,
    );
  }

  return data as T;
}

const authService = {
  async register(form: RegisterData): Promise<AuthResponse> {
    const data = await request<AuthResponse>("/register", {
      method: "POST",
      body: JSON.stringify(form),
    });

    if (data.token) {
      localStorage.setItem("barber_shop_token", data.token);
    }

    return data;
  },

  async login(credentials: LoginData): Promise<AuthResponse> {
    const data = await request<AuthResponse>("/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    if (data.token) {
      localStorage.setItem("barber_shop_token", data.token);
    }

    return data;
  },

  async me(): Promise<AuthResponse> {
    return request<AuthResponse>("/me");
  },

  async logout(): Promise<void> {
    try {
      await request<unknown>("/logout", {
        method: "POST",
      });
    } finally {
      localStorage.removeItem("barber_shop_token");
    }
  },
};

export default authService;
