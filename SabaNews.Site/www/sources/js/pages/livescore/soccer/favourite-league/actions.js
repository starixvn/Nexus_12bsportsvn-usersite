import Site from '@jsroot/common/site';
import DataService from '@jsroot/common/dataService';
import CommonFunctions from '@jsroot/common/common-functions';

import {
    setFavLeagues,
    setLeagues,
    setPosts
} from './favouriteLeagueSlice';

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
    } else {
        dispatch(setFavLeagues([]));
    }
};

const getLeagues = () => async dispatch => {
    const url = Site.resolveClientUrl('soccer/getLeagues');
    await DataService.postDataAsync(url).then(response => {
        dispatch(setLeagues(response.data));
    }).catch(Site.handleAxiosError);
};

const getLastestNews = () => async dispatch => {
    const url = Site.resolveClientUrl('api/post/lastestNews');
    await DataService.postDataAsync(url).then(response => {
        dispatch(setPosts(response.data));
    }).catch(Site.handleAxiosError);
};

export const ActionCreators = {
    setFavLeagues,
    setLeagues,
    setPosts,
    getFavLeagues,
    getLeagues,
    getLastestNews
};