/**
 * API-Football HTTP Client with retry logic
 */

import { config } from '../config';
import { logger } from '../logger';

interface RequestOptions {
  timeout?: number;
  maxRetries?: number;
}

class APIFootballClient {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = config.API_FOOTBALL_BASE_URL;
    this.apiKey = config.SPORTS_PROVIDER_API_KEY;
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async fetchWithRetry(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<unknown> {
    const { timeout = 10000, maxRetries = 5 } = options;
    const url = `${this.baseUrl}${endpoint}`;

    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        logger.debug(`Fetching ${endpoint}`, { attempt, maxRetries });

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'x-apisports-key': this.apiKey,
            'Accept': 'application/json',
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        // Handle rate limiting and server errors
        if (response.status === 429) {
          const retryAfter = response.headers.get('retry-after');
          const waitTime = retryAfter ? parseInt(retryAfter, 10) * 1000 : 1000 * Math.pow(2, attempt);
          logger.warn(`Rate limited (429), retrying after ${waitTime}ms`, { attempt, endpoint });
          await this.sleep(waitTime);
          continue;
        }

        if (response.status >= 500) {
          const waitTime = 1000 * Math.pow(2, attempt);
          logger.warn(`Server error (${response.status}), retrying after ${waitTime}ms`, { attempt, endpoint });
          await this.sleep(waitTime);
          continue;
        }

        if (!response.ok) {
          throw new Error(`API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json() as Record<string, unknown>;

        logger.debug(`Successfully fetched ${endpoint}`, {
          status: response.status,
          results: data.results
        });

        return data;
      } catch (error: unknown) {
        const err = error instanceof Error ? error : new Error(String(error));
        lastError = err;

        if (err instanceof Error && err.name === 'AbortError') {
          logger.warn(`Request timeout for ${endpoint}`, { attempt });
        } else {
          logger.warn(`Request failed for ${endpoint}`, {
            attempt,
            error: err.message
          });
        }

        if (attempt < maxRetries) {
          const waitTime = 1000 * Math.pow(2, attempt);
          await this.sleep(waitTime);
        }
      }
    }

    throw new Error(`Failed to fetch ${endpoint} after ${maxRetries} attempts: ${lastError?.message}`);
  }

  async getLeagues(): Promise<unknown> {
    return this.fetchWithRetry('/leagues');
  }

  async getTeams(params: { league: number; season: number }): Promise<unknown> {
    return this.fetchWithRetry(`/teams?league=${params.league}&season=${params.season}`);
  }

  async getFixtures(params: { league: number; season: number }): Promise<unknown> {
    return this.fetchWithRetry(`/fixtures?league=${params.league}&season=${params.season}`);
  }

  async getStandings(params: { league: number; season: number }): Promise<unknown> {
    return this.fetchWithRetry(`/standings?league=${params.league}&season=${params.season}`);
  }

  async getOdds(params: { fixture: number }): Promise<unknown> {
    return this.fetchWithRetry(`/odds?fixture=${params.fixture}`);
  }

  async getPlayers(params: { team: number; season: number }): Promise<unknown> {
    return this.fetchWithRetry(`/players?team=${params.team}&season=${params.season}`);
  }

  async getFixtureEvents(params: { fixture: number }): Promise<unknown> {
    return this.fetchWithRetry(`/fixtures/events?fixture=${params.fixture}`);
  }

  async getFixtureLineups(params: { fixture: number }): Promise<unknown> {
    return this.fetchWithRetry(`/fixtures/lineups?fixture=${params.fixture}`);
  }

  async getFixturesByDate(date: string): Promise<unknown> {
    return this.fetchWithRetry(`/fixtures?date=${date}`);
  }

  async getPredictions(params: { fixture: number }): Promise<unknown> {
    return this.fetchWithRetry(`/predictions?fixture=${params.fixture}`);
  }
}

export const apiFootballClient = new APIFootballClient();

