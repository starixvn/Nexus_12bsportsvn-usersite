import Site from '@jsroot/common/site';
import DataService from '@jsroot/common/dataService';
import CommonFunctions from '@jsroot/common/common-functions';
import {
    setMatch,
    setFavLeagues,
    setActiveTab,
    setLeagues
} from './soccerMatchDetailSlice';

const getMatchDetail = () => async dispatch => {
    let params = {
        matchId: window.selectedMatchId
    };
    const url = Site.resolveClientUrl('soccer/GetMatchDetail');
    await DataService.postDataAsync(url, params).then(response => {
        dispatch(setMatch(response.data));
    }).catch(Site.handleAxiosError);
};


const getFavLeagues = () => async dispatch => {
    let leagueIds = CommonFunctions.getFavLeagueParam();
    const param = {
        leagueIds: leagueIds
    };
    if(leagueIds !== '') {
        const url = Site.resolveClientUrl('soccer/GetFavLeagues');
        await DataService.postDataAsync(url, param).then(response => {
            const leagues = CommonFunctions.refreshFavLeagues(response.data);
            dispatch(setFavLeagues(leagues));
        }).catch(Site.handleAxiosError);
    }
};

const getLeagues = () => async dispatch => {
    const url = Site.resolveClientUrl('soccer/getLeagues');
    await DataService.postDataAsync(url).then(response => {
        dispatch(setLeagues(response.data));
    }).catch(Site.handleAxiosError);
};

export const ActionCreators = {
    setMatch,
    setFavLeagues,
    setLeagues,
    setActiveTab,
    getMatchDetail,
    getFavLeagues,
    getLeagues
};