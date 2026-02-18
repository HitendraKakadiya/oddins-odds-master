import { useState } from 'react';
import type { MatchData } from '@/lib/api/types';

export default function MatchAnalysis({ match }: { match: MatchData }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
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
      q: `What is the head-to-head record between ${match.homeTeam.name} and ${match.awayTeam.name}?`, 
      a: `In recent meetings, ${match.homeTeam.name} has won 1 matches, while ${match.awayTeam.name} has won 0 matches. There has been 1 draw between them.` 
    },
    { 
      q: `Where to find ${match.homeTeam.name} vs ${match.awayTeam.name} prediction?`, 
      a: `You can find expert predictions and betting tips right here on OddinsOdds. Our systems analyze thousands of data points to give you the most accurate forecasts.` 
    },
    { 
      q: `What was the last match between ${match.homeTeam.name} vs ${match.awayTeam.name}?`, 
      a: `The last match between these two teams ended in a competitive draw, showing how closely matched they are in recent form.` 
    },
    { 
      q: `Where to find ${match.homeTeam.name} vs ${match.awayTeam.name} stats?`, 
      a: `Complete statistics including form, head-to-head, and standing are available on this page. We provide a deep dive into every metric that matters.` 
    },
    { 
      q: `Where to watch ${match.homeTeam.name} vs ${match.awayTeam.name}?`, 
      a: `Check the "Where to Watch" section at the top of this page for a list of broadcasting channels and live stream providers available in your region.` 
    }
  ];

  return (
    <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-8 md:p-12 mb-10">
      {/* Main Analysis Header */}
      <h2 className="text-2xl md:text-3xl font-black text-slate-800 mb-6 leading-tight">
        {match.homeTeam.name} vs {match.awayTeam.name}: Pre-Match Statistics and Analysis - {match.league.name} 2025/2026
      </h2>

      <div className="space-y-6 text-slate-500 leading-relaxed text-sm md:text-base">
        <p>
          These are all the statistics you need to know for the {match.homeTeam.name} vs {match.awayTeam.name} match scheduled for {formattedDate} at {formattedTime}.
        </p>

        <p>
          Get a full breakdown of both teams with complete statistics throughout the competition. Check out the latest team trends, current form, goals scored and conceded, head-to-head history, and other important information.
        </p>

        <h3 className="text-xl font-black text-slate-800 pt-4">Relevant facts about {match.homeTeam.name} vs {match.awayTeam.name}</h3>
        
        <p>
          Here is some information about {match.homeTeam.name} vs {match.awayTeam.name} that could prove helpful in your analysis of the match:
        </p>

        <p>
          And now here is a list of statistical probabilities for the upcoming {match.homeTeam.name} vs {match.awayTeam.name} match in the {match.league.name}.
        </p>

        <h3 className="text-xl font-black text-slate-800 pt-4">Stat Probabilities for {match.homeTeam.name} vs {match.awayTeam.name}</h3>

        <p>
          Here are the percentage chances that certain statistical events will happen in {match.homeTeam.name} vs {match.awayTeam.name}, according to our projection system.
        </p>

        <ul className="list-disc pl-5 space-y-3 marker:text-brand-indigo">
          <li>
            <b className="text-slate-800">BTTS:</b> The statistics say the chances of both teams scoring in {match.homeTeam.name} vs {match.awayTeam.name} is 61%.
          </li>
          <li>
            <b className="text-slate-800">Over 2.5 goals:</b> The combination of stats for {match.homeTeam.name} vs {match.awayTeam.name} show that there is 75% chance of over 2.5 goals scored in this match.
          </li>
        </ul>

        <p className="italic">
           Aside from all the different stats for this match, you can also check out our free predictions for this and other matches, which provide more important details.
        </p>

        {/* Overall Performance */}
        <h3 className="text-xl font-black text-slate-800 pt-8">Overall Performance of {match.homeTeam.name} vs {match.awayTeam.name}</h3>
        <p>
           Let's now take a look at how {match.homeTeam.name} and {match.awayTeam.name} have performed thus far in the {match.league.name}. {match.homeTeam.name} has played 27 matches and has a record of 7 wins, 7 draws, and 13 losses.
        </p>
        <p>
           Meanwhile, {match.awayTeam.name} has 0 wins, 2 draws, and 23 losses in 25 matches thus far.
        </p>
        <p>
           So based on those numbers, {match.homeTeam.name} has a win rate of 26%, while {match.awayTeam.name} has come out on top in 0% of their matches.
        </p>

        {/* Home Performance */}
        <h3 className="text-xl font-black text-brand-indigo pt-8">{match.homeTeam.name} - Home performance</h3>
        <p>
           {match.homeTeam.name} has played at home 0 times in the {match.league.name}, and has the following record in those matches:
        </p>
        <ul className="list-disc pl-5 space-y-1">
           <li>Wins: 4</li>
           <li>Draws: 4</li>
           <li>Defeats: 6</li>
        </ul>
        <p>
           That gives {match.homeTeam.name} a 23% win rate at their home stadium. They have been held to draws 0% of the time, while losses make up 0% of their home matches.
        </p>

        {/* Away Performance */}
        <h3 className="text-xl font-black text-slate-800 pt-8">{match.awayTeam.name} - Away performance</h3>
        <p>
           On the opposite side, {match.awayTeam.name} has played 0 away matches thus far, and these are their numbers as the visiting side:
        </p>
        <ul className="list-disc pl-5 space-y-1">
           <li>Wins: 3</li>
           <li>Draws: 3</li>
           <li>Defeats: 7</li>
        </ul>
        <p>
           In terms of percentages, {match.awayTeam.name} has won 0% of away matches. They have drawn with their hosts in 0% of those matches and have suffered defeat 0% of the time as visitors.
        </p>

        {/* Goal Statistics */}
        <h3 className="text-xl font-black text-slate-800 pt-8">Goal statistics for {match.homeTeam.name} vs {match.awayTeam.name}</h3>
        <p>
           Goal statistics are a good way to see how both teams perform offensively and defensively. So here are the goals scored and conceded numbers of {match.homeTeam.name} and {match.awayTeam.name} ahead of their upcoming matchup.
        </p>

        <h4 className="text-lg font-black text-brand-indigo pt-4">Goals scored</h4>
        <p>
           {match.homeTeam.name} has scored a total of 20 goals so far in the {match.league.name}, while their opponent {match.awayTeam.name} has found the back of the net 14 times to date.
        </p>
        <p>
           Based on average goals scored, {match.homeTeam.name} has an average of 1.26 goals scored in this current campaign, and {match.awayTeam.name} has scored 0.72 on average.
        </p>

        {/* Direct Matchups */}
        <h3 className="text-xl font-black text-slate-800 pt-8">Direct Matchups Between {match.homeTeam.name} vs {match.awayTeam.name}</h3>
        <p>
           {match.homeTeam.name} and {match.awayTeam.name} have played each other 2 times in recent years. In those matches, {match.homeTeam.name} has 1 wins, {match.awayTeam.name} has 0 wins, and there have been 1 draws.
        </p>

        {/* FAQs */}
        <h3 className="text-xl font-black text-slate-800 pt-12 pb-6">
           Here are some additional FAQs about {match.homeTeam.name} vs {match.awayTeam.name} that you may find helpful.
        </h3>

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
