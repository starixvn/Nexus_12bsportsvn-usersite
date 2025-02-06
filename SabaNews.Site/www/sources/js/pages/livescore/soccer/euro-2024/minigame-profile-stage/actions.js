import Site from '@jsroot/common/site';
import DataService from '@jsroot/common/dataService';
import { Euro } from '../euro-constants';
import {
    setMatches,
    setLeague,
    setVotes,
    setUpdateVote
} from './minigameProfileStageSlice';

const getMatches = () => async dispatch => {
    const url = Site.resolveClientUrl('Euro2024/GetFixture');
    await DataService.postDataAsync(url).then(response => {
        const { league, matches } = response.data;
        dispatch(setLeague(league));
        dispatch(setMatches(matches));
    }).catch(Site.handleAxiosError);
};

const getVotes = () => async dispatch => {
    const url = Site.resolveClientUrl('Euro2024/GetLegueMinigameByUserStage');
    var param = {
        stage: window.stage,
        leagueId: Euro.leagueId,
        seasonId: Euro.seasonId
    }
    await DataService.postDataAsync(url, param).then(response => {
        dispatch(setVotes(response.data));
    }).catch(Site.handleAxiosError);
};

const updateVote = params => async dispatch => {
    params.leagueId = Euro.leagueId;
    params.seasonId = Euro.seasonId;
    const url = Site.resolveClientUrl('Euro2024/UpdateVoteMinigame');
    await DataService.postDataAsync(url, params).then(response => {
        if(!response.data) {
            const page = Site.resolveClientUrl(Euro.MinigameUrl);
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