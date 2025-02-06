import { createSlice } from '@reduxjs/toolkit';

const fullFixtureSlice = createSlice({
    name: 'fullFixtureSlice',
    initialState: {
        matches: null,
        liveMatches: null,
        league: null,
        selectedStageId: 0
    },
    reducers: {
        setMatches: (state, action) => {
            state.matches = action.payload;
        },
        setLeague: (state, action) => {
            const league = action.payload;
            state.league = league;
            state.selectedStageId = league.currentStageId;
        },
        setLiveMatches: (state, action) => {
            const liveMatches = action.payload,
            totalItems = liveMatches.length;
            for (let i = 0; i < totalItems; i++) {
                const index = state.matches.findIndex(item => item.matchId === liveMatches[i].matchId);
                if (index >= 0) {
                    state.matches[index] = liveMatches[i];
                }
            }
        },
        setSelectedStageId: (state, action) => {
            state.selectedStageId = action.payload;
        }
    }
});

const { actions, reducer } = fullFixtureSlice;

export const {
    setMatches,
    setLeague,
    setLiveMatches,
    setSelectedStageId
} = actions;

export default reducer;