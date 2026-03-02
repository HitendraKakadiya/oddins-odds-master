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
  const categories = [
    { title: 'Goalkeepers', pos: 'Goalkeeper' },
    { title: 'Defenders', pos: 'Defender' },
    { title: 'Midfielders', pos: 'Midfielder' },
    { title: 'Forwards', pos: 'Forward' },
  ];

  return (
    <div className="space-y-12 mb-12">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black text-gray-900">Squad 2026</h2>
        <div className="h-px bg-gray-100 flex-1 ml-8"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {categories.map((cat) => {
          const members = squad.filter((p) => p.position === cat.pos);
          if (members.length === 0) return null;

          return (
            <div key={cat.title} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center">
                <span className="w-2 h-8 bg-primary-600 rounded-full mr-3"></span>
                {cat.title}
              </h3>
              <ul className="space-y-4">
                {members.map((p) => (
                  <li key={p.id} className="flex items-center group">
                    <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center mr-4 border border-gray-100 overflow-hidden group-hover:border-primary-200 transition-colors duration-200">
                      {p.photo ? (
                        <img src={p.photo} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs font-bold text-gray-400">{p.number || ''}</span>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-700 group-hover:text-primary-600 transition-colors duration-200">{p.name}</span>
                      {p.number && (
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          No {p.number}
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
