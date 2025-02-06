import { createSlice } from '@reduxjs/toolkit';

const favouriteLeagueSlice = createSlice({
    name: 'favouriteLeagueSlice',
    initialState: {
        favLeagues: null,
        leagues: null,
        posts: []
    },
    reducers: {
        setFavLeagues: (state, action) => {
            state.favLeagues = action.payload;
        },
        setLeagues: (state, action) => {
            state.leagues = action.payload;
        },
        setPosts: (state,action) => {
            state.posts = action.payload;
        }
    },
});

const { actions, reducer } = favouriteLeagueSlice;

export const {
    setFavLeagues,
    setLeagues,
    setPosts
} = actions;

export default reducer;