'use client';

import React, { useState, useEffect } from 'react';
import { FiCalendar, FiClock, FiLoader, FiAlertCircle } from 'react-icons/fi';
import { getLivePredictions } from '@/lib/api/predictions';
import { Prediction } from '@/lib/api/types';

interface ComboLeg {
    id: number;
    time: string;
    date: string;
    homeTeam: { name: string; logo: string };
    awayTeam: { name: string; logo: string };
    selection: string;
    odds: number;
    league: string;
    result?: string; // e.g. "1 : 0"
}

interface ComboData {
    date: string;
    legs: ComboLeg[];
}

export default function ComboHero() {
    const [activeTab, setActiveTab] = useState('Today');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [combos, setCombos] = useState<Record<string, ComboData>>({});
    
    const tabs = ['Today', 'Upcoming', 'Results'];

    const fetchCombos = async () => {
        setLoading(true);
        setError(null);
        try {
            const today = new Date().toISOString().split('T')[0];
            const tomorrowDate = new Date();
            tomorrowDate.setDate(tomorrowDate.getDate() + 1);
            const tomorrow = tomorrowDate.toISOString().split('T')[0];

            const yesterdayDate = new Date();
            yesterdayDate.setDate(yesterdayDate.getDate() - 1);
            const yesterday = yesterdayDate.toISOString().split('T')[0];

            const twoDaysAgoDate = new Date();
            twoDaysAgoDate.setDate(twoDaysAgoDate.getDate() - 2);
            const twoDaysAgo = twoDaysAgoDate.toISOString().split('T')[0];

            const threeDaysAgoDate = new Date();
            threeDaysAgoDate.setDate(threeDaysAgoDate.getDate() - 3);
            const threeDaysAgo = threeDaysAgoDate.toISOString().split('T')[0];

            const dayAfterTomorrowDate = new Date();
            dayAfterTomorrowDate.setDate(dayAfterTomorrowDate.getDate() + 2);
            const dayAfterTomorrow = dayAfterTomorrowDate.toISOString().split('T')[0];

            // Fetch using getLivePredictions which hits the 3rd party provider more directly
            const [todayRes, tomorrowRes, dayAfterTomorrowRes, yesterdayRes, twoDaysAgoRes, threeDaysAgoRes] = await Promise.all([
                getLivePredictions(today, 1, 4),
                getLivePredictions(tomorrow, 1, 4),
                getLivePredictions(dayAfterTomorrow, 1, 4),
                getLivePredictions(yesterday, 1, 4),
                getLivePredictions(twoDaysAgo, 1, 4),
                getLivePredictions(threeDaysAgo, 1, 4)
            ]);

            const mapToComboLeg = (p: Prediction): ComboLeg => {
                // Heuristic for odds based on probability string/number from live API
                const probValue = typeof p.probability === 'string' ? parseInt(p.probability) : (p.probability || 50);
                const calculatedOdds = Math.max(1.10, parseFloat((100 / (probValue || 50)).toFixed(2)));

                return {
                    id: p.id || p.matchId,
                    time: p.kickoffAt ? new Date(p.kickoffAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '20:00',
                    date: p.kickoffAt ? new Date(p.kickoffAt).toLocaleDateString([], { day: '2-digit', month: '2-digit' }) : '---',
                    homeTeam: { 
                        name: p.homeTeam?.name || 'Home', 
                        logo: p.homeTeam?.logoUrl || p.homeTeam?.logo || 'https://media.api-sports.io/football/teams/placeholder.png' 
                    },
                    awayTeam: { 
                        name: p.awayTeam?.name || 'Away', 
                        logo: p.awayTeam?.logoUrl || p.awayTeam?.logo || 'https://media.api-sports.io/football/teams/placeholder.png' 
                    },
                    selection: p.selection || 'Over 1.5 Goals',
                    odds: calculatedOdds,
                    league: p.league?.name || 'League',
                    result: (p.score && typeof p.score.home === 'number' && typeof p.score.away === 'number') 
                        ? `${p.score.home} : ${p.score.away}` 
                        : undefined
                };
            };

            const newCombos: Record<string, ComboData> = {
                Today: {
                    date: new Date().toLocaleDateString('en-US', { weekday: 'long', day: '2-digit', month: '2-digit' }),
                    legs: (todayRes.items || []).map(mapToComboLeg)
                },
                Tomorrow: {
                    date: tomorrowDate.toLocaleDateString('en-US', { weekday: 'long', day: '2-digit', month: '2-digit' }),
                    legs: (tomorrowRes.items || []).map(mapToComboLeg)
                },
                DayAfterTomorrow: {
                    date: dayAfterTomorrowDate.toLocaleDateString('en-US', { weekday: 'long', day: '2-digit', month: '2-digit' }),
                    legs: (dayAfterTomorrowRes.items || []).map(mapToComboLeg)
                },
                Results: {
                    date: yesterdayDate.toLocaleDateString('en-US', { weekday: 'long', day: '2-digit', month: '2-digit' }),
                    legs: (yesterdayRes.items || []).map(mapToComboLeg)
                },
                TwoDaysAgo: {
                    date: twoDaysAgoDate.toLocaleDateString('en-US', { weekday: 'long', day: '2-digit', month: '2-digit' }),
                    legs: (twoDaysAgoRes.items || []).map(mapToComboLeg)
                },
                ThreeDaysAgo: {
                    date: threeDaysAgoDate.toLocaleDateString('en-US', { weekday: 'long', day: '2-digit', month: '2-digit' }),
                    legs: (threeDaysAgoRes.items || []).map(mapToComboLeg)
                }
            };

            setCombos(newCombos);
        } catch (err) {
            console.error('Failed to fetch predictions:', err);
            setError('Failed to load predictions. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCombos();
    }, []);
    
    const renderComboCard = (dayKey: string, label?: string, showScore: boolean = true) => {
        const data = combos[dayKey];
        if (!data || data.legs.length === 0) {
            return (
                <div key={dayKey} className="bg-white rounded-[32px] p-20 flex flex-col items-center justify-center border border-slate-100 mb-10 text-slate-400">
                    <FiCalendar className="w-12 h-12 mb-4 text-slate-200" />
                    <span className="font-bold uppercase tracking-widest text-xs">No combo available for this day</span>
                </div>
            );
        }

        const totalOdds = data.legs.reduce((acc, leg) => acc * leg.odds, 1).toFixed(2);
        const title = label || `${dayKey}'s Expert Combo`;

        return (
            <div key={dayKey} className="bg-brand-emerald rounded-[32px] overflow-hidden shadow-2xl relative group mb-10 last:mb-0">
                {/* Subtle Lighting Effect */}
                <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/20 rounded-full blur-[80px] pointer-events-none"></div>
                <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-brand-pink/10 rounded-full blur-[80px] pointer-events-none"></div>

                <div className="p-8 pb-4 relative z-10">
                    <h2 className="text-white text-2xl font-black flex items-center gap-3">
                        {title}
                    </h2>
                    <div className="flex items-center gap-2 text-white/80 text-xs font-bold mt-2 uppercase tracking-widest leading-none">
                        <FiCalendar className="text-white/60 mb-0.5" />
                        {data.date}
                    </div>
                </div>

                <div className="p-4 space-y-3 relative z-10">
                    {data.legs.map((leg) => (
                        <div key={leg.id} className="bg-white rounded-2xl p-4 md:p-6 group hover:shadow-xl transition-all border border-transparent hover:border-brand-emerald/10 transform hover:scale-[1.01]">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-1.5 h-1.5 rounded-full bg-brand-emerald"></div>
                                        <span className="text-slate-900 font-black text-[13px] tracking-tight">{leg.selection}</span>
                                    </div>
                                    <div className="flex items-center gap-8">
                                        <div className="flex flex-col gap-2.5 min-w-[140px]">
                                            <div className="flex items-center gap-3">
                                                <div className="w-6 h-6 bg-slate-50 rounded-lg flex items-center justify-center p-1 border border-slate-100">
                                                    <img src={leg.homeTeam.logo} alt="" className="w-full h-full object-contain" />
                                                </div>
                                                <span className="text-[11px] font-bold text-slate-700">{leg.homeTeam.name}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-6 h-6 bg-slate-50 rounded-lg flex items-center justify-center p-1 border border-slate-100">
                                                    <img src={leg.awayTeam.logo} alt="" className="w-full h-full object-contain" />
                                                </div>
                                                <span className="text-[11px] font-bold text-slate-700">{leg.awayTeam.name}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-1 text-[9px] font-black text-slate-400 border-l border-slate-100 pl-6 uppercase tracking-wider">
                                            <div className="flex items-center gap-1.5"><FiClock className="w-3 h-3 text-brand-emerald" /> {leg.time}</div>
                                            <div>{leg.date}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    {showScore && leg.result && (
                                        <div className="bg-slate-50 px-4 py-4 rounded-xl flex flex-col items-center justify-center min-w-[70px] border border-slate-100 shadow-sm">
                                            <span className="text-[10px] font-black text-slate-400 mb-0.5">SCORE</span>
                                            <span className="text-sm font-black text-slate-900 leading-none">{leg.result}</span>
                                        </div>
                                    )}
                                    <div className="bg-slate-50 px-6 py-4 rounded-xl flex flex-col items-center justify-center min-w-[90px] border border-slate-100 shadow-sm transition-transform group-hover:bg-white group-hover:scale-105">
                                        <span className="text-[10px] font-black text-slate-400 mb-0.5">ODDS</span>
                                        <span className="text-xl font-black text-slate-900 leading-none">{leg.odds}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Total Odds Footer */}
                <div className="p-8 bg-black/5 backdrop-blur-md flex flex-col items-center relative z-10">
                    <span className="text-white/60 text-[10px] font-black uppercase tracking-[0.3em] mb-3">Total Combined Odds</span>
                    <div className="bg-white px-10 py-3.5 rounded-2xl shadow-xl shadow-black/10 border border-white/10 transform -rotate-1">
                        <span className="text-brand-emerald text-3xl font-black tracking-tighter italic">{totalOdds}</span>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="w-full h-[600px] flex flex-col items-center justify-center text-brand-emerald bg-slate-50/50 rounded-[40px] border border-slate-100">
                <FiLoader className="w-12 h-12 animate-spin mb-6" />
                <span className="font-black text-lg tracking-tighter uppercase">Curating Expert Picks...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full h-[400px] flex flex-col items-center justify-center text-slate-400 bg-white rounded-[40px] border border-slate-100">
                <FiAlertCircle className="w-12 h-12 mb-4 text-brand-pink/50" />
                <span className="font-black text-lg tracking-tighter uppercase mb-2">Connection Error</span>
                <p className="text-sm font-medium">{error}</p>
                <button 
                    onClick={fetchCombos}
                    className="mt-6 px-8 py-3 bg-brand-emerald text-white font-black rounded-2xl shadow-lg shadow-brand-emerald/20 active:scale-95 transition-all"
                >
                    RETRY FETCH
                </button>
            </div>
        );
    }

    return (
        <section className="w-full">
            {/* Tabs */}
            <div className="flex gap-2 mb-8">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-8 py-2.5 rounded-xl font-bold text-sm transition-all ${
                            activeTab === tab 
                            ? 'bg-brand-emerald text-white shadow-lg shadow-brand-emerald/20' 
                            : 'bg-white text-slate-400 hover:text-slate-600 border border-slate-100'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {activeTab === 'Today' && renderComboCard('Today')}
                
                {activeTab === 'Upcoming' && (
                    <>
                        {renderComboCard('Tomorrow', "Tomorrow's Expert Combo", false)}
                        {renderComboCard('DayAfterTomorrow', "Monday's Expert Combo", false)}
                    </>
                )}

                {activeTab === 'Results' && (
                    <>
                        {renderComboCard('Results', "Yesterday's Expert Combo")}
                        {renderComboCard('TwoDaysAgo', "Previous Expert Combo")}
                        {renderComboCard('ThreeDaysAgo', "Past Expert Combo")}
                    </>
                )}
            </div>
        </section>
    );
}
