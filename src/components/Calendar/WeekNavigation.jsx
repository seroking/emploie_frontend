export default function WeekNavigation({
  onPrev,
  onNext,
  canGoPrev,
  canGoNext,
  currentSemaine,
  annee_scolaire_nom,
  semaines,
  onWeekSelect,
}) {
  return (
    <div className="flex justify-between items-center mb-8">
      <button
        className={`px-6 py-3 rounded-lg text-white font-medium transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg ${
          !canGoPrev ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        }`}
        style={{
          background: "linear-gradient(to right, #4834CD 0%, #AA9DFF 100%)",
          boxShadow: "0 4px 15px rgba(72, 52, 205, 0.4)",
        }}
        onClick={onPrev}
        disabled={!canGoPrev}
      >
        Semaine précédente
      </button>

      <div className="text-center flex flex-col items-center">
        <div className="mb-2">
          <select
            onChange={(e) => onWeekSelect(e.target.value)}
            value={currentSemaine?.id || ""}
            className="text-l font-bold text-gray-800 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {semaines.map((semaine) => (
              <option key={semaine.id} value={semaine.id}>
                <h2 className="text-xl font-bold text-gray-800">Semaine {semaine.numero_semaine}</h2>
              </option>
            ))}
          </select>
        </div>
        {currentSemaine && (
          <>
            <p className="text-sm text-gray-600">
              Du <b>Lundi</b>{" "}
              {new Date(currentSemaine.date_debut).toLocaleDateString()} au{" "}
              <b>Samedi</b>{" "}
              {new Date(currentSemaine.date_fin).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-600">
              Année scolaire : {annee_scolaire_nom}
            </p>
          </>
        )}
      </div>

      <button
        className={`px-6 py-3 rounded-lg text-white font-medium transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg ${
          !canGoNext ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        }`}
        style={{
          background: "linear-gradient(to right, #4834CD 0%, #AA9DFF 100%)",
          boxShadow: "0 4px 15px rgba(72, 52, 205, 0.4)",
        }}
        onClick={onNext}
        disabled={!canGoNext}
      >
        Semaine suivante
      </button>
    </div>
  );
}
