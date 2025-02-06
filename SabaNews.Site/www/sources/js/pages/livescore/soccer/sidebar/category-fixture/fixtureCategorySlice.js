import { createSlice } from '@reduxjs/toolkit';

const fixtureCategorySlice = createSlice({
    name: 'fixtureCategorySlice',
    initialState: {
        matches: null,
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
            const liveMatches = action.payload;
            const matches = state.matches;
            for (let liveIndex = 0; liveIndex < liveMatches.length; liveIndex++) {
                let index = matches.findIndex(item => item.matchId === liveMatches[liveIndex].matchId);
                if (index >= 0) {
                    state.matches[index] = liveMatches[liveIndex];
                }
            }
        }
    }
});

const { actions, reducer } = fixtureCategorySlice;

export const {
    setMatches,
    setLeague,
    setLiveMatches
} = actions;

export default reducer;