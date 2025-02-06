import { createSlice } from '@reduxjs/toolkit';
import DateTimeService from '@jsroot/common/dateTimeService';

const selectedDate = window.selectedEventDate ? window.selectedEventDate : DateTimeService.getCurrentClientDateTime();
const today = new Date(DateTimeService.getCurrentClientDateTime());
const minDate = new Date(2020, 0, 1);
const maxDate = new Date(today.getFullYear() + 1, 12, 0);

const soccerMatchSlice = createSlice({
    name: 'soccerMatchSlice',
    initialState: {
        today: DateTimeService.formatDateTime(today, 'YYYY-MM-DD'),
        minDate: DateTimeService.formatDateTime(minDate, 'YYYY-MM-DD'),
        maxDate: DateTimeService.formatDateTime(maxDate, 'YYYY-MM-DD'),
        searchKey: '',
        selectedDate: DateTimeService.formatDateTime(selectedDate, 'YYYY-MM-DD'),
        dateRanges: [],
        favLeagues: [],
        flagToggleFavLeagueIcon: false,
        matches: null,
        totalLiveMatches: 0,
        leagues: [],
        banner: null,
        todayFixturePosts: null
    },
    reducers: {
        setSearchKey: (state, action) => {
            state.searchKey = action.payload;
        },
        setSelectedDate: (state, action) => {
            state.selectedDate = action.payload;
        },
        setDateRanges: (state, action) => {
            state.dateRanges = action.payload;
        },
        setFavLeagues: (state, action) => {
            state.favLeagues = action.payload;
        },
        setMatches: (state, action) => {
            state.matches = action.payload;
        },
        setLiveMatches: (state, action) => {
            const liveMatches = action.payload;
            state.totalLiveMatches = liveMatches.length;

            if (window.isLivePage) {
                state.matches = liveMatches;
            } else {
                if (state.today === state.selectedDate && state.matches) {
                    for (const match of liveMatches) {
                        const index = state.matches.findIndex(m => m.matchId === match.matchId);
                        if (index >= 0) {
                            state.matches[index] = match;
                        }
                    }
                }
            }
        },
        setFlagToggleFavLeagueIcon: (state, action) => {
            state.flagToggleFavLeagueIcon = action.payload;
        },
        setLeagues: (state, action) => {
            state.leagues = action.payload;
        },
        setBanner: (state, action) => {
            state.banner = action.payload;
        },
        setTodayFixturePosts: (state, action) => {
            state.todayFixturePosts = action.payload;
        }
    }
});

const { actions, reducer } = soccerMatchSlice;

export const {
    setSearchKey,
    setSelectedDate,
    setDateRanges,
    setFavLeagues,
    setMatches,
    setLiveMatches,
    setFlagToggleFavLeagueIcon,
    setLeagues,
    setBanner,
    setTodayFixturePosts
} = actions;

export default reducer;