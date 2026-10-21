
import api from "./api";

const authService = {
  async register(data) {
    const response = await api.post("/register", data);

    if (response.data.token) {
      localStorage.setItem("barber_shop_token", response.data.token);
    }

    return response.data;
  },

  async login(data) {
    const response = await api.post("/login", data);

    if (response.data.token) {
      localStorage.setItem("barber_shop_token", response.data.token);
    }

    return response.data;
  },

  async me() {
    const response = await api.get("/me");
    return response.data;
  },

  async logout() {
    try {
      await api.post("/logout");
    } finally {
      localStorage.removeItem("barber_shop_token");
    }
  },
};

export default authService;
