import { createSlice } from '@reduxjs/toolkit';

const matchDetailSlice = createSlice({
    name: 'matchDetailSlice',
    initialState: {
        match: null,
        isLiveMatch: false,
        activeTab: ''
    },
    reducers: {
        setMatch: (state, action) => {
            state.match = action.payload;
        },
        setActiveTab: (state, action) => {
            state.activeTab =  action.payload;
        }
    }
});

const { actions, reducer } = matchDetailSlice;

export const {
    setMatch,
    setActiveTab
} = actions;

export default reducer;