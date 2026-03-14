/**
 * Utility for calculating football statistics on the frontend
 * as a fallback for missing API data.
 */

/**
 * Calculates Points Per Game (PPG)
 * Win = 3 points, Draw = 1 point, Loss = 0 points
 */
export function calculatePPG(wins: number = 0, draws: number = 0, played: number = 0): number {
    if (!played || played === 0) return 0;
    return ((wins * 3) + draws) / played;
}

/**
 * Calculates an average value (e.g., goals per match)
 */
export function calculateAvg(total: number = 0, played: number = 0): number {
    if (!played || played === 0) return 0;
    return total / played;
}

/**
 * Calculates a percentage (e.g., win rate)
 */
export function calculateRate(count: number = 0, total: number = 0): number {
    if (!total || total === 0) return 0;
    return (count / total) * 100;
}
