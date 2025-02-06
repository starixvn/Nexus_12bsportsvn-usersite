import Site from '@jsroot/common/site';
import DataService from '@jsroot/common/dataService';
import {
    setMatch,
    setActiveTab,
} from './matchDetailSlice';

const getMatchDetail = () => async dispatch => {
    let params = {
        matchId: window.selectedMatchId
    };
    const url = Site.resolveClientUrl('soccer/GetMatchDetail');
    await DataService.postDataAsync(url, params).then(response => {
        dispatch(setMatch(response.data));
    }).catch(Site.handleAxiosError);
};




export const ActionCreators = {
    setMatch,
    setActiveTab,
    getMatchDetail,
};