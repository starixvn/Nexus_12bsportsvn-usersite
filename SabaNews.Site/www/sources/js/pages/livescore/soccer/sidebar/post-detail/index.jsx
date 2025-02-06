import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import fixturePostDetailSlice from './fixturePostDetailSlice';
import AppContainer from './components/AppContainer';

const store = configureStore({
    reducer: fixturePostDetailSlice
});

ReactDOM.render(
    <Provider store={store}>
        <AppContainer />
    </Provider>,
    document.getElementById('fixture-detail'));