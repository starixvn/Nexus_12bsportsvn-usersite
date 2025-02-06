import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import matchDetailShortcutSlice from './matchDetailShortcutSlice';
import AppContainer from './components/AppContainer';

const store = configureStore({
    reducer: matchDetailShortcutSlice
});

ReactDOM.render(
    <Provider store={store}>
        <AppContainer />
    </Provider>,
    document.getElementById('match-detail'));