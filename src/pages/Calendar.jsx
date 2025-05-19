import { useState } from 'react';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import WeekNavigation from '../components/Calendar/WeekNavigation';
import DayColumn from '../components/Calendar/DayColumn';

dayjs.extend(weekday);
dayjs.extend(weekOfYear);

export default function Calendar() {
  const [currentWeek, setCurrentWeek] = useState(dayjs());

  const getDaysOfWeek = () => {
    const days = [];
    const startOfWeek = currentWeek.startOf('week').add(1, 'day');
    for (let i = 0; i < 6; i++) {
      days.push(startOfWeek.add(i, 'day'));
    }
    return days;
  };

  const weekDays = getDaysOfWeek();
  const groups = [
    { id: 1, nom: 'groupe 1', annee: '2025' },
    { id: 2, nom: 'groupe 2', annee: '2025' },
    { id: 3, nom: 'groupe 3', annee: '2025' }
  ];

  // Example: schedules[groupId][day] = [{ id, label }]
  const [schedules, setSchedules] = useState({});

  const handleAddSchedule = (groupId, day, seanceData) => {
    setSchedules(prev => {
      const key = `${groupId}-${day}`;
      const prevArr = prev[key] || [];
      if (prevArr.length >= 4) return prev; // max 4
      return {
        ...prev,
        [key]: [
          ...prevArr,
          { id: Date.now(), ...seanceData } // <-- spread seanceData!
        ]
      };
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e9e6ff] to-[#f7f8fa] py-12">
      <div className="w-full max-w-5xl bg-white/80 rounded-2xl shadow-xl border border-gray-100">
        <div className="sticky top-0 z-10 bg-white/80 rounded-t-2xl px-8 pt-8 pb-4">
          <WeekNavigation currentWeek={currentWeek} setCurrentWeek={setCurrentWeek} />
        </div>
        <div className="overflow-x-auto px-8 pb-8">
          <table className="w-full border-separate border-spacing-y-2">
            <thead>
              <tr>
                <th className="text-xs font-semibold text-gray-500 px-4 py-2 text-left bg-gradient-to-r from-[#edeaff] to-[#f7f8fa] rounded-l-xl">
                  Group
                </th>
                {weekDays.map(day => (
                  <th
                    key={day.format('DD-MM')}
                    className="text-xs font-semibold text-gray-500 px-4 py-2 bg-gradient-to-r from-[#edeaff] to-[#f7f8fa] rounded-xl"
                  >
                    {day.format('ddd D/MM')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {groups.map(group => (
                <tr key={group.id} className="align-top">
                  <td className="text-sm font-medium text-gray-700 px-4 py-4 bg-white rounded-l-xl shadow-sm">
                    {group.nom}
                  </td>
                  {weekDays.map(day => (
                    <DayColumn
                      key={`${group.id}-${day.format('DD-MM')}`}
                      groupId={group.id}
                      day={day.format('DD-MM')}
                      schedules={schedules[`${group.id}-${day.format('DD-MM')}`] || []}
                      onAdd={seanceData => handleAddSchedule(group.id, day.format('DD-MM'), seanceData)}
                    />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}