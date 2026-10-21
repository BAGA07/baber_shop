
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Scissors, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const initialForm = {
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
  salon_name: "",
  salon_phone: "",
  salon_email: "",
  salon_address: "",
  salon_city: "Bamako",
};

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (form.password !== form.password_confirmation) {
      setError("Les deux mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);

    try {
      await register(form);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const data = err.response?.data;
      const validationErrors = data?.errors
        ? Object.values(data.errors).flat().join(" ")
        : "";

      setError(validationErrors || data?.message || "La création du salon a échoué.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="register-page">
      <header className="register-header">
        <Link to="/login" className="brand-inline">
          <span className="brand-logo small"><Scissors size={21} /></span>
          <span>Barber Shop</span>
        </Link>
        <span className="muted">Déjà inscrit ? <Link to="/login">Se connecter</Link></span>
      </header>

      <section className="register-card">
        <p className="eyebrow">BIENVENUE</p>
        <h1>Crée ton espace salon</h1>
        <p className="muted">Quelques informations suffisent pour commencer.</p>

        {error && <div className="alert-error" role="alert">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <h3>Informations du gérant</h3>

          <label htmlFor="name">Nom complet</label>
          <input id="name" name="name" value={form.name} onChange={handleChange} autoComplete="name" required />

          <label htmlFor="email">E-mail de connexion</label>
          <input id="email" name="email" type="email" value={form.email} onChange={handleChange} autoComplete="email" required />

          <label htmlFor="password">Mot de passe (8 caractères minimum)</label>
          <div className="password-field">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
              minLength={8}
              required
            />
            <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)} aria-label="Afficher ou masquer le mot de passe">
              {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
            </button>
          </div>

          <label htmlFor="password_confirmation">Confirmer le mot de passe</label>
          <input
            id="password_confirmation"
            name="password_confirmation"
            type={showPassword ? "text" : "password"}
            value={form.password_confirmation}
            onChange={handleChange}
            autoComplete="new-password"
            required
          />

          <div className="form-divider" />
          <h3>Informations du salon</h3>

          <label htmlFor="salon_name">Nom du salon</label>
          <input id="salon_name" name="salon_name" value={form.salon_name} onChange={handleChange} required />

          <div className="form-grid">
            <div>
              <label htmlFor="salon_phone">Téléphone</label>
              <input id="salon_phone" name="salon_phone" type="tel" value={form.salon_phone} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="salon_city">Ville</label>
              <input id="salon_city" name="salon_city" value={form.salon_city} onChange={handleChange} required />
            </div>
          </div>

          <label htmlFor="salon_email">E-mail du salon (facultatif)</label>
          <input id="salon_email" name="salon_email" type="email" value={form.salon_email} onChange={handleChange} />

          <label htmlFor="salon_address">Adresse du salon (facultatif)</label>
          <input id="salon_address" name="salon_address" value={form.salon_address} onChange={handleChange} />

          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? "Création en cours..." : "Créer mon salon"}
          </button>
        </form>

        <p className="auth-switch">
          En créant ton compte, tu deviens le gérant de ce salon.
        </p>
      </section>
    </main>
  );
}
