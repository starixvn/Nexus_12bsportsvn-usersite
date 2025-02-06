import { createSlice } from '@reduxjs/toolkit';

const standingSlice = createSlice({
    name: 'standingSlice',
    initialState: {
        matches: null,
        league: null,
        stages: []
    },
    reducers: {
        setMatches: (state, action) => {
            const matches = action.payload;
            const totalItems = matches.length;
            const stages = [];
            for (let i = 0; i < totalItems; i++) {
                const match = matches[i];
                if (match.stage && stages.findIndex(item => item.stageId === match.stage.stageId) === -1) {
                    stages.push(match.stage);
                }
            }
            state.stages = stages;
            state.matches = matches;
        },
        setLeague: (state, action) => {
            const league = action.payload;
            state.league = league;
        }
    }
});

const { actions, reducer } = standingSlice;

export const {
    setMatches,
    setLeague
} = actions;

export default reducer;