import Site from '@jsroot/common/site';
import DataService from '@jsroot/common/dataService';
import CommonFunctions from '@jsroot/common/common-functions';
import {
    setFavLeagues,
    setLeague,
    setMatches,
    setLiveMatches,
    setSeasonStandings,
    setLeagues,
    setIsCurrentSeason
} from './leagueDetailSlice';

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

const getMatchesBySeason = params => async dispatch => {
    const url = Site.resolveClientUrl('soccer/getMatchesBySeason');
    const isCurrentSeason = params.isCurrentSeason.toLowerCase() === 'true';
    params.isCurrentSeason = isCurrentSeason;
    await DataService.postDataAsync(url, params).then(response => {
        const { league, matches } = response.data;
        dispatch(setLeague(league));
        dispatch(setMatches(matches));
        dispatch(setIsCurrentSeason(isCurrentSeason));
    }).catch(Site.handleAxiosError);
};

const getSeasonStandings = params => async dispatch => {
    const url = Site.resolveClientUrl('soccer/getSeasonStandings');
    await DataService.postDataAsync(url, params).then(response => {
        dispatch(setSeasonStandings(response.data));
    }).catch(Site.handleAxiosError);
};

const getLeagues = () => async dispatch => {
    const url = Site.resolveClientUrl('soccer/getLeagues');
    await DataService.postDataAsync(url).then(response => {
        dispatch(setLeagues(response.data));
    }).catch(Site.handleAxiosError);
};

export const ActionCreators = {
    setFavLeagues,
    setLeague,
    setMatches,
    setLiveMatches,
    setSeasonStandings,
    setLeagues,
    setIsCurrentSeason,
    getFavLeagues,
    getMatchesBySeason,
    getSeasonStandings,
    getLeagues
};