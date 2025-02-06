import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import teamDetailSlice from './teamDetailSlice';
import AppContainer from './components/AppContainer';

const store = configureStore({
    reducer: teamDetailSlice
});

ReactDOM.render(
    <Provider store={store}>
        <AppContainer />
    </Provider>,
    document.getElementById('team-detail'));