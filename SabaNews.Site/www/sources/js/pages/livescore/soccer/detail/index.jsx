import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import soccerMatchDetailSlice from './soccerMatchDetailSlice';
import AppContainer from './components/AppContainer';
import Site from '@jsroot/common/site';
const detailStore = configureStore({
    reducer: soccerMatchDetailSlice
});

ReactDOM.render(
    <Provider store={detailStore}>
         <BrowserRouter>
            <Routes>
                <Route path={Site.resolveClientUrl(`lich-thi-dau/world-cup-2022/:match/:matchId`)} element={<AppContainer />} />
                <Route path={Site.resolveClientUrl(`lich-thi-dau/world-cup-2022/:match/:matchId/:activeTab`)} element={<AppContainer />} />
                <Route path={Site.resolveClientUrl(`lich-thi-dau/bong-da/:league/:match/:matchId`)} element={<AppContainer />} />
                <Route path={Site.resolveClientUrl(`lich-thi-dau/bong-da/:league/:match/:matchId/:activeTab`)} element={<AppContainer />} />
            </Routes>
        </BrowserRouter>
    </Provider>,

    document.getElementById('app-container'));