import { createSlice } from '@reduxjs/toolkit';
import { Euro } from '../euro-constants';
const minigameProfileStageSlice = createSlice({
    name: 'minigameProfileStageSlice',
    initialState: {
        matches: null,
        stages: null,
        league: null,
        votes: null,
        updateVoteResult: null,
        teams: null
    },
    reducers: {
        setLeague: (state, action) => {
            const league = action.payload;
            state.league = league;
        },
        setVotes: (state, action) => {
            state.votes = action.payload;
        },
        setMatches: (state, action) => {
            const matches = action.payload,
                totalItems = matches.length,
                stages = [];
            const groups = matches.filter(item => item.stage?.stageId === Euro.GroupsStage);
            let groupTeams = groups.map(item => item.homeTeam.teamId);
            groupTeams = [...new Set(groupTeams)];
            for (let i = 0; i < totalItems; i++) {
                const match = matches[i];
                if (match.stage && stages.findIndex(item => item.stageId === match.stage.stageId) === -1) {
                    stages.push(match.stage);
                }
            }
            state.stages = stages;
            state.matches = matches;
            state.teams = groupTeams;
        },
        setUpdateVote: (state, action) => {
            state.updateVoteResult = action.payload;
        }
    }
});

const { actions, reducer } = minigameProfileStageSlice;

export const {
    setMatches,
    setLeague,
    setVotes,
    setUpdateVote
} = actions;

export default reducer;