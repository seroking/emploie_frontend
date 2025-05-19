export default function WeekNavigation({ currentWeek, setCurrentWeek }) {
  return (
    <div className="flex justify-between mb-8">
      <button 
        className="px-6 py-3 rounded-lg text-white font-medium transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
        style={{
          background: 'linear-gradient(to right, #4834CD 0%, #AA9DFF 100%)',
          boxShadow: '0 4px 15px rgba(72, 52, 205, 0.4)'
        }}
        onClick={() => setCurrentWeek(currentWeek.subtract(1, 'week'))}
      >
        Previous Week
      </button>
      <h2 className="text-xl font-bold flex items-center">
        Week of {currentWeek.format('MMMM D, YYYY')}
      </h2>
      <button 
        className="px-6 py-3 rounded-lg text-white font-medium transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
        style={{
          background: 'linear-gradient(to right, #4834CD 0%, #AA9DFF 100%)',
          boxShadow: '0 4px 15px rgba(72, 52, 205, 0.4)'
        }}
        onClick={() => setCurrentWeek(currentWeek.add(1, 'week'))}
      >
        Next Week
      </button>
    </div>
  );
}