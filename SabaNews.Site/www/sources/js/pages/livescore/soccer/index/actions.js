import Site from '@jsroot/common/site';
import DataService from '@jsroot/common/dataService';
import CommonFunctions from '@jsroot/common/common-functions';
import {
    setSearchKey,
    setSelectedDate,
    setDateRanges,
    setFavLeagues,
    setMatches,
    setLiveMatches,
    setFlagToggleFavLeagueIcon,
    setLeagues,
    setBanner,
    setTodayFixturePosts
} from './soccerMatchSlice';

const getMatchesByDate = params => async dispatch => {
    const url = Site.resolveClientUrl('soccer/getMatches');
    await DataService.postDataAsync(url, params).then(response => {
        dispatch(setMatches(response.data));
    }).catch(Site.handleAxiosError);
};

const getLiveMatches = () => async dispatch => {
    const url = Site.resolveClientUrl('soccer/getLiveMatches');
    await DataService.postDataAsync(url).then(response => {
        dispatch(setLiveMatches(response.data));
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

const getBanner = () => async dispatch => {
    const url = Site.resolveClientUrl('api/banner');
    await DataService.postDataAsync(url).then(response => {
        dispatch(setBanner(response.data));
    }).catch(Site.handleAxiosError);
};

const getTodayFixturePosts = () => async dispatch => {
    const url = Site.resolveClientUrl('api/post/today-fixture');
    await DataService.postDataAsync(url).then(response => {
        dispatch(setTodayFixturePosts(response.data));
    }).catch(Site.handleAxiosError);
};

export const ActionCreators = {
    setSearchKey,
    setSelectedDate,
    setDateRanges,
    setFavLeagues,
    setMatches,
    getFavLeagues,
    getMatchesByDate,
    getLiveMatches,
    setLiveMatches,
    setFlagToggleFavLeagueIcon,
    setLeagues,
    getLeagues,
    getBanner,
    setBanner,
    setTodayFixturePosts,
    getTodayFixturePosts
};