import { createSlice } from '@reduxjs/toolkit';

const minigameStandingSlice = createSlice({
    name: 'minigameStandingSlice',
    initialState: {
        votes: null,
        matches: null,
        league: null,
        stages: null,
        teams: null
    },
    reducers: {
        setMatches: (state, action) => {
           const matches = action.payload,
                stages = [],
                totalItems = matches.length;
            for (let i = 0; i < totalItems; i++) {
                const match = matches[i];
                if (match.stage
                    && stages.findIndex(item => item.stageId === match.stage.stageId) === -1) {
                    stages.push(match.stage);
                }
            }
            state.matches = matches;
            state.stages = stages;
        },
        setVotes: (state, action) => {
            state.votes = action.payload;
        },
        setLeague: (state, action) => {
            const league = action.payload;
            state.league = league;
        }
    }
});

const { actions, reducer } = minigameStandingSlice;

export const {
    setMatches,
    setVotes,
    setLeague
} = actions;

export default reducer;