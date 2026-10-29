
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Scissors,
  Search,
  Store,
  RefreshCw,
} from "lucide-react";
import api from "../../services/api";
import "./Salons.css";

export default function Salons() {
  const [salons, setSalons] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadSalons() {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/public/salons");

      // Laravel paginate() retourne les résultats dans data.
      setSalons(response.data.data ?? []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Impossible de charger les salons. Vérifiez votre connexion."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSalons();
  }, []);

  const filteredSalons = salons.filter((salon) => {
    const text = `${salon.name ?? ""} ${salon.city ?? ""} ${
      salon.address ?? ""
    }`.toLowerCase();

    return text.includes(search.trim().toLowerCase());
  });

  return (
    <div className="salons-page">
      <header className="salons-header">
        <Link to="/" className="salons-brand">
          <span className="salons-brand-icon">
            <Scissors size={23} />
          </span>
          <span>Barber Shop</span>
        </Link>

        <Link to="/login" className="salons-manager-link">
          Espace gérant
        </Link>
      </header>

      <main className="salons-main">
        <Link to="/" className="salons-back">
          <ArrowLeft size={17} />
          Retour à l'accueil
        </Link>

        <section className="salons-intro">
          <span className="salons-eyebrow">TROUVEZ VOTRE SALON</span>
          <h1>Les salons de coiffure</h1>
          <p>
            Découvrez les salons participants et choisissez celui qui
            vous convient. La navigation est libre, sans compte obligatoire.
          </p>
        </section>

        <div className="salons-search">
          <Search size={20} />
          <input
            type="search"
            placeholder="Rechercher un salon, une ville..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Rechercher un salon"
          />
        </div>

        {!loading && !error && (
          <div className="salons-results-count">
            {filteredSalons.length} salon
            {filteredSalons.length !== 1 ? "s" : ""} trouvé
            {filteredSalons.length !== 1 ? "s" : ""}
          </div>
        )}

        {loading && (
          <div className="salons-message">
            <RefreshCw className="salons-spinner" size={28} />
            <p>Chargement des salons...</p>
          </div>
        )}

        {!loading && error && (
          <div className="salons-message salons-error">
            <p>{error}</p>
            <button onClick={loadSalons} className="salons-retry">
              Réessayer
            </button>
          </div>
        )}

        {!loading && !error && filteredSalons.length === 0 && (
          <div className="salons-message">
            <Store size={38} />
            <h2>
              {search
                ? "Aucun salon trouvé"
                : "Aucun salon disponible pour le moment"}
            </h2>
            <p>
              {search
                ? "Essayez un autre nom ou une autre ville."
                : "Les salons participants apparaîtront ici dès qu'ils seront actifs."}
            </p>
          </div>
        )}

        {!loading && !error && filteredSalons.length > 0 && (
          <div className="salons-grid">
            {filteredSalons.map((salon) => (
              <article className="salon-card" key={salon.id}>
                <div className="salon-card-cover">
                  {salon.logo ? (
                    <img
                      src={salon.logo}
                      alt={`Logo de ${salon.name}`}
                      className="salon-logo"
                    />
                  ) : (
                    <div className="salon-placeholder">
                      <Scissors size={38} />
                    </div>
                  )}
                </div>

                <div className="salon-card-body">
                  <h2>{salon.name}</h2>

                  <p className="salon-location">
                    <MapPin size={16} />
                    <span>
                      {[salon.address, salon.city]
                        .filter(Boolean)
                        .join(", ") || "Adresse non renseignée"}
                    </span>
                  </p>

                  <Link
                    to={`/salons/${salon.slug}`}
                    className="salon-details-link"
                  >
                    Découvrir ce salon
                    <ArrowRight size={17} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <footer className="salons-footer">
        Barber Shop — La coiffure, plus simplement.
      </footer>
    </div>
  );
}
