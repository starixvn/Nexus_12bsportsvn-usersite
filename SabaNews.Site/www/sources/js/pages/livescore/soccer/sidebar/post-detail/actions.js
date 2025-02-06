import Site from '@jsroot/common/site';
import DataService from '@jsroot/common/dataService';

import {
    setLive,
    setToday
} from './fixturePostDetailSlice';

const getLiveMatches = () => async dispatch => {
    const url = Site.resolveClientUrl('soccer/getLiveMatches');
    await DataService.postDataAsync(url).then(response => {
        dispatch(setLive(response.data));
    }).catch(Site.handleAxiosError);
};

const getTodayMatches = () => async dispatch => {
    const url = Site.resolveClientUrl('api/getTodayMatches');
    await DataService.postDataAsync(url).then(response => {
        dispatch(setToday(response.data));
    }).catch(Site.handleAxiosError);
};

export const ActionCreators = {
    getLiveMatches,
    getTodayMatches,
    setToday,
    setLive
};