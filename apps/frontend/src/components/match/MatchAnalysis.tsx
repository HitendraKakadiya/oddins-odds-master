import { useState } from 'react';
import type { MatchData, TeamStats, LeagueStats } from '@/lib/api/types';

interface MatchAnalysisProps {
  match: MatchData;
  stats?: {
    home: TeamStats;
    away: TeamStats;
    league: LeagueStats;
  } | null;
}

export default function MatchAnalysis({ match, stats }: MatchAnalysisProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const homeStats = stats?.home;
  const awayStats = stats?.away;
  const league = stats?.league;

  const kickoffTime = new Date(match.kickoffAt);
  const formattedTime = kickoffTime.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
  const formattedDate = kickoffTime.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  const faqs = [
    { 
      q: `What is the win percentage for ${match.homeTeam.name}?`, 
      a: `${match.homeTeam.name} has a ${homeStats?.overall.winRate || 0}% win rate this season in the ${match.league.name}.` 
    },
    { 
      q: `Where to find ${match.homeTeam.name} vs ${match.awayTeam.name} prediction?`, 
      a: `You can find expert predictions and betting tips right here on OddinsOdds. Our systems analyze thousands of data points to give you the most accurate forecasts.` 
    },
    { 
      q: `How many goals does ${match.awayTeam.name} score on average?`, 
      a: `${match.awayTeam.name} scores an average of ${awayStats?.overall.scoredAvg || 0} goals per match.` 
    },
    { 
      q: `What's the BTTS rate for this league?`, 
      a: `The ${match.league.name} has a Both Teams to Score (BTTS) rate of ${league?.bttsRate || 0}% this season.` 
    }
  ];

  return (
    <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-8 md:p-12 mb-10">
      <h2 className="text-2xl md:text-3xl font-black text-slate-800 mb-6 leading-tight">
        {match.homeTeam.name} vs {match.awayTeam.name}: Pre-Match Statistics and Analysis
      </h2>

      <div className="space-y-6 text-slate-500 leading-relaxed text-sm md:text-base">
        <p>
          Comprehensive breakdown for the {match.homeTeam.name} vs {match.awayTeam.name} match scheduled for {formattedDate} at {formattedTime}.
        </p>

        <h3 className="text-xl font-black text-slate-800 pt-4">Stat Probabilities</h3>
        <ul className="list-disc pl-5 space-y-3 marker:text-brand-indigo">
          <li>
            <b className="text-slate-800">BTTS:</b> The league average for both teams scoring is {league?.bttsRate || 0}%.
          </li>
          <li>
            <b className="text-slate-800">Over 2.5 goals:</b> Statistics show a {league?.over25Rate || 0}% chance of over 2.5 goals in this league.
          </li>
        </ul>

        {homeStats && (
          <>
            <h3 className="text-xl font-black text-slate-800 pt-8">Performance of {match.homeTeam.name}</h3>
            <p>
              {match.homeTeam.name} has played {homeStats.overall.played || 0} matches with a win rate of {homeStats.overall.winRate || 0}%. 
              At home, their win rate is {homeStats.home.winRate || 0}% with an average of {homeStats.home.scoredAvg || 0} goals scored.
            </p>
          </>
        )}

        {awayStats && (
          <>
            <h3 className="text-xl font-black text-slate-800 pt-8">Performance of {match.awayTeam.name}</h3>
            <p>
              {match.awayTeam.name} has played {awayStats.overall.played || 0} matches. 
              As visitors, they average {awayStats.away.scoredAvg || 0} goals per game and have a clean sheet rate of {awayStats.overall.cleanSheetRate || 0}%.
            </p>
          </>
        )}

        <h3 className="text-xl font-black text-slate-800 pt-12 pb-6">Additional FAQs</h3>
        <div className="space-y-4">
           {faqs.map((faq, idx) => (
              <div key={idx} className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                 <button 
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full px-8 py-5 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors text-left"
                 >
                    <span className="text-sm font-black text-brand-indigo leading-tight">{faq.q}</span>
                    <svg 
                       className={`w-5 h-5 text-slate-300 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} 
                       fill="none" 
                       stroke="currentColor" 
                       viewBox="0 0 24 24"
                    >
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                 </button>
                 {openFaq === idx && (
                    <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-50">
                       <p className="text-sm font-bold text-slate-600 leading-relaxed">{faq.a}</p>
                    </div>
                 )}
              </div>
           ))}
        </div>
      </div>
    </div>
  );
}
