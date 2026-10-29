
import PageMeta from "@/components/common/PageMeta";
import { useAuth } from "@/context/AuthContext";

const metrics = [
  {
    title: "Clients",
    description: "Clients enregistrés",
    icon: "👥",
  },
  {
    title: "Rendez-vous",
    description: "Rendez-vous du jour",
    icon: "📅",
  },
  {
    title: "Recettes",
    description: "Chiffre d'affaires du jour",
    icon: "💰",
  },
  {
    title: "Prestations",
    description: "Prestations réalisées aujourd'hui",
    icon: "✂️",
  },
];

export default function Ecommerce() {
  const { user, salon } = useAuth();

  const today = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <PageMeta
        title="Tableau de bord | Barber Shop"
        description="Tableau de bord de gestion de votre salon de coiffure"
      />

      <div className="space-y-6">
        {/* En-tête */}
        <section className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {today}
              </p>

              <h1 className="mt-2 text-2xl font-bold text-gray-800 dark:text-white/90 sm:text-3xl">
                Bonjour, {user?.name || "Bienvenue"} !
              </h1>

              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Voici l'espace de gestion de votre salon.
              </p>
            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-3xl dark:bg-brand-500/10">
              ✂️
            </div>
          </div>
        </section>

        {/* Informations du salon */}
        <section className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-xl dark:bg-gray-800">
              🏪
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                {salon?.name || "Votre salon"}
              </h2>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Salon connecté au compte de {user?.name || "votre gérant"}.
              </p>

              <div className="mt-3 flex flex-col gap-1 text-sm text-gray-600 dark:text-gray-300 sm:flex-row sm:flex-wrap sm:gap-x-6">
                {salon?.phone && <p>Téléphone : {salon.phone}</p>}
                {salon?.email && <p>Email : {salon.email}</p>}
                {salon?.city && <p>Ville : {salon.city}</p>}
                {salon?.address && <p>Adresse : {salon.address}</p>}
              </div>
            </div>
          </div>
        </section>

        {/* Indicateurs du salon */}
        <section>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Vue d'ensemble
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Les indicateurs seront alimentés par les données réelles du salon.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric) => (
              <article
                key={metric.title}
                className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {metric.title}
                    </p>

                    <p className="mt-3 text-3xl font-bold text-gray-800 dark:text-white/90">
                      —
                    </p>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-xl dark:bg-gray-800">
                    {metric.icon}
                  </div>
                </div>

                <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                  {metric.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Prochains rendez-vous */}
        <section className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Prochains rendez-vous
            </h2>

            <span className="text-xs text-gray-500 dark:text-gray-400">
              En attente de connexion aux données
            </span>
          </div>

          <div className="mt-5 rounded-xl border border-dashed border-gray-300 px-4 py-10 text-center dark:border-gray-700">
            <div className="text-3xl">📅</div>

            <p className="mt-3 font-medium text-gray-800 dark:text-white/90">
              Aucun rendez-vous affiché pour le moment
            </p>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Cette zone affichera les rendez-vous enregistrés dans Barber Shop
              lorsque le module de réservation sera connecté.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
