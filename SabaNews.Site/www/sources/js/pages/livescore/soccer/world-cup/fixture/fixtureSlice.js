import { createSlice } from '@reduxjs/toolkit';

const fixtureSlice = createSlice({
    name: 'fixtureSlice',
    initialState: {
        matches: null,
        liveMatches: null,
        league: null
    },
    reducers: {
        setMatches: (state, action) => {
            state.matches = action.payload;
        },
        setLeague: (state, action) => {
            state.league = action.payload;
        },
        setLiveMatches: (state, action) => {
            const liveMatches = action.payload,
            totalItems = liveMatches.length;
            for (let i = 0; i < totalItems; i++) {
                let index = state.matches.findIndex(item => item.matchId === liveMatches[i].matchId);
                if (index >= 0) {
                    state.matches[index] = liveMatches[i];
                }
            }
        }
    }
});

const { actions, reducer } = fixtureSlice;

export const {
    setMatches,
    setLeague,
    setLiveMatches
} = actions;

export default reducer;