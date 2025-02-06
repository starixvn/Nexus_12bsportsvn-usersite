import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import fixtureSlice from './fixtureSlice';
import AppContainer from './components/AppContainer';

const store = configureStore({
    reducer: fixtureSlice
});

ReactDOM.render(
    <Provider store={store}>
        <AppContainer />
    </Provider>,
    document.getElementById('euro-fixture'));