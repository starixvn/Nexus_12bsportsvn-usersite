import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import minigameSlice from './minigameStandingSlice';
import AppContainer from './components/AppContainer';

const store = configureStore({
    reducer: minigameSlice
});

ReactDOM.render(
    <Provider store={store}>
        <AppContainer />
    </Provider>,
    document.getElementById('minigame-standing'));