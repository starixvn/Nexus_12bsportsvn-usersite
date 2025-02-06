import { createSlice } from '@reduxjs/toolkit';

const fixtureHomepageSlice = createSlice({
    name: 'fixtureHomepageSlice',
    initialState: {
        leagues: null,
        liveMatches: null,
        league: null
    },
    reducers: {
        setLeagues: (state, action) => {
            state.leagues = action.payload;
        },
        setLiveMatches: (state, action) => {
            const liveMatches = action.payload;
            const leagues = state.leagues;
            const totalItems = leagues.length;
            for (let leagueIndex = 0; leagueIndex < totalItems; leagueIndex++) {
                const matches = leagues[leagueIndex].matches;
                for (let liveIndex = 0; liveIndex < liveMatches.length; liveIndex++) {
                    let index = matches.findIndex(item => item.matchId === liveMatches[liveIndex].matchId);
                    if (index >= 0) {
                        state.leagues[leagueIndex].matches[index] = liveMatches[liveIndex];
                    }
                }
            }
        }
    }
});

const { actions, reducer } = fixtureHomepageSlice;

export const {
    setLeagues,
    setLiveMatches
} = actions;

export default reducer;