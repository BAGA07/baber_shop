
import {
  CalendarDays,
  Clock3,
  Scissors,
  Users,
  LogOut,
  MapPin,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Dashboard() {
  const { user, salon, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login", { replace: true });
  }

  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <div className="brand-inline">
          <span className="brand-logo small"><Scissors size={21} /></span>
          <span>Barber Shop</span>
        </div>
        <button className="btn-logout" onClick={handleLogout}>
          <LogOut size={17} /> Déconnexion
        </button>
      </header>

      <section className="dashboard-content">
        <p className="eyebrow">ESPACE GÉRANT</p>
        <h1>Bonjour, {user?.name || "Gérant"} 👋</h1>
        <p className="muted">Voici l'espace de gestion de ton salon.</p>

        <section className="salon-banner">
          <div className="salon-icon"><Scissors size={28} /></div>
          <div>
            <p className="salon-label">TON SALON</p>
            <h2>{salon?.name || "Mon salon"}</h2>
            <p className="salon-location"><MapPin size={15} /> {salon?.city || "Ville non renseignée"}</p>
          </div>
          <span className="status-pill">Actif</span>
        </section>

        <div className="dashboard-grid">
          <article className="dashboard-tile">
            <span className="tile-icon"><CalendarDays /></span>
            <h3>Rendez-vous</h3>
            <p>Prépare la gestion des réservations.</p>
            <span className="tile-status">Module à construire</span>
          </article>

          <article className="dashboard-tile">
            <span className="tile-icon"><Clock3 /></span>
            <h3>File d'attente</h3>
            <p>Organise l'ordre de passage des clients.</p>
            <span className="tile-status">Module à construire</span>
          </article>

          <article className="dashboard-tile">
            <span className="tile-icon"><Users /></span>
            <h3>Équipe</h3>
            <p>Prépare la gestion des coiffeurs.</p>
            <span className="tile-status">Module à construire</span>
          </article>

          <article className="dashboard-tile">
            <span className="tile-icon"><Scissors /></span>
            <h3>Prestations</h3>
            <p>Prépare le catalogue de services.</p>
            <span className="tile-status">Module à construire</span>
          </article>
        </div>
      </section>
    </main>
  );
}
