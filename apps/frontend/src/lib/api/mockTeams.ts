import type { TeamDetailResponse, TabResponse } from './types';

export const MOCK_TEAMS = [
    {
        id: 39,
        team: { id: 33, name: "Manchester United", slug: "33-manchester-united", logoUrl: "https://media.api-sports.io/football/teams/33.png" },
        venue: { name: "Old Trafford", city: "Manchester" }
    },
    {
        id: 42,
        team: { id: 42, name: "Arsenal", slug: "42-arsenal", logoUrl: "https://media.api-sports.io/football/teams/42.png" },
        venue: { name: "Emirates Stadium", city: "London" }
    }
];

export const MOCK_TEAM_DETAIL = {
    team: {
        id: 33,
        name: "Mock Team (API Disabled)",
        slug: "33-mock-team",
        logoUrl: "https://media.api-sports.io/football/teams/33.png",
        country: "England",
        venue: "Mock Stadium",
        city: "Mock City"
    },
    competitions: [
        { id: 39, name: "Premier League", logo: "https://media.api-sports.io/football/leagues/39.png", type: "League", country: "England", season: 2025 }
    ],
    nextMatch: null,
    nextMatchDetail: null,
    recentMatches: [],
    statsSummary: {
        overall: { played: 10, wins: 5, draws: 3, losses: 2 },
        home: { played: 5, wins: 3, draws: 1, losses: 1 },
        away: { played: 5, wins: 2, draws: 2, losses: 1 },
        cleanSheets: 4, homeCleanSheets: 2, awayCleanSheets: 2,
        bttsRate: 50, homeBttsRate: 60, awayBttsRate: 40,
        failedToScoreRate: 10, homeFailedToScoreRate: 0, awayFailedToScoreRate: 20,
        ppg: 1.8, goalsScoredAvg: 1.5, goalsConcededAvg: 0.8, cornersAvg: 5.5, cardsAvg: 2.1,
        cornersForAvg: 6.0, cornersAgainstAvg: 4.0, cardsForAvg: 1.5, cardsAgainstAvg: 2.5
    },
    standings: [{
        rank: 1,
        team: { id: 33, name: "Mock Team", slug: "33-mock-team", logoUrl: "https://media.api-sports.io/football/teams/33.png" },
        overall: { played: 10, wins: 5, draws: 3, losses: 2, gf: 15, ga: 8, gd: 7, points: 18, ppg: 1.8, avgScored: 1.5, avgConceded: 0.8 },
        home: { played: 5, wins: 3, draws: 1, losses: 1, gf: 8, ga: 3, gd: 5, points: 10, ppg: 2.0, avgScored: 1.6, avgConceded: 0.6 },
        away: { played: 5, wins: 2, draws: 2, losses: 1, gf: 7, ga: 5, gd: 2, points: 8, ppg: 1.6, avgScored: 1.4, avgConceded: 1.0 },
        form: ["W", "D", "W", "L", "W"]
    }],
    squad: [],
    topScorers: [],
    topAssists: [],
    detailedStats: null,
    activeLeagueId: 39
} as unknown as TeamDetailResponse;

export const MOCK_TAB = {
    team: { id: 33, name: "Mock Team", slug: "33-mock-team", logoUrl: "https://media.api-sports.io/football/teams/33.png" },
    tab: "fixtures",
    items: []
} as unknown as TabResponse;
