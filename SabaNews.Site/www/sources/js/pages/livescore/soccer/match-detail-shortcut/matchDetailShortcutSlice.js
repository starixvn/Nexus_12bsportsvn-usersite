import { createSlice } from '@reduxjs/toolkit';

const matchDetailShortcutSlice = createSlice({
    name: 'matchDetailShortcutSlice',
    initialState: {
        match: null,
        incidents: null
    },
    reducers: {
        setMatch: (state, action) => {
            state.match = action.payload;
        },
        setIncident: (state, action) => {
            state.incidents = action.payload;
        }
    }
});

const { actions, reducer } = matchDetailShortcutSlice;

export const {
    setMatch,
    setIncident
} = actions;

export default reducer;