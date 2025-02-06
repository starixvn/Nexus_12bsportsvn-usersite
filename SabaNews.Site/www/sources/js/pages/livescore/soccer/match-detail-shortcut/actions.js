import Site from '@jsroot/common/site';
import DataService from '@jsroot/common/dataService';

import {
    setMatch,
    setIncident
} from './matchDetailShortcutSlice';

const getMatchDetail = () => async dispatch => {
    const url = Site.resolveClientUrl('soccer/GetMatchGeneralInfo');
    await DataService.postDataAsync(url, {matchId: window.matchId}).then(response => {
        const { match, incidents } =  response.data;
        dispatch(setIncident(incidents));
        dispatch(setMatch(match));
    }).catch(Site.handleAxiosError);
};
export const ActionCreators = {
    setMatch,
    setIncident,
    getMatchDetail
};