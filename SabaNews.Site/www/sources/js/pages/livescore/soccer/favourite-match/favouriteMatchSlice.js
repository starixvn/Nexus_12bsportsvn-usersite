import { createSlice } from '@reduxjs/toolkit';
import dayjs from 'dayjs';
import DateTimeService from '@jsroot/common/dateTimeService';
import { MatchStatus } from '@jsroot/common/constants';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
dayjs.extend(isSameOrAfter);

const favouriteMatchSlice = createSlice({
    name: 'favouriteMatchSlice',
    initialState: {
        matches: null,
        preMatches: null,
        postMatches: null,
        liveMatches: null,
        leagues: [],
        favLeagues: [],
        posts: [],
        flagToggleIcon: false
    },
    reducers: {
        setFavLeagues: (state, action) => {
            state.favLeagues = action.payload;
        },
        setMatches: (state, action) => {
            const data = action.payload;
            const postMatches = [];
            const preMatches = [];
            let liveMatches = [];
            const matchesTmp = data.matches;
            let currenLiveMatches = data.liveMatches;
            const matchIds = JSON.parse(localStorage.getItem("favourite-matches"));
            const listLiveFilter = matchIds?.join(',');
            if (matchIds) {
                liveMatches = currenLiveMatches.filter(item => listLiveFilter.includes(item.matchId.toString()));
            }
            const totalItem = data.matches.length;
            for (let i = 0; i < totalItem; i++) {
                const match = matchesTmp[i];
                const today = dayjs(DateTimeService.getCurrentClientDateTime()).format('YYYY-MM-DD');
                const startTime = dayjs(DateTimeService.convertFromUTC(match.startTime)).format('YYYY-MM-DD');

                if ((match.status === MatchStatus.NotStarted || match.status === MatchStatus.Delay
                    || match.status === MatchStatus.Postpone || match.status === MatchStatus.TBD)
                    && (dayjs(startTime).isSameOrAfter(today))) {
                    preMatches.push(match);
                }

                if (match.status === MatchStatus.Finished || match.status === MatchStatus.CutInHalf) {
                    postMatches.push(match);
                }
            }
            state.matches = data.matches;
            state.postMatches = postMatches;
            state.preMatches = preMatches;
            state.liveMatches = liveMatches;

        },
        setLiveMatches: (state, action) => {
            const liveMatches = action.payload;
            const totalItems = liveMatches.length;
            for (let i = 0; i < totalItems; i++) {
                let index = state.preMatches.findIndex(item => item.matchId === liveMatches[i].matchId);
                if (index >= 0) {
                    state.preMatches[index] = liveMatches[i];
                }

                index = state.matches.findIndex(item => item.matchId === liveMatches[i].matchId);
                if (index >= 0) {
                    state.matches[index] = liveMatches[i];
                }

                index = state.postMatches.findIndex(item => item.matchId === liveMatches[i].matchId);
                if (index >= 0) {
                    state.postMatches[index] = liveMatches[i];
                }

                index = state.liveMatches.findIndex(item => item.matchId === liveMatches[i].matchId);
                if (index >= 0) {
                    state.liveMatches[index] = liveMatches[i];
                }
            }
        },
        setFavouriteMatches: (state, action) => {
            const matchId = action.payload.matchId;
            let index = state.preMatches.findIndex(item => item.matchId === matchId);
            if (index >= 0) {
                state.preMatches[index].isFavourite = !state.preMatches[index].isFavourite;
            }
            index = state.matches.findIndex(item => item.matchId === matchId);
            if (index >= 0) {
                state.matches[index].isFavourite = !state.matches[index].isFavourite;
            }
            index = state.postMatches.findIndex(item => item.matchId === matchId);
            if (index >= 0) {
                state.postMatches[index].isFavourite = !state.postMatches[index].isFavourite;
            }
            index = state.liveMatches.findIndex(item => item.matchId === matchId);
            if (index >= 0) {
                state.liveMatches[index].isFavourite = !state.liveMatches[index].isFavourite;
            }
        },
        setLeagues: (state, action) => {
            state.leagues = action.payload;
        },
        setPosts: (state,action) => {
            state.posts = action.payload;
        },
        setFlagToggleIcon: (state, action) => {
            state.flagToggleIcon = action.payload;
        }
    },
});

const { actions, reducer } = favouriteMatchSlice;

export const {
    setMajorLeagues,
    setMatches,
    setLiveMatches,
    setFavouriteMatches,
    setLeagues,
    setFavLeagues,
    setPosts,
    setFlagToggleIcon
} = actions;

export default reducer;