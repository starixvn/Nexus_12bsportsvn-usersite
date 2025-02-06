import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import standingSlice from './standingSlice';
import AppContainer from './components/AppContainer';

const store = configureStore({
    reducer: standingSlice
});

ReactDOM.render(
    <Provider store={store}>
        <AppContainer />
    </Provider>,
    document.getElementById('euro-standing-playoff'));