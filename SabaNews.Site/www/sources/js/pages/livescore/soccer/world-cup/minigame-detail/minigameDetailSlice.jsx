import { createSlice } from '@reduxjs/toolkit';
const minigameDetailSlice = createSlice({
    name: 'minigameDetailSlice',
    initialState: {
        matches: null,
        stages: null,
        league: null,
        votes: null
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
            state.matches = matches;
            state.stages = stages;
        },
        setLeague: (state, action) => {
            const league = action.payload;
            state.league = league;
        },
        setVotes: (state, action) => {
            state.votes = action.payload;
        }
    }
});

const { actions, reducer } = minigameDetailSlice;

export const {
    setMatches,
    setLeague,
    setVotes
} = actions;

export default reducer;