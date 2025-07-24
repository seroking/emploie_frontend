import React from "react";

const WeekNavigationStagiaire = ({ onPrev, onNext, canGoPrev, canGoNext,nomGroupe }) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <button
        className={`px-6 py-3 rounded-lg text-white float-end font-medium transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg ${
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
      <h2 className="text-2xl font-bold text-center flex-grow">
        {nomGroupe ? `Groupe: ${nomGroupe}` : "Calendrier"}
      </h2>
      <button
        className={`px-6 py-3 rounded-lg text-white float-end font-medium transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg ${
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
