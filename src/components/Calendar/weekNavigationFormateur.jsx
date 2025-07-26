export default function WeekNavigationFormateur({
  onPrev,
  onNext,
  canGoPrev,
  canGoNext,
  semainesList,
  currentWeekId,
  onSelectWeek,
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

      <select
        className="px-4 py-3 rounded-lg border cursor-pointer border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-gray-700"
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
