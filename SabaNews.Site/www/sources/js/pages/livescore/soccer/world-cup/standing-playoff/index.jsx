import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import standingPlayoffSlice from './standingPlayoffSlice';
import AppContainer from './components/AppContainer';

const store = configureStore({
    reducer: standingPlayoffSlice
});

ReactDOM.render(
    <Provider store={store}>
        <AppContainer />
    </Provider>,
    document.getElementById('world-full-playoff-standing'));