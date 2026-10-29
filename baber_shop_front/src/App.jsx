
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/public/Home";
import Salons from "./pages/public/Salons";
import SalonDetails from "./pages/public/SalonDetails";
import "./App.css";

function AppRoutes() {
  return (
    <Routes>
      {/* Espace public des clients */}
      <Route path="/" element={<Home />} />

      <Route path="/salons" element={<Salons />} />
      <Route path="/salons/:slug" element={<SalonDetails />} />

      {/* Accès gérant conservé */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>

      {/* Une URL inconnue revient à l'accueil public */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
