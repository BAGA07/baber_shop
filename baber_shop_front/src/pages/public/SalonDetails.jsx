
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  MapPin,
  Phone,
  Scissors,
  Users,
} from "lucide-react";
import api from "../../services/api";
import "./SalonDetails.css";

export default function SalonDetails() {
  const { slug } = useParams();

  const [salon, setSalon] = useState(null);
  const [services, setServices] = useState([]);
  const [queue, setQueue] = useState(null);
  const [selectedService, setSelectedService] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [confirmation, setConfirmation] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadSalon() {
      setLoading(true);
      setError("");

      try {
        const response = await api.get(
          `/public/salons/${encodeURIComponent(slug)}`
        );

        if (!active) return;

        setSalon(response.data.salon);
        setServices(response.data.services ?? []);
        setQueue(response.data.queue ?? null);
      } catch (err) {
        if (!active) return;

        setError(
          err.response?.data?.message ||
            "Impossible de charger ce salon. Vérifiez que le serveur fonctionne."
        );
      } finally {
        if (active) setLoading(false);
      }
    }

    loadSalon();

    return () => {
      active = false;
    };
  }, [slug]);

  async function handleJoinQueue(event) {
    event.preventDefault();
    setError("");
    setConfirmation(null);

    if (!selectedService) {
      setError("Veuillez sélectionner un service.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await api.post(
        `/public/salons/${encodeURIComponent(slug)}/queue`,
        {
          service_id: Number(selectedService),
          client_name: clientName.trim(),
          client_phone: clientPhone.trim(),
        }
      );

      setConfirmation(response.data);
      setQueue((current) =>
        current
          ? {
              ...current,
              waiting_count:
                Number(current.waiting_count ?? 0) + 1,
            }
          : current
      );
    } catch (err) {
      const validationErrors = err.response?.data?.errors;
      const firstValidationError = validationErrors
        ? Object.values(validationErrors).flat()[0]
        : null;

      setError(
        firstValidationError ||
          err.response?.data?.message ||
          "Impossible de rejoindre la file. Réessayez."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="salon-detail-page">
        <p className="salon-state">Chargement des informations du salon...</p>
      </main>
    );
  }

  if (error && !salon) {
    return (
      <main className="salon-detail-page">
        <Link to="/salons" className="salon-back-link">
          <ArrowLeft size={18} /> Retour aux salons
        </Link>
        <div className="salon-state salon-state-error">{error}</div>
      </main>
    );
  }

  if (!salon) return null;

  const formatPrice = (price) =>
    `${Number(price ?? 0).toLocaleString("fr-FR")} FCFA`;

  return (
    <div className="salon-detail-page">
      <header className="salon-detail-header">
        <Link to="/" className="salon-detail-brand">
          <span className="salon-detail-brand-icon">
            <Scissors size={22} />
          </span>
          Barber Shop
        </Link>
        <Link to="/login" className="salon-detail-manager">
          Espace gérant
        </Link>
      </header>

      <main className="salon-detail-main">
        <Link to="/salons" className="salon-back-link">
          <ArrowLeft size={18} />
          Tous les salons
        </Link>

        <section className="salon-detail-hero">
          <div className="salon-detail-avatar">
            {salon.logo ? (
              <img src={salon.logo} alt={`Logo de ${salon.name}`} />
            ) : (
              <Scissors size={42} />
            )}
          </div>

          <div className="salon-detail-identity">
            <span className="salon-detail-eyebrow">SALON DE COIFFURE</span>
            <h1>{salon.name}</h1>

            {salon.address || salon.city ? (
              <p className="salon-detail-location">
                <MapPin size={17} />
                {[salon.address, salon.city].filter(Boolean).join(", ")}
              </p>
            ) : null}

            {salon.phone && (
              <p className="salon-detail-location">
                <Phone size={17} />
                {salon.phone}
              </p>
            )}
          </div>
        </section>

        <section className="salon-queue-summary">
          <div className="salon-queue-icon">
            <Users size={25} />
          </div>
          <div>
            <p className="salon-queue-label">File d'attente aujourd'hui</p>
            <strong>{Number(queue?.waiting_count ?? 0)}</strong>
            <span>
              {" "}
              personne(s) en attente
            </span>
          </div>
          <span
            className={`salon-queue-status ${
              queue?.status === "open" ? "is-open" : "is-closed"
            }`}
          >
            {queue?.status === "open"
              ? "File ouverte"
              : "File non ouverte"}
          </span>
        </section>

        <div className="salon-detail-columns">
          <section className="salon-services-section">
            <div className="salon-section-heading">
              <span className="salon-detail-eyebrow">NOS PRESTATIONS</span>
              <h2>Services et tarifs</h2>
              <p>Choisissez le service qui vous convient.</p>
            </div>

            {services.length === 0 ? (
              <div className="salon-empty-services">
                Aucun service disponible pour le moment.
              </div>
            ) : (
              <div className="salon-services-list">
                {services.map((service) => (
                  <button
                    type="button"
                    key={service.id}
                    className={`salon-service-card ${
                      String(selectedService) === String(service.id)
                        ? "selected"
                        : ""
                    }`}
                    onClick={() => setSelectedService(String(service.id))}
                    aria-pressed={
                      String(selectedService) === String(service.id)
                    }
                  >
                    <span className="salon-service-check">
                      <Scissors size={19} />
                    </span>

                    <span className="salon-service-info">
                      <strong>{service.name}</strong>
                      {service.description && (
                        <span>{service.description}</span>
                      )}
                      <small>
                        <Clock3 size={14} />
                        {service.duration_minutes} min
                      </small>
                    </span>

                    <strong className="salon-service-price">
                      {formatPrice(service.price)}
                    </strong>
                  </button>
                ))}
              </div>
            )}
          </section>

          <aside className="salon-booking-panel">
            <span className="salon-detail-eyebrow">SANS COMPTE CLIENT</span>
            <h2>Rejoindre la file</h2>
            <p className="salon-booking-description">
              Renseignez vos coordonnées et choisissez votre prestation.
            </p>

            {confirmation ? (
              <div className="salon-confirmation">
                <CheckCircle2 size={42} />
                <h3>Demande enregistrée !</h3>
                <p>Votre place dans la file a été créée.</p>

                <div className="salon-confirmation-position">
                  <span>Votre numéro de passage</span>
                  <strong>
                    {confirmation.entry?.position ?? "—"}
                  </strong>
                </div>

                <p>
                  Service :{" "}
                  <strong>
                    {confirmation.entry?.service?.name ??
                      services.find(
                        (service) =>
                          String(service.id) === String(selectedService)
                      )?.name}
                  </strong>
                </p>

                {confirmation.tracking_token && (
                  <>
                    <p className="salon-tracking-note">
                      Conservez ce code de suivi pour retrouver votre position.
                    </p>
                    <code className="salon-tracking-token">
                      {confirmation.tracking_token}
                    </code>
                    <button
                      type="button"
                      className="salon-copy-token"
                      onClick={() => {
                        navigator.clipboard?.writeText(
                          confirmation.tracking_token
                        );
                      }}
                    >
                      Copier le code de suivi
                    </button>
                  </>
                )}

                <Link to="/salons" className="salon-return-button">
                  Voir les autres salons
                </Link>
              </div>
            ) : (
              <form onSubmit={handleJoinQueue} className="salon-booking-form">
                {error && (
                  <div className="salon-form-error" role="alert">
                    {error}
                  </div>
                )}

                <label htmlFor="client-name">Nom complet</label>
                <input
                  id="client-name"
                  type="text"
                  autoComplete="name"
                  value={clientName}
                  onChange={(event) => setClientName(event.target.value)}
                  placeholder="Votre nom"
                  maxLength={255}
                  required
                />

                <label htmlFor="client-phone">Numéro de téléphone</label>
                <input
                  id="client-phone"
                  type="tel"
                  autoComplete="tel"
                  value={clientPhone}
                  onChange={(event) => setClientPhone(event.target.value)}
                  placeholder="Ex. : 70 00 00 00"
                  maxLength={30}
                  required
                />

                <label>Prestation choisie</label>
                <div className="salon-selected-service">
                  {services.find(
                    (service) =>
                      String(service.id) === String(selectedService)
                  )?.name ?? "Sélectionnez un service ci-dessus"}
                </div>

                <button
                  type="submit"
                  className="salon-submit-button"
                  disabled={
                    submitting ||
                    !selectedService ||
                    services.length === 0 ||
                    queue?.status !== "open"
                  }
                >
                  {submitting
                    ? "Inscription en cours..."
                    : queue?.status === "open"
                      ? "Rejoindre la file"
                      : "File non disponible"}
                </button>

                <small className="salon-privacy-note">
                  Aucun compte client n'est nécessaire.
                </small>
              </form>
            )}
          </aside>
        </div>
      </main>

      <footer className="salon-detail-footer">
        Barber Shop — La coiffure, plus simplement.
      </footer>
    </div>
  );
}
