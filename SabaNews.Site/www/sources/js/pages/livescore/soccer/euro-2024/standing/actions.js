import Site from '@jsroot/common/site';
import DataService from '@jsroot/common/dataService';

import {
    setMatches,
    setLeague,
} from './standingSlice';

const getMatches = () => async dispatch => {
    const url = Site.resolveClientUrl('euro2024/getFixture');
    await DataService.postDataAsync(url).then(response => {
        const { league, matches } = response.data;
        dispatch(setLeague(league));
        dispatch(setMatches(matches));
    }).catch(Site.handleAxiosError);
};

export const ActionCreators = {
    setMatches,
    setLeague,
    getMatches
};