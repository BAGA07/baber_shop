
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";

import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/services/authService";

export default function SignUpForm() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>(
    {},
  );

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    salon_name: "",
    salon_phone: "",
    salon_email: "",
    salon_address: "",
    salon_city: "Bamako",
  });

  function updateField(
    field: keyof typeof form,
    value: string,
  ) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setFieldErrors({});

    if (form.password !== form.password_confirmation) {
      setError("Les deux mots de passe ne correspondent pas.");
      return;
    }

    if (!acceptedTerms) {
      setError("Tu dois accepter les conditions pour créer ton compte.");
      return;
    }

    setLoading(true);

    try {
      await register(form);
      navigate("/", { replace: true });
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);

        if (err.data.errors) {
          setFieldErrors(err.data.errors);
        }
      } else {
        setError(
          "Impossible de contacter le serveur. Vérifie que l'API Laravel fonctionne.",
        );
      }
    } finally {
      setLoading(false);
    }
  }

  function renderErrors(field: keyof typeof form) {
    return fieldErrors[field]?.map((message, index) => (
      <p key={index} className="mt-1 text-sm text-error-500">
        {message}
      </p>
    ));
  }

  return (
    <div className="no-scrollbar flex w-full flex-1 flex-col overflow-y-auto lg:w-1/2">
      <div className="mx-auto mb-5 w-full max-w-md sm:pt-10">
        <Link
          to="/signin"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon className="size-5 rtl:rotate-180" />
          Retour à la connexion
        </Link>
      </div>

      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 text-title-sm font-semibold text-gray-800 sm:text-title-md dark:text-white/90">
              Créer mon salon
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Inscris ton salon pour commencer à gérer tes clients et tes
              réservations.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-5 rounded-lg border border-error-500/30 bg-error-500/10 px-4 py-3 text-sm text-error-600 dark:text-error-400"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-5">
              <h2 className="border-b border-gray-200 pb-2 text-sm font-semibold text-gray-800 dark:border-gray-800 dark:text-white/90">
                Informations du gérant
              </h2>

              <div>
                <Label>Nom complet *</Label>
                <Input
                  type="text"
                  placeholder="Ex. Aboubacar Bagayoko"
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  autoComplete="name"
                  required
                />
                {renderErrors("name")}
              </div>

              <div>
                <Label>E-mail du gérant *</Label>
                <Input
                  type="email"
                  placeholder="gerant@exemple.com"
                  value={form.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  autoComplete="email"
                  required
                />
                {renderErrors("email")}
              </div>

              <div>
                <Label>Mot de passe *</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Créer un mot de passe"
                    value={form.password}
                    onChange={(event) =>
                      updateField("password", event.target.value)
                    }
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label={
                      showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"
                    }
                    className="absolute inset-e-4 top-1/2 z-30 -translate-y-1/2 cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeIcon className="size-5 fill-gray-500 dark:fill-gray-400" />
                    ) : (
                      <EyeCloseIcon className="size-5 fill-gray-500 dark:fill-gray-400" />
                    )}
                  </button>
                </div>
                {renderErrors("password")}
              </div>

              <div>
                <Label>Confirmer le mot de passe *</Label>
                <div className="relative">
                  <Input
                    type={showConfirmation ? "text" : "password"}
                    placeholder="Saisir à nouveau le mot de passe"
                    value={form.password_confirmation}
                    onChange={(event) =>
                      updateField("password_confirmation", event.target.value)
                    }
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmation((current) => !current)}
                    aria-label={
                      showConfirmation
                        ? "Masquer la confirmation"
                        : "Afficher la confirmation"
                    }
                    className="absolute inset-e-4 top-1/2 z-30 -translate-y-1/2 cursor-pointer"
                  >
                    {showConfirmation ? (
                      <EyeIcon className="size-5 fill-gray-500 dark:fill-gray-400" />
                    ) : (
                      <EyeCloseIcon className="size-5 fill-gray-500 dark:fill-gray-400" />
                    )}
                  </button>
                </div>
                {renderErrors("password_confirmation")}
              </div>

              <h2 className="border-b border-gray-200 pb-2 pt-3 text-sm font-semibold text-gray-800 dark:border-gray-800 dark:text-white/90">
                Informations du salon
              </h2>

              <div>
                <Label>Nom du salon *</Label>
                <Input
                  type="text"
                  placeholder="Ex. Barber Shop Baga"
                  value={form.salon_name}
                  onChange={(event) =>
                    updateField("salon_name", event.target.value)
                  }
                  required
                />
                {renderErrors("salon_name")}
              </div>

              <div>
                <Label>Téléphone du salon *</Label>
                <Input
                  type="tel"
                  placeholder="Ex. 70 00 00 00"
                  value={form.salon_phone}
                  onChange={(event) =>
                    updateField("salon_phone", event.target.value)
                  }
                  autoComplete="tel"
                  required
                />
                {renderErrors("salon_phone")}
              </div>

              <div>
                <Label>E-mail du salon</Label>
                <Input
                  type="email"
                  placeholder="contact@monsalon.com"
                  value={form.salon_email}
                  onChange={(event) =>
                    updateField("salon_email", event.target.value)
                  }
                />
                {renderErrors("salon_email")}
              </div>

              <div>
                <Label>Adresse du salon</Label>
                <Input
                  type="text"
                  placeholder="Quartier, rue ou repère"
                  value={form.salon_address}
                  onChange={(event) =>
                    updateField("salon_address", event.target.value)
                  }
                />
                {renderErrors("salon_address")}
              </div>

              <div>
                <Label>Ville *</Label>
                <Input
                  type="text"
                  placeholder="Bamako"
                  value={form.salon_city}
                  onChange={(event) =>
                    updateField("salon_city", event.target.value)
                  }
                  required
                />
                {renderErrors("salon_city")}
              </div>

              <label className="flex cursor-pointer items-start gap-3 text-sm text-gray-500 dark:text-gray-400">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(event) => setAcceptedTerms(event.target.checked)}
                  className="mt-1 size-4 shrink-0 accent-brand-500"
                />
                <span>
                  J'accepte les conditions d'utilisation et la politique de
                  confidentialité.
                </span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center rounded-lg bg-brand-500 px-4 py-3 text-sm font-medium text-white shadow-theme-xs transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Création du compte..." : "Créer mon compte et mon salon"}
              </button>
            </div>
          </form>

          <div className="mt-5 pb-8">
            <p className="text-center text-sm text-gray-700 dark:text-gray-400">
              Tu as déjà un compte ?{" "}
              <Link
                to="/signin"
                className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
              >
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
