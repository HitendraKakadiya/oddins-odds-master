#!/usr/bin/env tsx
/**
 * Database seed script for Stage 1
 * 
 * Creates a realistic sample dataset covering:
 * - Countries, leagues, seasons, teams, venues
 * - Matches (past, today, upcoming)
 * - Odds (bookmakers, markets, snapshots)
 * - Predictions (models, predictions, tips)
 * - Articles (academy + blog)
 * - Users, favourites, alerts
 * 
 * Idempotent: uses upserts based on provider IDs and unique slugs
 */

import { Pool } from 'pg';

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://oddins:oddins_dev@localhost:5433/oddins_odds';

const pool = new Pool({ connectionString: DATABASE_URL });

// Helper to get today's date in YYYY-MM-DD format
function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

// Helper to add days to a date
function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}


// Helper to format datetime as ISO string
function formatDateTime(date: Date): string {
  return date.toISOString();
}

async function seed() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    console.log('🌱 Starting database seed...\n');

    const counts: Record<string, number> = {};

    // ==================== COUNTRIES ====================
    console.log('📍 Seeding countries...');
    const countries = [
      { name: 'England', code: 'GB', flag_url: 'https://media.api-sports.io/flags/gb.svg' },
      { name: 'Spain', code: 'ES', flag_url: 'https://media.api-sports.io/flags/es.svg' },
      { name: 'Germany', code: 'DE', flag_url: 'https://media.api-sports.io/flags/de.svg' },
      { name: 'Italy', code: 'IT', flag_url: 'https://media.api-sports.io/flags/it.svg' },
      { name: 'France', code: 'FR', flag_url: 'https://media.api-sports.io/flags/fr.svg' },
      { name: 'World', code: null, flag_url: null },
    ];

    const countryIds: Record<string, number> = {};
    for (const country of countries) {
      const res = await client.query(
        `INSERT INTO countries (name, code, flag_url)
         VALUES ($1, $2, $3)
         ON CONFLICT (name) DO UPDATE SET code = $2, flag_url = $3
         RETURNING id`,
        [country.name, country.code, country.flag_url]
      );
      countryIds[country.name] = res.rows[0].id;
    }
    counts.countries = countries.length;

    // ==================== LEAGUES ====================
    console.log('🏆 Seeding leagues...');
    const leagues = [
      { provider_id: 39, country: 'England', name: 'Premier League', type: 'League', slug: 'premier-league', logo: 'https://media.api-sports.io/football/leagues/39.png' },
      { provider_id: 140, country: 'Spain', name: 'La Liga', type: 'League', slug: 'la-liga', logo: 'https://media.api-sports.io/football/leagues/140.png' },
      { provider_id: 78, country: 'Germany', name: 'Bundesliga', type: 'League', slug: 'bundesliga', logo: 'https://media.api-sports.io/football/leagues/78.png' },
      { provider_id: 135, country: 'Italy', name: 'Serie A', type: 'League', slug: 'serie-a', logo: 'https://media.api-sports.io/football/leagues/135.png' },
      { provider_id: 61, country: 'France', name: 'Ligue 1', type: 'League', slug: 'ligue-1', logo: 'https://media.api-sports.io/football/leagues/61.png' },
      { provider_id: 2, country: 'World', name: 'UEFA Champions League', type: 'Cup', slug: 'champions-league', logo: 'https://media.api-sports.io/football/leagues/2.png' },
      { provider_id: 3, country: 'World', name: 'UEFA Europa League', type: 'Cup', slug: 'europa-league', logo: 'https://media.api-sports.io/football/leagues/3.png' },
    ];

    const leagueIds: Record<string, number> = {};
    for (const league of leagues) {
      const res = await client.query(
        `INSERT INTO leagues (provider_league_id, country_id, name, type, logo_url, slug)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (provider_league_id) DO UPDATE 
         SET name = $3, type = $4, logo_url = $5, slug = $6
         RETURNING id`,
        [league.provider_id, countryIds[league.country], league.name, league.type, league.logo, league.slug]
      );
      leagueIds[league.slug] = res.rows[0].id;
    }
    counts.leagues = leagues.length;

    // ==================== SEASONS ====================
    console.log('📅 Seeding seasons...');
    const currentYear = new Date().getFullYear();
    const seasonIds: Record<string, number> = {};

    for (const [slug, leagueId] of Object.entries(leagueIds)) {
      const res = await client.query(
        `INSERT INTO seasons (league_id, year, start_date, end_date, is_current)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (league_id, year) DO UPDATE 
         SET is_current = $5
         RETURNING id`,
        [leagueId, currentYear, `${currentYear}-08-01`, `${currentYear + 1}-05-31`, true]
      );
      seasonIds[slug] = res.rows[0].id;

      // Insert season coverage
      await client.query(
        `INSERT INTO season_coverage (season_id, fixtures, events, lineups, stats_fixtures, stats_players, standings, injuries, predictions, odds)
         VALUES ($1, true, true, true, true, true, true, false, true, true)
         ON CONFLICT (season_id) DO NOTHING`,
        [res.rows[0].id]
      );
    }
    counts.seasons = Object.keys(seasonIds).length;

    // ==================== VENUES ====================
    console.log('🏟️  Seeding venues...');
    const venues = [
      { provider_id: 556, name: 'Old Trafford', city: 'Manchester', capacity: 76000, surface: 'grass' },
      { provider_id: 550, name: 'Anfield', city: 'Liverpool', capacity: 54000, surface: 'grass' },
      { provider_id: 562, name: 'Stamford Bridge', city: 'London', capacity: 40834, surface: 'grass' },
      { provider_id: 655, name: 'Emirates Stadium', city: 'London', capacity: 60260, surface: 'grass' },
      { provider_id: 738, name: 'Santiago Bernabéu', city: 'Madrid', capacity: 81044, surface: 'grass' },
      { provider_id: 1492, name: 'Camp Nou', city: 'Barcelona', capacity: 99354, surface: 'grass' },
      { provider_id: 743, name: 'Signal Iduna Park', city: 'Dortmund', capacity: 81365, surface: 'grass' },
      { provider_id: 700, name: 'Allianz Arena', city: 'Munich', capacity: 75000, surface: 'grass' },
    ];

    const venueIds: Record<number, number> = {};
    for (const venue of venues) {
      const res = await client.query(
        `INSERT INTO venues (provider_venue_id, name, city, capacity, surface)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (provider_venue_id) DO UPDATE 
         SET name = $2, city = $3, capacity = $4, surface = $5
         RETURNING id`,
        [venue.provider_id, venue.name, venue.city, venue.capacity, venue.surface]
      );
      venueIds[venue.provider_id] = res.rows[0].id;
    }
    counts.venues = venues.length;

    // ==================== TEAMS ====================
    console.log('⚽ Seeding teams...');
    const teams = [
      // Premier League
      { provider_id: 33, country: 'England', venue_id: 556, name: 'Manchester United', short: 'MUN', slug: 'manchester-united', logo: 'https://media.api-sports.io/football/teams/33.png', league: 'premier-league' },
      { provider_id: 40, country: 'England', venue_id: 550, name: 'Liverpool', short: 'LIV', slug: 'liverpool', logo: 'https://media.api-sports.io/football/teams/40.png', league: 'premier-league' },
      { provider_id: 49, country: 'England', venue_id: 562, name: 'Chelsea', short: 'CHE', slug: 'chelsea', logo: 'https://media.api-sports.io/football/teams/49.png', league: 'premier-league' },
      { provider_id: 42, country: 'England', venue_id: 655, name: 'Arsenal', short: 'ARS', slug: 'arsenal', logo: 'https://media.api-sports.io/football/teams/42.png', league: 'premier-league' },
      { provider_id: 50, country: 'England', venue_id: null, name: 'Manchester City', short: 'MCI', slug: 'manchester-city', logo: 'https://media.api-sports.io/football/teams/50.png', league: 'premier-league' },

      // La Liga
      { provider_id: 541, country: 'Spain', venue_id: 738, name: 'Real Madrid', short: 'RMA', slug: 'real-madrid', logo: 'https://media.api-sports.io/football/teams/541.png', league: 'la-liga' },
      { provider_id: 529, country: 'Spain', venue_id: 1492, name: 'Barcelona', short: 'BAR', slug: 'barcelona', logo: 'https://media.api-sports.io/football/teams/529.png', league: 'la-liga' },
      { provider_id: 530, country: 'Spain', venue_id: null, name: 'Atlético Madrid', short: 'ATM', slug: 'atletico-madrid', logo: 'https://media.api-sports.io/football/teams/530.png', league: 'la-liga' },

      // Bundesliga
      { provider_id: 157, country: 'Germany', venue_id: 700, name: 'Bayern Munich', short: 'BAY', slug: 'bayern-munich', logo: 'https://media.api-sports.io/football/teams/157.png', league: 'bundesliga' },
      { provider_id: 165, country: 'Germany', venue_id: 743, name: 'Borussia Dortmund', short: 'BVB', slug: 'borussia-dortmund', logo: 'https://media.api-sports.io/football/teams/165.png', league: 'bundesliga' },

      // Serie A
      { provider_id: 489, country: 'Italy', venue_id: null, name: 'AC Milan', short: 'MIL', slug: 'ac-milan', logo: 'https://media.api-sports.io/football/teams/489.png', league: 'serie-a' },
      { provider_id: 505, country: 'Italy', venue_id: null, name: 'Inter', short: 'INT', slug: 'inter', logo: 'https://media.api-sports.io/football/teams/505.png', league: 'serie-a' },

      // Ligue 1
      { provider_id: 85, country: 'France', venue_id: null, name: 'Paris Saint Germain', short: 'PSG', slug: 'psg', logo: 'https://media.api-sports.io/football/teams/85.png', league: 'ligue-1' },
      { provider_id: 81, country: 'France', venue_id: null, name: 'Marseille', short: 'MAR', slug: 'marseille', logo: 'https://media.api-sports.io/football/teams/81.png', league: 'ligue-1' },
    ];

    const teamIds: Record<string, number> = {};
    for (const team of teams) {
      const res = await client.query(
        `INSERT INTO teams (provider_team_id, country_id, venue_id, name, short_name, slug, logo_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (provider_team_id) DO UPDATE 
         SET name = $4, short_name = $5, slug = $6, logo_url = $7, venue_id = $3
         RETURNING id`,
        [team.provider_id, countryIds[team.country], team.venue_id ? venueIds[team.venue_id] : null, team.name, team.short, team.slug, team.logo]
      );
      teamIds[team.slug] = res.rows[0].id;
    }
    counts.teams = teams.length;

    // ==================== SEASON_TEAMS ====================
    console.log('🔗 Linking teams to seasons...');
    let seasonTeamsCount = 0;
    for (const team of teams) {
      const seasonId = seasonIds[team.league];
      const teamId = teamIds[team.slug];
      await client.query(
        `INSERT INTO season_teams (season_id, team_id)
         VALUES ($1, $2)
         ON CONFLICT DO NOTHING`,
        [seasonId, teamId]
      );
      seasonTeamsCount++;
    }
    counts.season_teams = seasonTeamsCount;

    // ==================== MATCHES ====================
    console.log('⚽ Seeding matches...');
    const today = new Date();
    const matchData: Array<{
      provider_id: number;
      season_slug: string;
      home_slug: string;
      away_slug: string;
      venue_id: number | null;
      kickoff: Date;
      status: string;
      elapsed: number | null;
      home_goals: number | null;
      away_goals: number | null;
      ht_home: number | null;
      ht_away: number | null;
    }> = [];

    let fixtureId = 1000000;

    // Past week matches (completed)
    const pastMatches = [
      { home: 'manchester-united', away: 'liverpool', league: 'premier-league', days: -5, home_goals: 2, away_goals: 1, ht_home: 1, ht_away: 0, venue: 556 },
      { home: 'chelsea', away: 'arsenal', league: 'premier-league', days: -4, home_goals: 1, away_goals: 1, ht_home: 0, ht_away: 1, venue: 562 },
      { home: 'real-madrid', away: 'barcelona', league: 'la-liga', days: -6, home_goals: 3, away_goals: 2, ht_home: 2, ht_away: 1, venue: 738 },
      { home: 'bayern-munich', away: 'borussia-dortmund', league: 'bundesliga', days: -3, home_goals: 4, away_goals: 0, ht_home: 2, ht_away: 0, venue: 700 },
      { home: 'ac-milan', away: 'inter', league: 'serie-a', days: -2, home_goals: 1, away_goals: 2, ht_home: 0, ht_away: 1, venue: null },
      { home: 'psg', away: 'marseille', league: 'ligue-1', days: -1, home_goals: 3, away_goals: 0, ht_home: 1, ht_away: 0, venue: null },
      { home: 'liverpool', away: 'chelsea', league: 'premier-league', days: -7, home_goals: 2, away_goals: 2, ht_home: 1, ht_away: 1, venue: 550 },
      { home: 'barcelona', away: 'atletico-madrid', league: 'la-liga', days: -5, home_goals: 1, away_goals: 0, ht_home: 0, ht_away: 0, venue: 1492 },
      { home: 'manchester-city', away: 'arsenal', league: 'premier-league', days: -3, home_goals: 3, away_goals: 1, ht_home: 2, ht_away: 0, venue: null },
      { home: 'borussia-dortmund', away: 'bayern-munich', league: 'bundesliga', days: -6, home_goals: 0, away_goals: 1, ht_home: 0, ht_away: 0, venue: 743 },
    ];

    for (const match of pastMatches) {
      matchData.push({
        provider_id: fixtureId++,
        season_slug: match.league,
        home_slug: match.home,
        away_slug: match.away,
        venue_id: match.venue || null,
        kickoff: addDays(today, match.days),
        status: 'FT',
        elapsed: 90,
        home_goals: match.home_goals,
        away_goals: match.away_goals,
        ht_home: match.ht_home,
        ht_away: match.ht_away,
      });
    }

    // Today's matches
    const todayMatches = [
      { home: 'arsenal', away: 'manchester-united', league: 'premier-league', hours: 15, venue: 655 },
      { home: 'liverpool', away: 'manchester-city', league: 'premier-league', hours: 17, venue: 550 },
      { home: 'chelsea', away: 'liverpool', league: 'premier-league', hours: 20, venue: 562 },
      { home: 'real-madrid', away: 'atletico-madrid', league: 'la-liga', hours: 21, venue: 738 },
      { home: 'barcelona', away: 'real-madrid', league: 'la-liga', hours: 16, venue: 1492 },
      { home: 'bayern-munich', away: 'borussia-dortmund', league: 'bundesliga', hours: 18, venue: 700 },
      { home: 'ac-milan', away: 'inter', league: 'serie-a', hours: 19, venue: null },
      { home: 'psg', away: 'marseille', league: 'ligue-1', hours: 20, venue: null },
      { home: 'inter', away: 'ac-milan', league: 'serie-a', hours: 14, venue: null },
      { home: 'marseille', away: 'psg', league: 'ligue-1', hours: 17, venue: null },
    ];

    for (const match of todayMatches) {
      const kickoff = new Date(today);
      kickoff.setHours(match.hours, 0, 0, 0);
      matchData.push({
        provider_id: fixtureId++,
        season_slug: match.league,
        home_slug: match.home,
        away_slug: match.away,
        venue_id: match.venue || null,
        kickoff,
        status: 'NS',
        elapsed: null,
        home_goals: null,
        away_goals: null,
        ht_home: null,
        ht_away: null,
      });
    }

    // Upcoming matches (next 7 days)
    const upcomingMatches = [
      { home: 'manchester-united', away: 'chelsea', league: 'premier-league', days: 1, hours: 15, venue: 556 },
      { home: 'arsenal', away: 'liverpool', league: 'premier-league', days: 2, hours: 17, venue: 655 },
      { home: 'manchester-city', away: 'manchester-united', league: 'premier-league', days: 3, hours: 20, venue: null },
      { home: 'atletico-madrid', away: 'barcelona', league: 'la-liga', days: 1, hours: 21, venue: null },
      { home: 'real-madrid', away: 'barcelona', league: 'la-liga', days: 4, hours: 16, venue: 738 },
      { home: 'borussia-dortmund', away: 'bayern-munich', league: 'bundesliga', days: 2, hours: 18, venue: 743 },
      { home: 'inter', away: 'ac-milan', league: 'serie-a', days: 3, hours: 19, venue: null },
      { home: 'marseille', away: 'psg', league: 'ligue-1', days: 5, hours: 20, venue: null },
      { home: 'liverpool', away: 'arsenal', league: 'premier-league', days: 6, hours: 15, venue: 550 },
      { home: 'chelsea', away: 'manchester-city', league: 'premier-league', days: 7, hours: 17, venue: 562 },
      { home: 'barcelona', away: 'real-madrid', league: 'la-liga', days: 5, hours: 21, venue: 1492 },
      { home: 'bayern-munich', away: 'borussia-dortmund', league: 'bundesliga', days: 6, hours: 18, venue: 700 },
    ];

    for (const match of upcomingMatches) {
      const kickoff = addDays(today, match.days);
      kickoff.setHours(match.hours, 0, 0, 0);
      matchData.push({
        provider_id: fixtureId++,
        season_slug: match.league,
        home_slug: match.home,
        away_slug: match.away,
        venue_id: match.venue || null,
        kickoff,
        status: 'NS',
        elapsed: null,
        home_goals: null,
        away_goals: null,
        ht_home: null,
        ht_away: null,
      });
    }

    const matchIds: Record<number, number> = {};
    for (const match of matchData) {
      const res = await client.query(
        `INSERT INTO matches (
          provider_fixture_id, season_id, league_id, home_team_id, away_team_id, venue_id,
          kickoff_at, timezone, status, elapsed, home_goals, away_goals, ht_home_goals, ht_away_goals, last_provider_update_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        ON CONFLICT (provider_fixture_id) DO UPDATE
        SET status = $9, elapsed = $10, home_goals = $11, away_goals = $12, ht_home_goals = $13, ht_away_goals = $14
        RETURNING id`,
        [
          match.provider_id,
          seasonIds[match.season_slug],
          leagueIds[match.season_slug],
          teamIds[match.home_slug],
          teamIds[match.away_slug],
          match.venue_id ? venueIds[match.venue_id] : null,
          formatDateTime(match.kickoff),
          'UTC',
          match.status,
          match.elapsed,
          match.home_goals,
          match.away_goals,
          match.ht_home,
          match.ht_away,
          formatDateTime(new Date()),
        ]
      );
      matchIds[match.provider_id] = res.rows[0].id;
    }
    counts.matches = matchData.length;

    // ==================== TEAM_MATCH_STATS ====================
    console.log('📊 Seeding team match stats...');
    let statsCount = 0;
    // Add stats for completed matches
    for (const match of matchData.filter(m => m.status === 'FT')) {
      const matchId = matchIds[match.provider_id];
      const homeTeamId = teamIds[match.home_slug];
      const awayTeamId = teamIds[match.away_slug];

      const homeStats = {
        shots_on_goal: Math.floor(Math.random() * 8) + 3,
        shots_off_goal: Math.floor(Math.random() * 5) + 2,
        total_shots: 0,
        blocked_shots: Math.floor(Math.random() * 3),
        possession: Math.floor(Math.random() * 30) + 45,
        corners: Math.floor(Math.random() * 8) + 2,
        offsides: Math.floor(Math.random() * 4),
        fouls: Math.floor(Math.random() * 10) + 5,
        yellow_cards: Math.floor(Math.random() * 3),
        red_cards: Math.random() > 0.9 ? 1 : 0,
      };
      homeStats.total_shots = homeStats.shots_on_goal + homeStats.shots_off_goal;

      const awayStats = {
        shots_on_goal: Math.floor(Math.random() * 8) + 3,
        shots_off_goal: Math.floor(Math.random() * 5) + 2,
        total_shots: 0,
        blocked_shots: Math.floor(Math.random() * 3),
        possession: 100 - homeStats.possession,
        corners: Math.floor(Math.random() * 8) + 2,
        offsides: Math.floor(Math.random() * 4),
        fouls: Math.floor(Math.random() * 10) + 5,
        yellow_cards: Math.floor(Math.random() * 3),
        red_cards: Math.random() > 0.9 ? 1 : 0,
      };
      awayStats.total_shots = awayStats.shots_on_goal + awayStats.shots_off_goal;

      await client.query(
        `INSERT INTO team_match_stats (match_id, team_id, is_home, stats)
         VALUES ($1, $2, true, $3), ($1, $4, false, $5)
         ON CONFLICT (match_id, team_id) DO UPDATE SET stats = EXCLUDED.stats`,
        [matchId, homeTeamId, JSON.stringify(homeStats), awayTeamId, JSON.stringify(awayStats)]
      );
      statsCount += 2;
    }
    counts.team_match_stats = statsCount;

    // ==================== BOOKMAKERS ====================
    console.log('🎰 Seeding bookmakers...');
    const bookmakers = [
      { provider_id: 8, name: 'Bet365', slug: 'bet365' },
      { provider_id: 5, name: 'William Hill', slug: 'william-hill' },
    ];

    const bookmakerIds: Record<string, number> = {};
    for (const bookmaker of bookmakers) {
      const res = await client.query(
        `INSERT INTO bookmakers (provider_bookmaker_id, name, slug)
         VALUES ($1, $2, $3)
         ON CONFLICT (provider_bookmaker_id) DO UPDATE SET name = $2, slug = $3
         RETURNING id`,
        [bookmaker.provider_id, bookmaker.name, bookmaker.slug]
      );
      bookmakerIds[bookmaker.slug] = res.rows[0].id;
    }
    counts.bookmakers = bookmakers.length;

    // ==================== MARKETS ====================
    console.log('📈 Seeding markets...');
    const markets = [
      { provider_id: 1, name: 'Match Winner', key: 'FT_1X2', is_line: false },
      { provider_id: 5, name: 'Goals Over/Under', key: 'OU_GOALS', is_line: true },
      { provider_id: 8, name: 'Both Teams Score', key: 'BTTS', is_line: false },
      { provider_id: 12, name: 'Corners Over/Under', key: 'OU_CORNERS', is_line: true },
      { provider_id: 15, name: 'Cards Over/Under', key: 'OU_CARDS', is_line: true },
    ];

    const marketIds: Record<string, number> = {};
    for (const market of markets) {
      const res = await client.query(
        `INSERT INTO markets (provider_market_id, name, key, is_line_market)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (provider_market_id) DO UPDATE SET name = $2, key = $3, is_line_market = $4
         RETURNING id`,
        [market.provider_id, market.name, market.key, market.is_line]
      );
      marketIds[market.key] = res.rows[0].id;
    }
    counts.markets = markets.length;

    // ==================== ODDS SNAPSHOTS ====================
    console.log('💰 Seeding odds snapshots...');
    let snapshotCount = 0;
    let linesCount = 0;

    // Create odds for 20 matches (mix of past, today, upcoming)
    const matchesWithOdds = matchData.slice(0, 20);

    for (const match of matchesWithOdds) {
      const matchId = matchIds[match.provider_id];

      // Create 2 snapshots per match (one early, one recent)
      for (let i = 0; i < 2; i++) {
        const capturedAt = addDays(match.kickoff, -2 + i);

        for (const [_bookmakerSlug, bookmakerId] of Object.entries(bookmakerIds)) {
          const snapshotRes = await client.query(
            `INSERT INTO odds_snapshots (match_id, bookmaker_id, captured_at, source, is_live)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id`,
            [matchId, bookmakerId, formatDateTime(capturedAt), 'seed', false]
          );
          const snapshotId = snapshotRes.rows[0].id;
          snapshotCount++;

          // FT_1X2 lines
          const homeOdd = 1.5 + Math.random() * 3;
          const drawOdd = 2.5 + Math.random() * 2;
          const awayOdd = 1.5 + Math.random() * 3;

          await client.query(
            `INSERT INTO odds_snapshot_lines (snapshot_id, market_id, line, selection, odd_value, implied_prob, is_suspended)
             VALUES 
               ($1, $2, NULL, 'Home', $3, $4, false),
               ($1, $2, NULL, 'Draw', $5, $6, false),
               ($1, $2, NULL, 'Away', $7, $8, false)`,
            [
              snapshotId, marketIds['FT_1X2'],
              homeOdd, 1 / homeOdd,
              drawOdd, 1 / drawOdd,
              awayOdd, 1 / awayOdd,
            ]
          );
          linesCount += 3;

          // OU_GOALS lines (2.5)
          const overOdd = 1.7 + Math.random() * 0.6;
          const underOdd = 1.7 + Math.random() * 0.6;

          await client.query(
            `INSERT INTO odds_snapshot_lines (snapshot_id, market_id, line, selection, odd_value, implied_prob, is_suspended)
             VALUES 
               ($1, $2, 2.5, 'Over', $3, $4, false),
               ($1, $2, 2.5, 'Under', $5, $6, false)`,
            [
              snapshotId, marketIds['OU_GOALS'],
              overOdd, 1 / overOdd,
              underOdd, 1 / underOdd,
            ]
          );
          linesCount += 2;

          // BTTS lines
          const bttsYesOdd = 1.6 + Math.random() * 0.8;
          const bttsNoOdd = 1.6 + Math.random() * 0.8;

          await client.query(
            `INSERT INTO odds_snapshot_lines (snapshot_id, market_id, line, selection, odd_value, implied_prob, is_suspended)
             VALUES 
               ($1, $2, NULL, 'Yes', $3, $4, false),
               ($1, $2, NULL, 'No', $5, $6, false)`,
            [
              snapshotId, marketIds['BTTS'],
              bttsYesOdd, 1 / bttsYesOdd,
              bttsNoOdd, 1 / bttsNoOdd,
            ]
          );
          linesCount += 2;
        }
      }
    }
    counts.odds_snapshots = snapshotCount;
    counts.odds_snapshot_lines = linesCount;

    // ==================== PREDICTION MODELS ====================
    console.log('🤖 Seeding prediction models...');
    const models = [
      { name: 'Oddins ML v1', version: '1.0.0', source: 'internal', is_active: true },
      { name: 'API-Football Predictions', version: '1.0.0', source: 'api-football', is_active: false },
    ];

    const modelIds: Record<string, number> = {};
    for (const model of models) {
      const res = await client.query(
        `INSERT INTO prediction_models (name, version, source, is_active)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (name, version, source) DO UPDATE SET is_active = $4
         RETURNING id`,
        [model.name, model.version, model.source, model.is_active]
      );
      modelIds[model.name] = res.rows[0].id;
    }
    counts.prediction_models = models.length;

    // ==================== MATCH PREDICTIONS ====================
    console.log('🔮 Seeding match predictions...');
    let predictionCount = 0;

    // Create predictions for 20 matches
    for (const match of matchesWithOdds) {
      const matchId = matchIds[match.provider_id];
      const modelId = modelIds['Oddins ML v1'];

      // FT_1X2 prediction
      const homeWinProb = 0.2 + Math.random() * 0.5;
      const drawProb = 0.15 + Math.random() * 0.25;
      const awayWinProb = 1 - homeWinProb - drawProb;

      const selection = homeWinProb > awayWinProb ? 'Home' : 'Away';
      const probability = Math.max(homeWinProb, awayWinProb);

      await client.query(
        `INSERT INTO match_predictions (match_id, model_id, market_id, line, selection, payload, probability, confidence, generated_at)
         VALUES ($1, $2, $3, NULL, $4, $5, $6, $7, $8)`,
        [
          matchId,
          modelId,
          marketIds['FT_1X2'],
          selection,
          JSON.stringify({
            home_win_prob: homeWinProb,
            draw_prob: drawProb,
            away_win_prob: awayWinProb,
            expected_goals_home: 1.2 + Math.random() * 1.5,
            expected_goals_away: 1.0 + Math.random() * 1.5,
          }),
          probability,
          Math.floor(probability * 100),
          formatDateTime(addDays(match.kickoff, -1)),
        ]
      );
      predictionCount++;

      // OU_GOALS prediction
      const overProb = 0.4 + Math.random() * 0.3;
      await client.query(
        `INSERT INTO match_predictions (match_id, model_id, market_id, line, selection, payload, probability, confidence, generated_at)
         VALUES ($1, $2, $3, 2.5, $4, $5, $6, $7, $8)`,
        [
          matchId,
          modelId,
          marketIds['OU_GOALS'],
          overProb > 0.5 ? 'Over' : 'Under',
          JSON.stringify({ over_prob: overProb, under_prob: 1 - overProb }),
          Math.max(overProb, 1 - overProb),
          Math.floor(Math.max(overProb, 1 - overProb) * 100),
          formatDateTime(addDays(match.kickoff, -1)),
        ]
      );
      predictionCount++;
    }
    counts.match_predictions = predictionCount;

    // ==================== TIPS ====================
    console.log('💡 Seeding tips...');
    let tipCount = 0;

    // Create tips for 10 matches
    for (const match of matchesWithOdds.slice(0, 10)) {
      const matchId = matchIds[match.provider_id];

      const _isPremium = Math.random() > 0.6;
      const _confidence = 60 + Math.floor(Math.random() * 30);

      const titles = [
        'Strong Home Win Expected',
        'Value in Draw Market',
        'Over 2.5 Goals Likely',
        'Both Teams to Score',
        'Away Team Undervalued',
      ];

      const reasons = [
        'Home team in excellent form with 4 wins in last 5 matches',
        'Both teams struggling defensively, high-scoring game expected',
        'Historical H2H suggests tight contest',
        'Away team has strong away record this season',
        'Key injuries to home side could impact result',
      ];

      await client.query(
        `INSERT INTO tips (match_id, prediction_id, title, short_reason, tip_rank, published_at, is_premium)
         VALUES ($1, NULL, $2, $3, $4, $5, $6)`,
        [
          matchId,
          titles[Math.floor(Math.random() * titles.length)],
          reasons[Math.floor(Math.random() * reasons.length)],
          tipCount + 1,
          formatDateTime(addDays(match.kickoff, -2)),
          _isPremium,
        ]
      );
      tipCount++;
    }
    counts.tips = tipCount;

    // ==================== ARTICLES ====================
    console.log('📝 Seeding articles...');

    const academyArticles = [
      {
        slug: 'understanding-asian-handicaps',
        title: 'Understanding Asian Handicaps',
        summary: 'A comprehensive guide to Asian handicap betting',
        category: 'Betting Basics',
        body: '# Understanding Asian Handicaps\n\nAsian handicaps are a popular form of betting that eliminates the draw...\n\n## What is an Asian Handicap?\n\nAn Asian handicap gives one team a virtual head start...',
      },
      {
        slug: 'value-betting-explained',
        title: 'Value Betting Explained',
        summary: 'Learn how to identify value in betting markets',
        category: 'Strategy',
        body: '# Value Betting Explained\n\nValue betting is the cornerstone of profitable betting...\n\n## Finding Value\n\nValue exists when the odds offered are higher than the true probability...',
      },
      {
        slug: 'bankroll-management',
        title: 'Bankroll Management Guide',
        summary: 'Essential tips for managing your betting bankroll',
        category: 'Money Management',
        body: '# Bankroll Management\n\nProper bankroll management is crucial for long-term success...\n\n## The 1-5% Rule\n\nNever risk more than 1-5% of your bankroll on a single bet...',
      },
      {
        slug: 'reading-football-statistics',
        title: 'Reading Football Statistics',
        summary: 'How to interpret key football statistics',
        category: 'Analysis',
        body: '# Reading Football Statistics\n\nStatistics are essential for informed betting decisions...\n\n## Key Metrics\n\nExpected Goals (xG), possession, shots on target...',
      },
      {
        slug: 'in-play-betting-strategies',
        title: 'In-Play Betting Strategies',
        summary: 'Advanced strategies for live betting',
        category: 'Advanced',
        body: '# In-Play Betting Strategies\n\nLive betting offers unique opportunities...\n\n## Watching the Game\n\nAlways watch the match when betting in-play...',
      },
    ];

    for (const article of academyArticles) {
      await client.query(
        `INSERT INTO articles (type, slug, title, summary, body_md, category, published_at, updated_at, seo_title, seo_description)
         VALUES ('academy', $1, $2, $3, $4, $5, $6, $6, $2, $3)
         ON CONFLICT (slug) DO UPDATE SET title = $2, summary = $3, body_md = $4`,
        [
          article.slug,
          article.title,
          article.summary,
          article.body,
          article.category,
          formatDateTime(addDays(today, -30)),
        ]
      );
    }

    const blogArticles = [
      {
        slug: 'premier-league-week-20-preview',
        title: 'Premier League Week 20 Preview',
        summary: 'Our predictions for this weekend\'s Premier League fixtures',
        category: 'Match Previews',
        body: '# Premier League Week 20 Preview\n\nAnother exciting weekend of Premier League action...\n\n## Manchester United vs Liverpool\n\nThe standout fixture of the weekend...',
      },
      {
        slug: 'champions-league-betting-trends',
        title: 'Champions League Betting Trends',
        summary: 'Key trends to watch in the Champions League',
        category: 'Analysis',
        body: '# Champions League Betting Trends\n\nThe Champions League continues to provide great betting opportunities...\n\n## Home Advantage\n\nHome teams have won 65% of matches this season...',
      },
      {
        slug: 'top-5-upsets-this-season',
        title: 'Top 5 Upsets This Season',
        summary: 'The biggest shock results of the season so far',
        category: 'Features',
        body: '# Top 5 Upsets This Season\n\nThis season has been full of surprises...\n\n## 5. Underdog Victory\n\nNobody expected this result...',
      },
      {
        slug: 'january-transfer-window-impact',
        title: 'January Transfer Window Impact',
        summary: 'How January signings could affect betting markets',
        category: 'News',
        body: '# January Transfer Window Impact\n\nThe January transfer window is heating up...\n\n## Big Moves\n\nSeveral high-profile transfers could shift the odds...',
      },
      {
        slug: 'weekend-accumulator-tips',
        title: 'Weekend Accumulator Tips',
        summary: 'Our best accumulator picks for the weekend',
        category: 'Tips',
        body: '# Weekend Accumulator Tips\n\nLooking for an accumulator this weekend?\n\n## Our Picks\n\nWe\'ve identified four strong selections...',
      },
    ];

    for (const article of blogArticles) {
      await client.query(
        `INSERT INTO articles (type, slug, title, summary, body_md, category, published_at, updated_at, seo_title, seo_description)
         VALUES ('blog', $1, $2, $3, $4, $5, $6, $6, $2, $3)
         ON CONFLICT (slug) DO UPDATE SET title = $2, summary = $3, body_md = $4`,
        [
          article.slug,
          article.title,
          article.summary,
          article.body,
          article.category,
          formatDateTime(addDays(today, -Math.floor(Math.random() * 14))),
        ]
      );
    }
    counts.articles = academyArticles.length + blogArticles.length;

    // ==================== USERS ====================
    console.log('👤 Seeding users...');

    const userRes = await client.query(
      `INSERT INTO users (email, password_hash, display_name, role, created_at)
       VALUES ('demo@oddins.local', '$2b$10$abcdefghijklmnopqrstuvwxyz', 'Demo User', 'user', $1)
       ON CONFLICT (email) DO UPDATE SET display_name = 'Demo User'
       RETURNING id`,
      [formatDateTime(addDays(today, -60))]
    );
    const userId = userRes.rows[0].id;
    counts.users = 1;

    // User preferences
    await client.query(
      `INSERT INTO user_preferences (user_id, timezone, default_markets, default_leagues)
       VALUES ($1, 'Europe/London', $2, $3)
       ON CONFLICT (user_id) DO UPDATE SET timezone = 'Europe/London'`,
      [
        userId,
        JSON.stringify(['FT_1X2', 'OU_GOALS']),
        JSON.stringify([39, 140, 78]),
      ]
    );

    // User favourites
    const favCreatedAt = formatDateTime(addDays(today, -30));
    await client.query(
      `INSERT INTO user_favourites (user_id, entity_type, entity_id, created_at)
       VALUES 
         ($1, 'team', $2, $5),
         ($1, 'team', $3, $5),
         ($1, 'league', $4, $5)
       ON CONFLICT DO NOTHING`,
      [userId, teamIds['manchester-united'].toString(), teamIds['liverpool'].toString(), leagueIds['premier-league'].toString(), favCreatedAt]
    );
    counts.user_favourites = 3;

    // Alerts
    await client.query(
      `INSERT INTO alerts (user_id, type, match_id, league_id, market_id, threshold, is_enabled, created_at)
       VALUES ($1, 'odds_movement', NULL, $2, $3, $4, true, $5)
       ON CONFLICT DO NOTHING`,
      [
        userId,
        leagueIds['premier-league'],
        marketIds['FT_1X2'],
        JSON.stringify({ condition: 'odds_above', value: 2.5 }),
        formatDateTime(addDays(today, -20)),
      ]
    );
    counts.alerts = 1;

    // ==================== PROVIDER SOURCES ====================
    console.log('🔌 Seeding provider sources...');

    await client.query(
      `INSERT INTO provider_sources (name, base_url)
       VALUES ('api-football', 'https://v3.football.api-sports.io')
       ON CONFLICT (name) DO UPDATE SET base_url = 'https://v3.football.api-sports.io'`
    );
    counts.provider_sources = 1;

    await client.query('COMMIT');

    console.log('\n✅ Seed completed successfully!\n');
    console.log('📊 Summary:');
    for (const [table, count] of Object.entries(counts)) {
      console.log(`   ${table}: ${count}`);
    }

    console.log('\n🔗 Example URLs to test:');
    console.log(`   League: england/premier-league`);
    console.log(`   Team: manchester-united, liverpool, real-madrid`);
    console.log(`   Match IDs: ${Object.values(matchIds).slice(0, 5).join(', ')}`);
    console.log(`   Today's date: ${getToday()}`);

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Seed failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});

