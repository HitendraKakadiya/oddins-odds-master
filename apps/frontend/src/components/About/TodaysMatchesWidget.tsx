

export default function TodaysMatchesWidget() {
  const matches = [
    {
      league: { name: 'Brazil - Gaucho 1', flag: '🇧🇷' },
      home: 'Guarany de Bagé',
      away: 'Monsoon',
      time: '03:30',
      id: 1
    },
    {
      league: { name: 'Australia - A-League', flag: '🇦🇺' },
      home: 'Wellington Phoenix',
      away: 'Melbourne Victory FC',
      time: '11:30',
      id: 2
    }
  ];

  return (
    <div className="bg-brand-indigo rounded-xl overflow-hidden shadow-lg mt-0 lg:mt-8">
      <div className="bg-brand-indigo p-4 text-center">
        <h3 className="text-white font-bold text-base">Today&apos;s Matches!</h3>
      </div>
      <div className="p-3 bg-brand-indigo space-y-3">
        {matches.map((match) => (
          <div key={match.id} className="bg-white rounded-lg p-3 shadow-sm">
            <div className="flex items-center justify-between mb-2 border-b border-gray-100 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-base">{match.league.flag}</span>
                <span className="text-sm font-bold text-gray-700">{match.league.name}</span>
              </div>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center text-[10px]">🛡️</div> 
                  <span className="text-sm font-medium text-gray-800">{match.home}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-100 rounded-full flex items-center justify-center text-[10px]">🛡️</div>
                  <span className="text-sm font-medium text-gray-800">{match.away}</span>
                </div>
              </div>
              <div className="text-sm font-bold text-gray-500">
                {match.time}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
