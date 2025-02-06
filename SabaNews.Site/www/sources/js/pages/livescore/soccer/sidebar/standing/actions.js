import Site from '@jsroot/common/site';
import DataService from '@jsroot/common/dataService';

import {
    setStandings
} from './standingHomepageSlice';

const getStandings = () => async dispatch => {
    const url = Site.resolveClientUrl('api/GetHomeStanding');
    await DataService.postDataAsync(url).then(response => {
        dispatch(setStandings(response.data));
    }).catch(Site.handleAxiosError);
};

export const ActionCreators = {
    setStandings,
    getStandings
};