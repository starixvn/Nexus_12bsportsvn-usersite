import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import fixtureHomepageSlice from './fixtureHomepageSlice';
import AppContainer from './components/AppContainer';

const store = configureStore({
    reducer: fixtureHomepageSlice
});

ReactDOM.render(
    <Provider store={store}>
        <AppContainer />
    </Provider>,
    document.getElementById('fixture-homepage'));