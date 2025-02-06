import { createSlice } from '@reduxjs/toolkit';

const standingHomepageSlice = createSlice({
    name: 'standingHomepageSlice',
    initialState: {
        standings: null,
    },
    reducers: {
        setStandings: (state, action) => {
            state.standings = action.payload;
        }
    }
});

const { actions, reducer } = standingHomepageSlice;

export const {
    setStandings
} = actions;

export default reducer;