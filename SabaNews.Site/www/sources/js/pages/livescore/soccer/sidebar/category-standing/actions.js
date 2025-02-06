import Site from '@jsroot/common/site';
import DataService from '@jsroot/common/dataService';

import {
    setStanding,
    setLeague
} from './standingCategorySlice';

const getStanding = () => async dispatch => {
    var param = {
        leagueId: window.leagueId,
        seasonId: window.seasonId
    }
    const url = Site.resolveClientUrl('soccer/GetLeagueSeasonStanding');
    await DataService.postDataAsync(url, param).then(response => {
        const { league, standing } = response.data;
        dispatch(setStanding(standing));
        dispatch(setLeague(league));
    }).catch(Site.handleAxiosError);
};

export const ActionCreators = {
    setStanding,
    setLeague,
    getStanding
};