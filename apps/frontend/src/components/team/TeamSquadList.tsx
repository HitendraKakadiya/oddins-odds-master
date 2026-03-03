import React from 'react';

interface SquadMember {
  id: number;
  name: string;
  position: string;
  number?: number;
  photo?: string;
}

interface TeamSquadListProps {
  squad: SquadMember[];
}

export default function TeamSquadList({ squad }: TeamSquadListProps) {
  // Mock players for high-fidelity demonstration matching the screenshots
  const mockSquad: SquadMember[] = [
    // Forwards
    { id: 1, name: 'Leandro Trossard', position: 'Forward', number: 19, photo: 'https://media.api-sports.io/football/players/534.png' },
    { id: 2, name: 'Bukayo Saka', position: 'Forward', number: 7, photo: 'https://media.api-sports.io/football/players/1465.png' },
    { id: 3, name: 'Gabriel Martinelli', position: 'Forward', number: 11, photo: 'https://media.api-sports.io/football/players/1466.png' },
    { id: 4, name: 'Viktor Gyökeres', position: 'Forward', number: 17, photo: 'https://media.api-sports.io/football/players/1484.png' },
    { id: 5, name: 'Noni Madueke', position: 'Forward', number: 10, photo: 'https://media.api-sports.io/football/players/11252.png' },
    { id: 6, name: 'Ethan Chidiebere Nwaneri', position: 'Forward', number: 53, photo: 'https://via.placeholder.com/150' },
    { id: 7, name: 'Kai Havertz', position: 'Forward', number: 29, photo: 'https://media.api-sports.io/football/players/1881.png' },
    { id: 8, name: 'Gabriel Jesus', position: 'Forward', number: 9, photo: 'https://media.api-sports.io/football/players/641.png' },
    // Midfielders
    { id: 9, name: 'Martin Ødegaard', position: 'Midfielder', number: 8, photo: 'https://media.api-sports.io/football/players/135.png' },
    { id: 10, name: 'Martín Zubimendi', position: 'Midfielder', number: 4, photo: 'https://media.api-sports.io/football/players/10398.png' },
    { id: 11, name: 'Declan Rice', position: 'Midfielder', number: 41, photo: 'https://media.api-sports.io/football/players/182.png' },
    { id: 12, name: 'Ethan Nwaneri', position: 'Midfielder', number: 53, photo: 'https://via.placeholder.com/150' },
    { id: 13, name: 'Myles Anthony Lewis-Skelly', position: 'Midfielder', number: 59, photo: 'https://via.placeholder.com/150' },
    { id: 14, name: 'Christian Nørgaard', position: 'Midfielder', number: 6, photo: 'https://media.api-sports.io/football/players/553.png' },
    { id: 15, name: 'Mikel Merino', position: 'Midfielder', number: 23, photo: 'https://media.api-sports.io/football/players/1908.png' },
    // Defenders
    { id: 16, name: 'Cristhian Mosquera', position: 'Defender', number: 3, photo: 'https://media.api-sports.io/football/players/151034.png' },
    { id: 17, name: 'Jakub Kiwior', position: 'Defender', number: 15, photo: 'https://media.api-sports.io/football/players/1271.png' },
    { id: 18, name: 'Riccardo Calafiori', position: 'Defender', number: 33, photo: 'https://media.api-sports.io/football/players/30414.png' },
    { id: 19, name: 'Jurriën Timber', position: 'Defender', number: 12, photo: 'https://media.api-sports.io/football/players/1273.png' },
    { id: 20, name: 'William Saliba', position: 'Defender', number: 2, photo: 'https://media.api-sports.io/football/players/1274.png' },
    { id: 21, name: 'Ben White', position: 'Defender', number: 4, photo: 'https://media.api-sports.io/football/players/1275.png' },
    { id: 22, name: 'Gabriel Magalhães', position: 'Defender', number: 6, photo: 'https://media.api-sports.io/football/players/1458.png' },
    { id: 23, name: 'Piero Hincapié', position: 'Defender', number: 3, photo: 'https://media.api-sports.io/football/players/1446.png' },
    // Goalkeepers
    { id: 24, name: 'Kepa Arrizabalaga', position: 'Goalkeeper', number: 1, photo: 'https://media.api-sports.io/football/players/181.png' },
    { id: 25, name: 'David Raya', position: 'Goalkeeper', number: 22, photo: 'https://media.api-sports.io/football/players/531.png' },
  ];

  const categories = [
    { title: 'Forward', pos: 'Forward', emoji: '⚽' },
    { title: 'Midfielder', pos: 'Midfielder', emoji: '🎯' },
    { title: 'Defender', pos: 'Defender', emoji: '🛡️' },
    { title: 'Goalkeeper', pos: 'Goalkeeper', emoji: '🧤' },
  ];

  // Use mock data if squad is empty, otherwise use provided squad
  const displaySquad = squad && squad.length > 0 ? squad : mockSquad;

  const getPlayerDetails = (player: SquadMember) => {
    // Generate realistic details based on names/ids for better high-fidelity effect
    const detailsMap: Record<string, string> = {
      'Leandro Trossard': 'Originally from Belgium - 31 years old',
      'Bukayo Saka': 'Originally from England - 24 years old',
      'Viktor Gyökeres': 'Originally from Sweden - 27 years old',
      'Declan Rice': 'Originally from England - 27 years old',
      'Mikel Merino': 'Originally from Spain - 29 years old',
      'Martin Ødegaard': 'Originally from Norway - 27 years old',
      'William Saliba': 'Originally from France - 24 years old',
      'Kepa Arrizabalaga': 'Originally from Spain - 31 years old',
      'David Raya': 'Originally from Spain - 30 years old',
    };
    return detailsMap[player.name] || 'International Player - Professional Detail';
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {categories.map((cat) => {
        const members = displaySquad.filter((p) => p.position === cat.pos);
        if (members.length === 0) return null;

        return (
          <div key={cat.title} className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden group">
            {/* Position Header */}
            <div className="bg-gradient-to-br from-[#059669] via-brand-emerald to-[#047857] p-6 flex items-center justify-between relative overflow-hidden">
              {/* Decorative background shapes */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl"></div>
              
              <h3 className="text-white font-black text-sm uppercase tracking-[0.2em] relative z-10">{cat.title}</h3>
              <div className="w-8 h-8 rounded-lg bg-white/20 border border-white/30 flex items-center justify-center backdrop-blur-sm relative z-10 shadow-inner">
                <span className="text-xs">{cat.emoji}</span>
              </div>
            </div>

            <div className="divide-y divide-slate-50">
              {members.map((player) => (
                <div key={player.id} className="group hover:bg-slate-50/50 transition-all duration-300 px-8 py-5 flex items-center justify-between cursor-default">
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-slate-100 shadow-sm group-hover:border-brand-emerald transition-colors">
                        {player.photo ? (
                          <img src={player.photo} alt={player.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-300 font-black text-xs uppercase">
                            {player.number || '00'}
                          </div>
                        )}
                      </div>
                      {player.number && (
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-brand-midnight text-white rounded-full flex items-center justify-center border-2 border-white shadow-sm text-[9px] font-black">
                          {player.number}
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="text-base font-black text-slate-800 group-hover:text-brand-emerald transition-colors leading-tight">
                        {player.name}
                      </h4>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 flex items-center">
                        <span className="text-brand-emerald/40 mr-2">✦</span>
                        {getPlayerDetails(player)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 text-slate-300 group-hover:bg-brand-light-emerald group-hover:text-brand-emerald group-hover:border-brand-emerald/20 transition-all duration-300">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
