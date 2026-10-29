
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";

import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";

import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/services/authService";

export default function SignInForm() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setFieldErrors({});
    setLoading(true);

    try {
      await login({ email, password });
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

  return (
    <div className="flex flex-1 flex-col">
      <div className="mx-auto w-full max-w-md pt-10">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon className="size-5 rtl:rotate-180" />
          Retour à l'accueil
        </Link>
      </div>

      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 text-title-sm font-semibold text-gray-800 sm:text-title-md dark:text-white/90">
              Connexion
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Connecte-toi à ton espace de gestion de salon.
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
            <div className="space-y-6">
              <div>
                <Label>
                  Adresse e-mail <span className="text-error-500">*</span>
                </Label>
                <Input
                  type="email"
                  placeholder="exemple@email.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  autoComplete="email"
                />
                {fieldErrors.email?.map((message, index) => (
                  <p key={index} className="mt-1 text-sm text-error-500">
                    {message}
                  </p>
                ))}
              </div>

              <div>
                <Label>
                  Mot de passe <span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Saisis ton mot de passe"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label={
                      showPassword
                        ? "Masquer le mot de passe"
                        : "Afficher le mot de passe"
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
                {fieldErrors.password?.map((message, index) => (
                  <p key={index} className="mt-1 text-sm text-error-500">
                    {message}
                  </p>
                ))}
              </div>

              <div>
                <Button
                  className="w-full"
                  size="sm"
                  disabled={loading}
                >
                  {loading ? "Connexion en cours..." : "Se connecter"}
                </Button>
              </div>
            </div>
          </form>

          <div className="mt-5">
            <p className="text-center text-sm font-normal text-gray-700 dark:text-gray-400">
              Tu n'as pas encore de compte ?{" "}
              <Link
                to="/signup"
                className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
              >
                Créer mon salon
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
