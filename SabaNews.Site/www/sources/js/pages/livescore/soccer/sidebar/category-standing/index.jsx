import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import standingCategorySlice from './standingCategorySlice';
import AppContainer from './components/AppContainer';

const store = configureStore({
    reducer: standingCategorySlice
});

ReactDOM.render(
    <Provider store={store}>
        <AppContainer />
    </Provider>,
    document.getElementById('standing-category'));