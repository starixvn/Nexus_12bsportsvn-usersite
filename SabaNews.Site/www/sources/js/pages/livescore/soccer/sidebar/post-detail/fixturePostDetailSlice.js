import { createSlice } from '@reduxjs/toolkit';

const fixturePostDetailSlice = createSlice({
    name: 'fixturePostDetailSlice',
    initialState: {
        liveMatches : null,
        todayMatches : null,
    },
    reducers: {
        setLive: (state, action) => {
            state.liveMatches = action.payload;
        },
        setToday : (state, action ) => {
            state.todayMatches = action.payload;
        },
        setLiveMatches: (state, action) => {
            const liveMatches = action.payload;
            state.liveMatches = liveMatches;
            for (const match of liveMatches) {
                const index = state.todayMatches.findIndex(m => m.matchId === match.matchId);
                if (index >= 0) {
                    state.todayMatches[index] = match;
                }
            }
        }
    }
});

const { actions, reducer } = fixturePostDetailSlice;

export const {
    setLiveMatches,
    setToday,
    setLive
} = actions;

export default reducer;