import Site from '@jsroot/common/site';
import DataService from '@jsroot/common/dataService';

import {
    setMatches,
    setLeague,
    setLiveMatches
} from './fixtureSlice';

const getMatches = () => async dispatch => {
    const url = Site.resolveClientUrl('Euro2024/GetFixture');
    await DataService.postDataAsync(url).then(response => {
        const { league, matches } = response.data;
        dispatch(setLeague(league));
        dispatch(setMatches(matches));
    }).catch(Site.handleAxiosError);
};

export const ActionCreators = {
    setMatches,
    setLeague,
    setLiveMatches,
    getMatches
};