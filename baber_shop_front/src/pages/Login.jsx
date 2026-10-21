
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Scissors, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(form);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Impossible de se connecter. Vérifie tes identifiants."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-brand">
        <div className="brand-logo"><Scissors size={28} /></div>
        <p className="eyebrow">BARBER SHOP MANAGER</p>
        <h1>Ton salon.<br />Ton équipe.<br /><span>Ton succès.</span></h1>
        <p className="brand-description">
          Organise les rendez-vous, maîtrise ta file d'attente et développe ton activité.
        </p>
        <div className="brand-footer">Une gestion plus simple, chaque jour.</div>
      </section>

      <section className="auth-content">
        <div className="auth-card">
          <div className="mobile-logo"><Scissors size={24} /> Barber Shop</div>
          <p className="eyebrow">BON RETOUR</p>
          <h2>Connecte-toi</h2>
          <p className="muted">Accède à l'espace de gestion de ton salon.</p>

          {error && <div className="alert-error" role="alert">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <label htmlFor="email">Adresse e-mail</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="nom@exemple.com"
              value={form.email}
              onChange={handleChange}
              required
            />

            <label htmlFor="password">Mot de passe</label>
            <div className="password-field">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Ton mot de passe"
                value={form.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>

            <button className="btn-primary" type="submit" disabled={loading}>
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          <p className="auth-switch">
            Tu n'as pas encore de salon ? <Link to="/register">Créer mon salon</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
