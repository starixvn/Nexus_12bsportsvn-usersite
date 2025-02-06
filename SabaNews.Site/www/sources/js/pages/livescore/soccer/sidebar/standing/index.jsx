import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import standingHomepageSlice from './standingHomepageSlice';
import AppContainer from './components/AppContainer';

const store = configureStore({
    reducer: standingHomepageSlice
});

ReactDOM.render(
    <Provider store={store}>
        <AppContainer />
    </Provider>,
    document.getElementById('standing-homepage'));