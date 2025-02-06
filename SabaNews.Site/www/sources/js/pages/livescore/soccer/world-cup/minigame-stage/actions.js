import Site from '@jsroot/common/site';
import { WorldCup } from '@jsroot/common/constants';
import DataService from '@jsroot/common/dataService';
import {
    setMatches,
    setLeague,
    setVotes,
    setUpdateVote
} from './minigameStageSlice';

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
    const url = Site.resolveClientUrl('worldcup2022/GetMinigameByUserStage');
    var param = {
        stage: window.stage
    };
    await DataService.postDataAsync(url, param).then(response => {
        dispatch(setVotes(response.data));
    }).catch(Site.handleAxiosError);
};

const updateVote = params => async dispatch => {
    const url = Site.resolveClientUrl('worldcup2022/UpdateMinigameVote');
    await DataService.postDataAsync(url, params).then(response => {
        if(!response.data) {
            const page = Site.resolveClientUrl(WorldCup.MinigameUrl);
            window.location = page;
        } else {
            dispatch(setUpdateVote(response.data));
        }
    }).catch(Site.handleAxiosError);
};


export const ActionCreators = {
    setMatches,
    setVotes,
    setLeague,
    setUpdateVote,
    getMatches,
    getVotes,
    updateVote,
};