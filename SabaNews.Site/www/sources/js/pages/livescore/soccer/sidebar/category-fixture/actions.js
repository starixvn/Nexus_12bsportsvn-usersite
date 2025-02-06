import Site from '@jsroot/common/site';
import DataService from '@jsroot/common/dataService';

import {
    setMatches,
    setLeague,
    setLiveMatches
} from './fixtureCategorySlice';

const getMatches= () => async dispatch => {
    var param = {
        leagueId: window.leagueId,
        seasonId: window.seasonId
    }
    const url = Site.resolveClientUrl('soccer/getMatchesBySeason');
    await DataService.postDataAsync(url, param).then(response => {
        const { league, matches } = response.data;
        dispatch(setMatches(matches));
        dispatch(setLeague(league));
    }).catch(Site.handleAxiosError);
};

export const ActionCreators = {
    setMatches,
    setLeague,
    setLiveMatches,
    getMatches
};