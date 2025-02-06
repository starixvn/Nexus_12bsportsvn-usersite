import { createSlice } from '@reduxjs/toolkit';

const standingCategorySlice = createSlice({
    name: 'standingCategorySlice',
    initialState: {
        standing: null,
        league: null
    },
    reducers: {
        setStanding: (state, action) => {
            state.standing = action.payload;
        },
        setLeague: (state, action) => {
            state.league = action.payload;
        }
    }
});

const { actions, reducer } = standingCategorySlice;

export const {
    setStanding,
    setLeague
} = actions;

export default reducer;