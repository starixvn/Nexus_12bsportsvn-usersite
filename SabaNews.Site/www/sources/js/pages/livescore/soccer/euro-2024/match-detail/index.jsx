import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import matchDetailSlice from './matchDetailSlice';
import AppContainer from './components/AppContainer';

const store = configureStore({
    reducer: matchDetailSlice
});

ReactDOM.render(
    <Provider store={store}>
        <AppContainer />
    </Provider>,
    document.getElementById('euro-match-detail'));