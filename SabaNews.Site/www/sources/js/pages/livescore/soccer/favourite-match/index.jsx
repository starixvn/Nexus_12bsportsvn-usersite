import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import favouriteMatchSlice from './favouriteMatchSlice';
import AppContainer from './components/AppContainer';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Site from '@jsroot/common/site';

const store = configureStore({
    reducer: favouriteMatchSlice
});


ReactDOM.render(
    <Provider store={store}>
         <BrowserRouter>
            <Routes>
                <Route path={Site.resolveClientUrl(`lich-thi-dau/bong-da/tran-dau-quan-tam`)} element={<AppContainer />} />
                <Route path={Site.resolveClientUrl(`lich-thi-dau/bong-da/tran-dau-quan-tam/:selectedTab`)} element={<AppContainer />} />
            </Routes>
        </BrowserRouter>
    </Provider>,
    document.getElementById('app-container'));