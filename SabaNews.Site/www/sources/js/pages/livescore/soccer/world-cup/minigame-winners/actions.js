import Site from '@jsroot/common/site';
import DataService from '@jsroot/common/dataService';
import { WorldCup } from '@jsroot/common/constants';

import {
    setMatches,
    setLeague,
    setVotes
} from './minigameWinnersSlice';

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

const getVotes = stage => async dispatch => {
    const url = Site.resolveClientUrl('worldcup2022/GetMinigameData');
    var param = {
        stage: stage
    };
    await DataService.postDataAsync(url, param).then(response => {
        window.stage = stage;
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