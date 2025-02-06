import { createSlice } from '@reduxjs/toolkit';
import dayjs from 'dayjs';
import DateTimeService from '@jsroot/common/dateTimeService';
import { MatchStatus } from '@jsroot/common/constants';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
dayjs.extend(isSameOrAfter);
const leagueDetailSlice = createSlice({
    name: 'leagueDetailSlice',
    initialState: {
        favLeagues: [],
        league: null,
        stages: [],
        preMatches: null,
        postMatches: null,
        seasonStandings: [],
        leagues: [],
        isCurrentSeason: true
    },
    reducers: {
        setFavLeagues: (state, action) => {
            state.favLeagues = action.payload;
        },
        setLeague: (state, action) => {
            state.league = action.payload;
        },
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

            state.stages = stages;
            state.preMatches = preMatches;
            state.postMatches = postMatches;
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
        },
        setSeasonStandings: (state, action) => {
            state.seasonStandings = action.payload;
        },
        setLeagues: (state, action) => {
            state.leagues = action.payload;
        },
        setIsCurrentSeason: (state, action) => {
            state.isCurrentSeason = action.payload;
        }
    }
});

const { actions, reducer } = leagueDetailSlice;

export const {
    setFavLeagues,
    setLeague,
    setMatches,
    setLiveMatches,
    setSeasonStandings,
    setLeagues,
    setIsCurrentSeason
} = actions;

export default reducer;