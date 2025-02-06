import { WorldCup } from '@jsroot/common/constants';
import DataService from '@jsroot/common/dataService';
import Site from '@jsroot/common/site';
import {
    setMatches,
    setLeague,
    setVotes
} from './minigameDetailSlice';

const getMatches = () => async dispatch => {
    const url = Site.resolveClientUrl('soccer/getMatchesBySeason');
    var param = {
        leagueId: WorldCup.leagueId,
        seasonId: WorldCup.seasonId
    }
    await DataService.postDataAsync(url, param).then(response => {
        const { league, matches } = response.data;
        dispatch(setLeague(league));
        dispatch(setMatches(matches));
    }).catch(Site.handleAxiosError);
};

const getVotes = () => async dispatch => {
    const url = Site.resolveClientUrl('worldcup2022/GetMinigameByUser');
    await DataService.postDataAsync(url).then(response => {
        dispatch(setVotes(response.data));
    }).catch(Site.handleAxiosError);
};



export const ActionCreators = {
    setMatches,
    setVotes,
    setLeague,
    getMatches,
    getVotes,
};