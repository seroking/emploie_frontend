const WeekNavigationStagiaire = ({
  onPrev,
  onNext,
  canGoPrev,
  canGoNext,
  nomGroupe,
  semainesList,
  currentWeekId,
  onSelectWeek,
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
      <button
        className={`px-6 py-3 rounded-lg text-white font-medium transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg ${
          !canGoPrev ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        }`}
        style={{
          background: "linear-gradient(to right, #2C3E50 0%, #3498DB 100%)",
          boxShadow: "0 4px 15px rgba(52, 152, 219, 0.4)",
        }}
        onClick={onPrev}
        disabled={!canGoPrev}
      >
        Semaine précédente
      </button>

      <div className="flex flex-col items-center flex-grow">
        <h2 className="text-2xl font-bold text-center mb-2">
          {nomGroupe ? `Groupe: ${nomGroupe}` : "Calendrier du groupe"}
        </h2>
        <select
          className="px-4 py-3 rounded-lg border cursor-pointer border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-gray-700 w-full max-w-xs"
          value={currentWeekId || ""}
          onChange={(e) => onSelectWeek(e.target.value)}
        >
          {semainesList.length === 0 && (
            <option value="" disabled>
              Aucune semaine disponible
            </option>
          )}
          {semainesList.map((week) => (
            <option key={week.id} value={week.id}>
              Semaine {week.numero_semaine}
            </option>
          ))}
        </select>
      </div>

      <button
        className={`px-6 py-3 rounded-lg text-white font-medium transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg ${
          !canGoNext ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        }`}
        style={{
          background: "linear-gradient(to right, #2C3E50 0%, #3498DB 100%)",
          boxShadow: "0 4px 15px rgba(52, 152, 219, 0.4)",
        }}
        onClick={onNext}
        disabled={!canGoNext}
      >
        Semaine suivante
      </button>
    </div>
  );
};

export default WeekNavigationStagiaire;
