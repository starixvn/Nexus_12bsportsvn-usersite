import { createSlice } from '@reduxjs/toolkit';
import dayjs from 'dayjs';
import DateTimeService from '@jsroot/common/dateTimeService';
import { MatchStatus } from '@jsroot/common/constants';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
dayjs.extend(isSameOrAfter);
const teamDetailSlice = createSlice({
    name: 'teamDetailSlice',
    initialState: {
        stages: [],
        players: null,
        team: null,
        profile: null,
        preMatches: null,
        postMatches: null
    },
    reducers: {
        setMatches: (state, action) => {
            const matches = action.payload,
                totalItems = matches.length,
                stages = [],
                preMatches = [],
                postMatches = [];
            for (let i = 0; i < totalItems; i++) {
                const match = matches[i];
                const today = dayjs(DateTimeService.getCurrentClientDateTime()).format('YYYY-MM-DD');
                const startTime = dayjs(DateTimeService.convertFromUTC(match.startTime)).format('YYYY-MM-DD');
                if (match.stage && stages.findIndex(item => item.stageId === match.stage.stageId) === -1) {
                    stages.push(match.stage);
                }

                if (match.status !== MatchStatus.Finished && match.status !== MatchStatus.CutInHalf && dayjs(startTime).isSameOrAfter(today)) {
                    preMatches.push(match);
                }

                if (match.status === MatchStatus.Finished || match.status === MatchStatus.CutInHalf) {
                    postMatches.push(match);
                }
            }
            var matchTeam = matches.find(m => m.homeTeam.teamId == window.teamId || m.awayTeam.teamId == window.teamId);
            if(matchTeam != null) {
                state.team = matchTeam.homeTeam.teamId == window.teamId ? matchTeam.homeTeam : matchTeam.awayTeam;
            }
            state.stages = stages;
            state.preMatches = preMatches;
            state.postMatches = postMatches;
        },
        setPlayers: (state, action) => {
            state.players = action.payload;
        },
        setProfile: (state, action) => {
            state.profile = action.payload;
        },
        setLiveMatches: (state, action) => {
            const liveMatches = action.payload;
            const totalItems = liveMatches.length;
            for (let i = 0; i < totalItems; i++) {
                let index = state.preMatches.findIndex(item => item.matchId === liveMatches[i].matchId);
                if (index >= 0) {
                    state.preMatches[index] = liveMatches[i];
                }

                index = state.postMatches.findIndex(item => item.matchId === liveMatches[i].matchId);
                if (index >= 0) {
                    state.postMatches[index] = liveMatches[i];
                }
            }
        }
    }
});

const { actions, reducer } = teamDetailSlice;

export const {
    setMatches,
    setPlayers,
    setProfile,
    setLiveMatches
} = actions;

export default reducer;