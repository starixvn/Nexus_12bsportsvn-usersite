import { createSlice } from '@reduxjs/toolkit';

const minigameWinnersSlice = createSlice({
    name: 'minigameWinnersSlice',
    initialState: {
        matches: null,
        stages: null,
        league: null,
        votes: null,
        teams: null
    },
    reducers: {
        setMatches: (state, action) => {
           const matches = action.payload,
                totalMatches = matches.length,
                stages = [];
            for (let i = 0; i < totalMatches; i++) {
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
        },
        setVotes: (state, action) => {
            state.votes = action.payload;
        }
    }
});

const { actions, reducer } = minigameWinnersSlice;

export const {
    setMatches,
    setLeague,
    setVotes
} = actions;

export default reducer;