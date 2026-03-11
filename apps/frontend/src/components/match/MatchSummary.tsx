'use client';

import { useMemo } from 'react';
import type { MatchEvent, MatchData } from '@/lib/api/types';

interface MatchSummaryProps {
  events?: MatchEvent[] | null;
  match: MatchData;
}

interface MatchEventWithScore extends MatchEvent {
  runningScore?: string;
}

export default function MatchSummary({ events, match }: MatchSummaryProps) {
  const sortedEvents = useMemo(() => {
    if (!events) return [];
    return [...events].sort((a, b) => {
      const timeA = a.time.elapsed + (a.time.extra || 0);
      const timeB = b.time.elapsed + (b.time.extra || 0);
      return timeA - timeB;
    });
  }, [events]);

  const eventsWithScore = useMemo(() => {
    let homeScore = 0;
    let awayScore = 0;
    
    return sortedEvents.map(event => {
      if (event.type === 'Goal') {
        if (Number(event.team.id) === Number(match.homeTeam.id)) homeScore++;
        else awayScore++;
        return { ...event, runningScore: `${homeScore} : ${awayScore}` };
      }
      return event;
    });
  }, [sortedEvents, match.homeTeam.id, match.awayTeam.id]);

  if (!events || events.length === 0) {
    return (
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-20 text-center animate-in fade-in slide-in-from-bottom-4 duration-500 mb-10">
         <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl grayscale opacity-50">⏱️</span>
         </div>
         <h3 className="text-xl font-black text-slate-800 mb-2">No events recorded yet</h3>
         <p className="text-slate-400 font-bold max-w-xs mx-auto">Specific match events like goals and cards will appear here once the match starts.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-brand-emerald px-8 py-5">
        <h3 className="text-white font-black uppercase tracking-[0.2em] text-sm">Summary</h3>
      </div>

      <div className="p-0">
        <div className="flex flex-col">
          {eventsWithScore.map((event: MatchEventWithScore, index) => {
            const isHome = Number(event.team.id) === Number(match.homeTeam.id);
            
            return (
              <div key={index} className={`flex items-center py-4 px-6 md:px-10 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/10'}`}>
                {/* Time */}
                <div className="w-12 md:w-16 shrink-0 text-slate-400 font-bold text-sm">
                  {event.time.elapsed}{event.time.extra ? `+${event.time.extra}` : ''}
                </div>

                {/* Home Content */}
                <div className="flex-1 text-right pr-4 md:pr-8">
                  {isHome && (
                    <div className="flex items-center justify-end gap-3">
                      <div className="flex flex-col items-end">
                        <span className="text-xs md:text-sm font-black text-slate-700">
                           {event.player?.name || 'Player'}
                           {event.assist?.name && (
                             <span className="text-[10px] text-slate-400 font-bold ml-1.5">({event.assist.name})</span>
                           )}
                        </span>
                        {event.type === 'subst' && (
                          <div className="flex items-center gap-1 mt-0.5">
                             <span className="text-[9px] font-black text-red-400 uppercase">Out: {event.player?.name || 'Player'}</span>
                             <span className="text-slate-300"> | </span>
                             <span className="text-[9px] font-black text-green-500 uppercase">In: {event.assist?.name || 'Player'}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Center - Score or Icon */}
                <div className="w-20 md:w-32 flex justify-center shrink-0">
                   {event.type === 'Goal' ? (
                     <div className="flex flex-col items-center gap-1">
                        <span className="text-brand-emerald">⚽</span>
                        <span className="text-[11px] md:text-xs font-black text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md min-w-[36px] text-center border border-slate-200/50">
                           {event.runningScore}
                        </span>
                     </div>
                   ) : (
                     <div className="text-lg">
                        {getEventIcon(event)}
                     </div>
                   )}
                </div>

                {/* Away Content */}
                <div className="flex-1 text-left pl-4 md:pl-8">
                  {!isHome && (
                    <div className="flex items-center justify-start gap-3">
                      <div className="flex flex-col items-start">
                        <span className="text-xs md:text-sm font-black text-slate-700">
                           {event.player?.name || 'Player'}
                           {event.assist?.name && (
                             <span className="text-[10px] text-slate-400 font-bold ml-1.5">({event.assist.name})</span>
                           )}
                        </span>
                        {event.type === 'subst' && (
                          <div className="flex items-center gap-1 mt-0.5">
                             <span className="text-[9px] font-black text-green-500 uppercase">In: {event.assist?.name || 'Player'}</span>
                             <span className="text-slate-300"> | </span>
                             <span className="text-[9px] font-black text-red-400 uppercase">Out: {event.player?.name || 'Player'}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function getEventIcon(event: MatchEvent) {
  switch (event.type) {
    case 'Goal':
      return '⚽';
    case 'Card':
      if (event.detail.includes('Yellow')) return <div className="w-3 h-4 bg-yellow-400 rounded-sm shadow-sm border border-yellow-500/20"></div>;
      return <div className="w-3 h-4 bg-red-500 rounded-sm shadow-sm border border-red-600/20"></div>;
    case 'subst':
      return (
        <div className="flex items-center gap-0.5">
          <span className="text-green-500 text-xs">↑</span>
          <span className="text-red-400 text-xs">↓</span>
        </div>
      );
    case 'Var':
      return '🖥️';
    default:
      return '⏱️';
  }
}
