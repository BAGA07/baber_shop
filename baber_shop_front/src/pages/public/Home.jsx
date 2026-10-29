import { Link } from "react-router-dom";
import { Scissors, Users, Clock, ArrowRight } from "lucide-react";
import "./Home.css";

export default function Home() {
  return (
    <div className="public-home">
      <header className="public-header">
        <Link to="/" className="public-logo">
          <span className="public-logo-icon">
            <Scissors size={24} />
          </span>
          <span>Barber Shop</span>
        </Link>

        <Link to="/login" className="manager-link">
          Espace gérant
        </Link>
      </header>

      <main>
        <section className="public-hero">
          <div className="hero-content">
            <span className="hero-tag">
              <span className="hero-dot" />
              Votre prochain rendez-vous, simplifié
            </span>

            <h1>
              Moins d’attente,
              <br />
              <span>plus de style.</span>
            </h1>

            <p>
              Découvrez les salons de coiffure près de chez vous,
              choisissez votre prestation et suivez votre tour
              directement depuis votre téléphone.
            </p>

            <a href="#salons" className="primary-button">
              Découvrir les salons
              <ArrowRight size={18} />
            </a>

            <div className="hero-benefits">
              <span><Users size={17} /> Sans compte obligatoire</span>
              <span><Clock size={17} /> Suivi de la file</span>
            </div>
          </div>

          <div className="hero-illustration" aria-hidden="true">
            <div className="hero-circle">
              <Scissors size={100} strokeWidth={1.2} />
            </div>
            <div className="hero-card">
              <span className="hero-card-icon">
                <Clock size={20} />
              </span>
              <div>
                <strong>Votre temps compte</strong>
                <p>Suivez votre position dans la file</p>
              </div>
            </div>
          </div>
        </section>

        <section id="salons" className="public-discovery">
          <span className="section-eyebrow">SIMPLE ET PRATIQUE</span>
          <h2>Votre salon, à portée de main</h2>
          <p>
            Retrouvez un salon participant ou scannez son QR code
            pour accéder directement à ses prestations et à sa file
            d’attente.
          </p>

          <div className="discovery-actions">
            <Link to="/salons" className="primary-button">
              Voir les salons
              <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </main>

      <footer className="public-footer">
        <span>Barber Shop</span>
        <span>La coiffure, plus simplement.</span>
      </footer>
    </div>
  );
}
