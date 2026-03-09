'use client';

import { useState } from 'react';
import type { StandingsRow } from '@/lib/api/types';

interface StandingsProps {
  standings: StandingsRow[];
}

export default function Standings({ standings }: StandingsProps) {
  const [activeSubTab, setActiveSubTab] = useState('Table');
  const [filter, setFilter] = useState<'overall' | 'home' | 'away'>('overall');
  const [goalType, setGoalType] = useState<'scored' | 'conceded'>('scored');
  const [activeCardToggle, setActiveCardToggle] = useState<'overall' | 'for' | 'against'>('overall');
  const [ouMode, setOuMode] = useState<'over' | 'under'>('over');
  const [ouLine, setOuLine] = useState<'05' | '15' | '25' | '35' | '45' | '55'>('25');
  const [scoringFirstMode, setScoringFirstMode] = useState<'scoring' | 'conceding'>('scoring');

  const subTabs = [
    'Table', 'Goals', '1st Half', '2nd Half', 'Over Under Goals', 'Clean Sheet', 'BTTS', 'Match Scoring / Conceding First'
  ];

  const getFormColor = (result: string) => {
    switch (result) {
      case 'W': return 'bg-emerald-500';
      case 'D': return 'bg-amber-500';
      case 'L': return 'bg-rose-500';
      default: return 'bg-slate-300';
    }
  };

  const renderTableContent = () => {
    if (activeSubTab === 'Over Under Goals') {
      const modeKey = (ouMode === 'over' ? `over${ouLine}` : `under${ouLine}`) as 'over05' | 'over15' | 'over25' | 'over35' | 'over45' | 'over55';
      return (
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left border-b border-slate-100/50">
              <th className="pb-6 text-[11px] font-black text-slate-400 uppercase tracking-tighter px-4 w-12 text-center">#</th>
              <th className="pb-6 text-[11px] font-black text-slate-400 uppercase tracking-tighter px-4">Team</th>
              <th className="pb-6 text-[11px] font-black text-slate-400 uppercase tracking-tighter px-4 text-center">MP</th>
              <th className="pb-6 text-[11px] font-black text-slate-400 uppercase tracking-tighter px-4 text-center">{ouMode === 'over' ? 'Over' : 'Under'}</th>
              <th className="pb-6 text-[11px] font-black text-slate-400 uppercase tracking-tighter px-4 text-center">Overall</th>
              <th className="pb-6 text-[11px] font-black text-slate-400 uppercase tracking-tighter px-4 text-center">Home</th>
              <th className="pb-6 text-[11px] font-black text-slate-400 uppercase tracking-tighter px-4 text-center">Away</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50/50">
            {standings.map((row, idx) => {
              const mp = row.overall.played;
              const oCount = row.overall.overUnder?.[modeKey]?.count || 0;
              const oPct = row.overall.overUnder?.[modeKey]?.percentage || 0;
              const hPct = row.home.overUnder?.[modeKey]?.percentage || 0;
              const aPct = row.away.overUnder?.[modeKey]?.percentage || 0;
              return (
                <tr key={row.team.id} className={`group transition-colors ${idx % 2 === 1 ? 'bg-slate-50/30' : ''} hover:bg-slate-50/80`}>
                  <td className="py-6 text-[12px] font-black text-slate-400 px-4 text-center tabular-nums">{row.rank}</td>
                  <td className="py-6 px-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 p-1.5 shadow-sm group-hover:scale-110 transition-transform">
                        {row.team.logoUrl ? (
                          <img src={row.team.logoUrl} alt="" className="w-full h-full object-contain" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-slate-300">⚽</div>
                        )}
                      </div>
                      <span className="text-[13px] font-black text-slate-700 group-hover:text-brand-emerald transition-colors">{row.team.name}</span>
                    </div>
                  </td>
                  <td className="py-6 text-[13px] font-black text-slate-800 px-4 text-center tabular-nums">{mp}</td>
                  <td className="py-6 text-[13px] font-black text-slate-800 px-4 text-center tabular-nums">{oCount}</td>
                  <td className="py-6 text-[13px] font-black text-slate-800 px-4 text-center tabular-nums">{oPct}%</td>
                  <td className="py-6 text-[13px] font-black text-slate-800 px-4 text-center tabular-nums">{hPct}%</td>
                  <td className="py-6 text-[13px] font-black text-slate-800 px-4 text-center tabular-nums">{aPct}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      );
    }

    if (activeSubTab === 'BTTS') {
      return (
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left border-b border-slate-100/50">
              <th className="pb-6 text-[11px] font-black text-slate-400 uppercase tracking-tighter px-4 w-12 text-center">#</th>
              <th className="pb-6 text-[11px] font-black text-slate-400 uppercase tracking-tighter px-4">Team</th>
              <th className="pb-6 text-[11px] font-black text-slate-400 uppercase tracking-tighter px-4 text-center">MP</th>
              <th className="pb-6 text-[11px] font-black text-slate-400 uppercase tracking-tighter px-4 text-center">BTTS</th>
              <th className="pb-6 text-[11px] font-black text-slate-400 uppercase tracking-tighter px-4 text-center">BTTS %</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50/50">
            {standings.map((row, idx) => {
              const data = row[filter];
              return (
                <tr key={row.team.id} className={`group transition-colors ${idx % 2 === 1 ? 'bg-slate-50/30' : ''} hover:bg-slate-50/80`}>
                  <td className="py-6 text-[12px] font-black text-slate-400 px-4 text-center tabular-nums">{row.rank}</td>
                  <td className="py-6 px-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 p-1.5 shadow-sm group-hover:scale-110 transition-transform">
                        {row.team.logoUrl ? (
                          <img src={row.team.logoUrl} alt="" className="w-full h-full object-contain" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-slate-300">⚽</div>
                        )}
                      </div>
                      <span className="text-[13px] font-black text-slate-700 group-hover:text-brand-emerald transition-colors">{row.team.name}</span>
                    </div>
                  </td>
                  <td className="py-6 text-[13px] font-black text-slate-800 px-4 text-center tabular-nums">{data.played}</td>
                  <td className="py-6 text-[13px] font-black text-slate-800 px-4 text-center tabular-nums">{data.btts?.count || 0}</td>
                  <td className="py-6 text-[13px] font-black text-slate-800 px-4 text-center tabular-nums">{data.btts?.percentage || 0} %</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      );
    }
    
    if (activeSubTab === 'Match Scoring / Conceding First') {
      return (
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left border-b border-slate-100/50">
              <th className="pb-6 text-[11px] font-black text-slate-400 uppercase tracking-tighter px-4 w-12 text-center">#</th>
              <th className="pb-6 text-[11px] font-black text-slate-400 uppercase tracking-tighter px-4">Team</th>
              <th className="pb-6 text-[11px] font-black text-slate-400 uppercase tracking-tighter px-4 text-center">MP</th>
              <th className="pb-6 text-[11px] font-black text-slate-400 uppercase tracking-tighter px-4 text-center">{scoringFirstMode === 'scoring' ? 'Scoring First' : 'Conceding First'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50/50">
            {standings.map((row, idx) => {
              const data = row[filter];
              const stat = scoringFirstMode === 'scoring' ? data.scoringFirst : data.concedingFirst;
              return (
                <tr key={row.team.id} className={`group transition-colors ${idx % 2 === 1 ? 'bg-slate-50/30' : ''} hover:bg-slate-50/80`}>
                  <td className="py-6 text-[12px] font-black text-slate-400 px-4 text-center tabular-nums">{row.rank}</td>
                  <td className="py-6 px-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 p-1.5 shadow-sm group-hover:scale-110 transition-transform">
                        {row.team.logoUrl ? (
                          <img src={row.team.logoUrl} alt="" className="w-full h-full object-contain" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-slate-300">⚽</div>
                        )}
                      </div>
                      <span className="text-[13px] font-black text-slate-700 group-hover:text-brand-emerald transition-colors">{row.team.name}</span>
                    </div>
                  </td>
                  <td className="py-6 text-[13px] font-black text-slate-800 px-4 text-center tabular-nums">{data.played}</td>
                  <td className="py-6 text-[13px] font-black text-slate-800 px-4 text-center tabular-nums">{stat?.percentage || 0} %</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      );
    }
    
    if (activeSubTab === 'Clean Sheet') {
      return (
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left border-b border-slate-100/50">
              <th className="pb-6 text-[11px] font-black text-slate-400 uppercase tracking-tighter px-4 w-12 text-center">#</th>
              <th className="pb-6 text-[11px] font-black text-slate-400 uppercase tracking-tighter px-4">Team</th>
              <th className="pb-6 text-[11px] font-black text-slate-400 uppercase tracking-tighter px-4 text-center">MP</th>
              <th className="pb-6 text-[11px] font-black text-slate-400 uppercase tracking-tighter px-4 text-center">Clean Sheet</th>
              <th className="pb-6 text-[11px] font-black text-slate-400 uppercase tracking-tighter px-4 text-center">Percentage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50/50">
            {standings.map((row, idx) => {
              const data = row[filter];
              return (
                <tr key={row.team.id} className={`group transition-colors ${idx % 2 === 1 ? 'bg-slate-50/30' : ''} hover:bg-slate-50/80`}>
                  <td className="py-6 text-[12px] font-black text-slate-400 px-4 text-center tabular-nums">{row.rank}</td>
                  <td className="py-6 px-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 p-1.5 shadow-sm group-hover:scale-110 transition-transform">
                        {row.team.logoUrl ? (
                          <img src={row.team.logoUrl} alt="" className="w-full h-full object-contain" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-slate-300">⚽</div>
                        )}
                      </div>
                      <span className="text-[13px] font-black text-slate-700 group-hover:text-brand-emerald transition-colors">{row.team.name}</span>
                    </div>
                  </td>
                  <td className="py-6 text-[13px] font-black text-slate-800 px-4 text-center tabular-nums">{data.played}</td>
                  <td className="py-6 text-[13px] font-black text-slate-800 px-4 text-center tabular-nums">{data.cleanSheets?.count || 0}</td>
                  <td className="py-6 text-[13px] font-black text-slate-800 px-4 text-center tabular-nums">{data.cleanSheets?.percentage || 0} %</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      );
    }

    if (activeSubTab === '1st Half' || activeSubTab === '2nd Half') {
      const isFirst = activeSubTab === '1st Half';
      return (
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left border-b border-slate-100/50">
              <th className="pb-6 text-[11px] font-black text-slate-400 uppercase tracking-tighter px-4 w-12 text-center">#</th>
              <th className="pb-6 text-[11px] font-black text-slate-400 uppercase tracking-tighter px-4">Team</th>
              <th className="pb-6 text-[11px] font-black text-slate-400 uppercase tracking-tighter px-4 text-center">MP</th>
              <th className="pb-6 text-[11px] font-black text-slate-400 uppercase tracking-tighter px-4 text-center">W</th>
              <th className="pb-6 text-[11px] font-black text-slate-400 uppercase tracking-tighter px-4 text-center">D</th>
              <th className="pb-6 text-[11px] font-black text-slate-400 uppercase tracking-tighter px-4 text-center">L</th>
              <th className="pb-6 text-[11px] font-black text-slate-400 uppercase tracking-tighter px-4 text-center">GF</th>
              <th className="pb-6 text-[11px] font-black text-slate-400 uppercase tracking-tighter px-4 text-center">GA</th>
              <th className="pb-6 text-[11px] font-black text-slate-400 uppercase tracking-tighter px-4 text-center">GD</th>
              <th className="pb-6 text-[11px] font-black text-slate-400 uppercase tracking-tighter px-4 text-center">Pts</th>
              <th className="pb-6 text-[11px] font-black text-slate-400 uppercase tracking-tighter px-4 text-center">PPG</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50/50">
            {standings.map((row, idx) => {
              const data = isFirst ? row[filter].firstHalf : row[filter].secondHalf;
              return (
                <tr key={row.team.id} className={`group transition-colors ${idx % 2 === 1 ? 'bg-slate-50/30' : ''} hover:bg-slate-50/80`}>
                  <td className="py-6 text-[12px] font-black text-slate-400 px-4 text-center tabular-nums">{row.rank}</td>
                  <td className="py-6 px-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 p-1.5 shadow-sm group-hover:scale-110 transition-transform">
                        {row.team.logoUrl ? (
                          <img src={row.team.logoUrl} alt="" className="w-full h-full object-contain" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-slate-300">⚽</div>
                        )}
                      </div>
                      <span className="text-[13px] font-black text-slate-700 group-hover:text-brand-emerald transition-colors">{row.team.name}</span>
                    </div>
                  </td>
                  <td className="py-6 text-[13px] font-black text-slate-800 px-4 text-center tabular-nums">{data?.played || 0}</td>
                  <td className="py-6 text-[13px] font-black text-slate-800 px-4 text-center tabular-nums">{data?.wins || 0}</td>
                  <td className="py-6 text-[13px] font-black text-slate-800 px-4 text-center tabular-nums">{data?.draws || 0}</td>
                  <td className="py-6 text-[13px] font-black text-slate-800 px-4 text-center tabular-nums">{data?.losses || 0}</td>
                  <td className="py-6 text-[13px] font-black text-slate-800 px-4 text-center tabular-nums">{data?.gf || 0}</td>
                  <td className="py-6 text-[13px] font-black text-slate-800 px-4 text-center tabular-nums">{data?.ga || 0}</td>
                  <td className="py-6 text-[13px] font-black text-slate-800 px-4 text-center tabular-nums">{data?.gd || 0}</td>
                  <td className="py-6 text-[13px] font-black text-slate-900 px-4 text-center tabular-nums">{data?.points || 0}</td>
                  <td className="py-6 text-[13px] font-black text-slate-600 px-4 text-center tabular-nums">{data?.ppg?.toFixed(2) || '0.00'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      );
    }

    if (activeSubTab === 'Cards') {
      return (
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left border-b border-slate-100/50">
              <th className="pb-6 text-[11px] font-black text-slate-400 uppercase tracking-tighter px-4 w-12 text-center">#</th>
              <th className="pb-6 text-[11px] font-black text-slate-400 uppercase tracking-tighter px-4">Team</th>
              <th className="pb-6 text-[11px] font-black text-slate-400 uppercase tracking-tighter px-4 text-center">MP</th>
              {['3.5', '4.5', '5.5'].map(over => (
                <th key={over} className="pb-6 text-[11px] font-black text-slate-400 uppercase tracking-tighter px-2 text-center whitespace-nowrap">Over {over}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50/50">
            {standings.map((row, idx) => {
              // Map the activeCardToggle to the corresponding data split
              // Since Card Overall/For/Against is calculated in backend splits:
              // Cards Overall -> row.overall.cards
              // Cards For -> row.home.cards
              // Cards Against -> row.away.cards
              const cardData = activeCardToggle === 'overall' ? row.overall.cards : 
                               activeCardToggle === 'for' ? row.home.cards : 
                               row.away.cards;

              return (
                <tr key={row.team.id} className={`group transition-colors ${idx % 2 === 1 ? 'bg-slate-50/30' : ''} hover:bg-slate-50/80`}>
                  <td className="py-6 text-[12px] font-black text-slate-400 px-4 text-center tabular-nums">{row.rank}</td>
                  <td className="py-6 px-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 p-1.5 shadow-sm group-hover:scale-110 transition-transform">
                        {row.team.logoUrl ? (
                          <img src={row.team.logoUrl} alt="" className="w-full h-full object-contain" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-slate-300">⚽</div>
                        )}
                      </div>
                      <span className="text-[13px] font-black text-slate-700 group-hover:text-brand-emerald transition-colors">{row.team.name}</span>
                    </div>
                  </td>
                  <td className="py-6 text-[13px] font-black text-slate-800 px-4 text-center tabular-nums">{row.overall.played}</td>
                  <td className="py-6 text-[12px] font-black text-slate-600 px-2 text-center tabular-nums">{cardData?.over35 || 0} %</td>
                  <td className="py-6 text-[12px] font-black text-slate-600 px-2 text-center tabular-nums">{cardData?.over45 || 0} %</td>
                  <td className="py-6 text-[12px] font-black text-slate-600 px-2 text-center tabular-nums">{cardData?.over55 || 0} %</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      );
    }
    if (activeSubTab === 'Corners') {
      return (
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left border-b border-slate-100/50">
              <th className="pb-6 text-[11px] font-black text-slate-400 uppercase tracking-tighter px-4 w-12 text-center">#</th>
              <th className="pb-6 text-[11px] font-black text-slate-400 uppercase tracking-tighter px-4">Team</th>
              <th className="pb-6 text-[11px] font-black text-slate-400 uppercase tracking-tighter px-4 text-center">MP</th>
              {['7.5', '8.5', '9.5', '10.5', '11.5', '12.5', '13.5'].map(over => (
                <th key={over} className="pb-6 text-[11px] font-black text-slate-400 uppercase tracking-tighter px-2 text-center whitespace-nowrap">Over {over}</th>
              ))}
              <th className="pb-6 text-[11px] font-black text-slate-400 uppercase tracking-tighter px-4 text-center">Average</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50/50">
            {standings.map((row, idx) => {
              const data = row[filter];
              const corners = data.corners;
              return (
                <tr key={row.team.id} className={`group transition-colors ${idx % 2 === 1 ? 'bg-slate-50/30' : ''} hover:bg-slate-50/80`}>
                  <td className="py-6 text-[12px] font-black text-slate-400 px-4 text-center tabular-nums">{row.rank}</td>
                  <td className="py-6 px-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 p-1.5 shadow-sm group-hover:scale-110 transition-transform">
                        {row.team.logoUrl ? (
                          <img src={row.team.logoUrl} alt="" className="w-full h-full object-contain" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-slate-300">⚽</div>
                        )}
                      </div>
                      <span className="text-[13px] font-black text-slate-700 group-hover:text-brand-emerald transition-colors">{row.team.name}</span>
                    </div>
                  </td>
                  <td className="py-6 text-[13px] font-black text-slate-800 px-4 text-center tabular-nums">{data.played}</td>
                  <td className="py-6 text-[12px] font-black text-slate-600 px-2 text-center tabular-nums">{corners ? `${corners.over75}%` : 'N/A'}</td>
                  <td className="py-6 text-[12px] font-black text-slate-600 px-2 text-center tabular-nums">{corners ? `${corners.over85}%` : 'N/A'}</td>
                  <td className="py-6 text-[12px] font-black text-slate-600 px-2 text-center tabular-nums">{corners ? `${corners.over95}%` : 'N/A'}</td>
                  <td className="py-6 text-[12px] font-black text-slate-600 px-2 text-center tabular-nums">{corners ? `${corners.over105}%` : 'N/A'}</td>
                  <td className="py-6 text-[12px] font-black text-slate-600 px-2 text-center tabular-nums">{corners ? `${corners.over115}%` : 'N/A'}</td>
                  <td className="py-6 text-[12px] font-black text-slate-600 px-2 text-center tabular-nums">{corners ? `${corners.over125}%` : 'N/A'}</td>
                  <td className="py-6 text-[12px] font-black text-slate-600 px-2 text-center tabular-nums">{corners ? `${corners.over135}%` : 'N/A'}</td>
                  <td className="py-6 text-[13px] font-black text-slate-800 px-4 text-center tabular-nums">{corners ? corners.average?.toFixed(1) : 'N/A'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      );
    }
    if (activeSubTab === 'Goals') {
      return (
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left border-b border-slate-100/50">
              <th className="pb-6 text-[11px] font-black text-slate-400 uppercase tracking-tighter px-4 w-12 text-center">#</th>
              <th className="pb-6 text-[11px] font-black text-slate-400 uppercase tracking-tighter px-4">Team</th>
              <th className="pb-6 text-[11px] font-black text-slate-400 uppercase tracking-tighter px-4 text-center">MP</th>
              <th className="pb-6 text-[11px] font-black text-slate-400 uppercase tracking-tighter px-4 text-center">
                {goalType === 'scored' ? 'Goal Scored' : 'Goal Conceded'}
              </th>
              <th className="pb-6 text-[11px] font-black text-slate-400 uppercase tracking-tighter px-4 text-center">Avg. Overall</th>
              <th className="pb-6 text-[11px] font-black text-slate-400 uppercase tracking-tighter px-4 text-center">Avg. Home</th>
              <th className="pb-6 text-[11px] font-black text-slate-400 uppercase tracking-tighter px-4 text-center">Avg. Away</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50/50">
            {standings.map((row, idx) => {
              const data = row[filter];
              return (
                <tr key={row.team.id} className={`group transition-colors ${idx % 2 === 1 ? 'bg-slate-50/30' : ''} hover:bg-slate-50/80`}>
                  <td className="py-6 text-[12px] font-black text-slate-400 px-4 text-center tabular-nums">{row.rank}</td>
                  <td className="py-6 px-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 p-1.5 shadow-sm group-hover:scale-110 transition-transform">
                        {row.team.logoUrl ? (
                          <img src={row.team.logoUrl} alt="" className="w-full h-full object-contain" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-slate-300">⚽</div>
                        )}
                      </div>
                      <span className="text-[13px] font-black text-slate-700 group-hover:text-brand-emerald transition-colors">{row.team.name}</span>
                    </div>
                  </td>
                  <td className="py-6 text-[13px] font-black text-slate-800 px-4 text-center tabular-nums">{data.played}</td>
                  <td className="py-6 text-[13px] font-black text-slate-800 px-4 text-center tabular-nums">
                    {goalType === 'scored' ? data.gf : data.ga}
                  </td>
                  <td className="py-6 text-[13px] font-black text-slate-600 px-4 text-center tabular-nums">
                    {(goalType === 'scored' ? row.overall.avgScored : row.overall.avgConceded).toFixed(2)}
                  </td>
                  <td className="py-6 text-[13px] font-black text-slate-600 px-4 text-center tabular-nums">
                    {(goalType === 'scored' ? row.home.avgScored : row.home.avgConceded).toFixed(2)}
                  </td>
                  <td className="py-6 text-[13px] font-black text-slate-600 px-4 text-center tabular-nums">
                    {(goalType === 'scored' ? row.away.avgScored : row.away.avgConceded).toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      );
    }

    return (
      <table className="w-full border-collapse">
        <thead>
          <tr className="text-left border-b border-slate-100/50">
            <th className="pb-6 text-[11px] font-black text-slate-400 uppercase tracking-tighter px-4 w-12 text-center">#</th>
            <th className="pb-6 text-[11px] font-black text-slate-400 uppercase tracking-tighter px-4">Team</th>
            <th className="pb-6 text-[11px] font-black text-slate-400 uppercase tracking-tighter px-4 text-center">MP</th>
            <th className="pb-6 text-[11px] font-black text-slate-400 uppercase tracking-tighter px-4 text-center">W</th>
            <th className="pb-6 text-[11px] font-black text-slate-400 uppercase tracking-tighter px-4 text-center">D</th>
            <th className="pb-6 text-[11px] font-black text-slate-400 uppercase tracking-tighter px-4 text-center">L</th>
            <th className="pb-6 text-[11px] font-black text-slate-400 uppercase tracking-tighter px-4 text-center">GF</th>
            <th className="pb-6 text-[11px] font-black text-slate-400 uppercase tracking-tighter px-4 text-center">GA</th>
            <th className="pb-6 text-[11px] font-black text-slate-400 uppercase tracking-tighter px-4 text-center">GD</th>
            <th className="pb-6 text-[11px] font-black text-slate-400 uppercase tracking-tighter px-4 text-center">Pts</th>
            <th className="pb-6 text-[11px] font-black text-slate-400 uppercase tracking-tighter px-4 text-center">PPG</th>
            <th className="pb-6 text-[11px] font-black text-slate-400 uppercase tracking-tighter px-4 min-w-[140px]">Last 5</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50/50">
          {standings.map((row, idx) => {
            const data = row[filter];
            return (
              <tr key={row.team.id} className={`group transition-colors ${idx % 2 === 1 ? 'bg-slate-50/30' : ''} hover:bg-slate-50/80`}>
                <td className="py-6 text-[12px] font-black text-slate-400 px-4 text-center tabular-nums">{row.rank}</td>
                <td className="py-6 px-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 p-1.5 shadow-sm group-hover:scale-110 transition-transform">
                      {row.team.logoUrl ? (
                        <img src={row.team.logoUrl} alt="" className="w-full h-full object-contain" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-slate-300">⚽</div>
                      )}
                    </div>
                    <span className="text-[13px] font-black text-slate-700 group-hover:text-brand-emerald transition-colors">{row.team.name}</span>
                  </div>
                </td>
                <td className="py-6 text-[13px] font-black text-slate-800 px-4 text-center tabular-nums">{data.played}</td>
                <td className="py-6 text-[13px] font-black text-slate-800 px-4 text-center tabular-nums">{data.wins}</td>
                <td className="py-6 text-[13px] font-black text-slate-800 px-4 text-center tabular-nums">{data.draws}</td>
                <td className="py-6 text-[13px] font-black text-slate-800 px-4 text-center tabular-nums">{data.losses}</td>
                <td className="py-6 text-[13px] font-black text-slate-800 px-4 text-center tabular-nums">{data.gf}</td>
                <td className="py-6 text-[13px] font-black text-slate-800 px-4 text-center tabular-nums">{data.ga}</td>
                <td className="py-6 text-[13px] font-black text-slate-800 px-4 text-center tabular-nums">{data.gd}</td>
                <td className="py-6 text-[13px] font-black text-slate-900 px-4 text-center tabular-nums">{data.points}</td>
                <td className="py-6 text-[13px] font-black text-slate-600 px-4 text-center tabular-nums">{data.ppg.toFixed(2)}</td>
                <td className="py-6 px-4">
                  <div className="flex items-center gap-1.5">
                    {row.form.map((res, i) => (
                      <div 
                        key={i} 
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black text-white shrink-0 shadow-sm ${getFormColor(res)}`}
                      >
                        {res}
                      </div>
                    ))}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Sub-Navigation */}
      <div className="relative mb-8 group">
         <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth border-b border-slate-100">
            {subTabs.map((tab) => (
               <button
                  key={tab}
                  onClick={() => setActiveSubTab(tab)}
                  className={`px-6 py-4 text-[11px] md:text-[13px] font-black uppercase tracking-widest whitespace-nowrap transition-all relative ${
                     activeSubTab === tab 
                        ? 'text-brand-emerald' 
                        : 'text-slate-400 hover:text-slate-600'
                  }`}
               >
                  {tab}
                  {activeSubTab === tab && (
                     <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand-emerald rounded-t-full" />
                  )}
               </button>
            ))}
         </div>
      </div>

      {/* Standings Table Container */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Table Header Section */}
        <div className="bg-brand-emerald px-8 py-5">
          <h3 className="text-white font-black uppercase tracking-[0.2em] text-sm">{activeSubTab}</h3>
        </div>
        
        <div className="p-4 md:p-8">
          {/* Toggles & Stage Selection */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
             <div className="flex items-center gap-3">
                <div className="relative">
                   <select 
                      value={activeSubTab === 'Goals' ? goalType : activeSubTab === 'Cards' ? 'Card Stage' : activeSubTab === 'Over Under Goals' ? ouMode : activeSubTab === 'Match Scoring / Conceding First' ? scoringFirstMode : 'League Stage'}
                      onChange={(e) => {
                         if (activeSubTab === 'Goals') setGoalType(e.target.value as any);
                         if (activeSubTab === 'Over Under Goals') setOuMode(e.target.value as any);
                         if (activeSubTab === 'Match Scoring / Conceding First') setScoringFirstMode(e.target.value as any);
                      }}
                      className="appearance-none bg-white border border-slate-200 rounded-2xl px-6 py-2.5 pr-12 text-[11px] font-black text-slate-600 uppercase tracking-widest focus:outline-none focus:border-brand-emerald transition-colors shadow-sm cursor-pointer"
                   >
                      {activeSubTab === 'Goals' ? (
                        <>
                          <option value="scored">Goal Scored</option>
                          <option value="conceded">Goal Conceded</option>
                        </>
                      ) : activeSubTab === 'Corners' ? (
                        <option value="corners">Corners</option>
                      ) : activeSubTab === 'Cards' ? (
                        <option value="cards">Cards</option>
                      ) : activeSubTab === 'Over Under Goals' ? (
                        <>
                          <option value="over">Over</option>
                          <option value="under">Under</option>
                        </>
                      ) : activeSubTab === 'Match Scoring / Conceding First' ? (
                        <>
                          <option value="scoring">Scoring First</option>
                          <option value="conceding">Conceding First</option>
                        </>
                      ) : (
                        <option>League Stage</option>
                      )}
                   </select>
                   <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                   </div>
                </div>

                <div className="flex items-center gap-3 p-1.5 bg-slate-50 rounded-[20px] border border-slate-100 overflow-x-auto no-scrollbar">
                   {activeSubTab === 'Over Under Goals' ? (
                     ['0.5', '1.5', '2.5', '3.5', '4.5', '5.5'].map((line) => {
                       const val = line.replace('.', '');
                       return (
                         <button
                            key={val}
                            onClick={() => setOuLine(val as any)}
                            className={`px-6 py-2.5 rounded-[14px] text-[11px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                               ouLine === val 
                                  ? 'bg-brand-pink text-white shadow-lg shadow-brand-pink/20' 
                                  : 'text-slate-400 hover:text-slate-600'
                            }`}
                         >
                            {ouMode === 'over' ? 'Over' : 'Under'} {line}
                         </button>
                       );
                     })
                   ) : activeSubTab === 'Cards' ? (
                     ['overall', 'for', 'against'].map((type) => (
                       <button
                          key={type}
                          onClick={() => setActiveCardToggle(type as any)}
                          className={`px-8 py-2.5 rounded-[14px] text-[11px] font-black uppercase tracking-widest transition-all ${
                             activeCardToggle === type 
                                ? 'bg-brand-pink text-white shadow-lg shadow-brand-pink/20' 
                                : 'text-slate-400 hover:text-slate-600'
                          }`}
                       >
                          Cards {type === 'overall' ? 'Overall' : type}
                       </button>
                     ))
                   ) : activeSubTab === 'Match Scoring / Conceding First' ? (
                     ['overall', 'home', 'away'].map((type) => (
                       <button
                          key={type}
                          onClick={() => setFilter(type as any)}
                          className={`px-8 py-2.5 rounded-[14px] text-[11px] font-black uppercase tracking-widest transition-all ${
                             filter === type 
                                ? 'bg-brand-pink text-white shadow-lg shadow-brand-pink/20' 
                                : 'text-slate-400 hover:text-slate-600'
                          }`}
                       >
                          {type}
                       </button>
                     ))
                   ) : (
                     ['overall', 'home', 'away'].map((type) => (
                       <button
                          key={type}
                          onClick={() => setFilter(type as any)}
                          className={`px-8 py-2.5 rounded-[14px] text-[11px] font-black uppercase tracking-widest transition-all ${
                             filter === type 
                                ? 'bg-brand-pink text-white shadow-lg shadow-brand-pink/20' 
                                : 'text-slate-400 hover:text-slate-600'
                          }`}
                       >
                          {type}
                       </button>
                     ))
                   )}
                </div>
             </div>
          </div>

          <div className="overflow-x-auto -mx-4 md:mx-0">
             {renderTableContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
