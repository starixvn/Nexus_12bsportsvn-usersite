import Site from '@jsroot/common/site';
import DataService from '@jsroot/common/dataService';

import {
    setMatches,
    setLeague,
    setSelectedStageId,
    setLiveMatches
} from './fullFixtureSlice';

const getMatches = () => async dispatch => {
    const url = Site.resolveClientUrl('WorldCup2022/GetWorldCupMatch');
    await DataService.postDataAsync(url).then(response => {
        const { league, matches } = response.data;
        dispatch(setLeague(league));
        dispatch(setMatches(matches));
    }).catch(Site.handleAxiosError);
};

export const ActionCreators = {
    setMatches,
    setLeague,
    setSelectedStageId,
    setLiveMatches,
    getMatches
};