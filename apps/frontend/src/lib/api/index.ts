/**
 * Unified API Client for OddinsOdds
 */

import * as predictions from './predictions';
import * as teams from './teams';
import * as streams from './streams';
import * as leagues from './leagues';
import * as articles from './articles';
import * as matches from './matches';
import * as misc from './misc';

export * from './types';
export * from './client';
export * from './predictions';
export * from './teams';
export * from './streams';
export * from './leagues';
export * from './articles';
export * from './matches';
export * from './misc';

export const api = {
    predictions,
    teams,
    streams,
    leagues,
    articles,
    matches,
    misc,
};

export default api;
