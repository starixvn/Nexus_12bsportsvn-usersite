import { Euro } from '../euro-constants';
import DataService from '@jsroot/common/dataService';
import Site from '@jsroot/common/site';
import {
    setMatches,
    setLeague,
    setVotes,
    setStatusStages
} from './minigameProfileSlice';


const getProfileData = () => async dispatch => {
    var params = {
        leagueId: Euro.leagueId,
        seasonId: Euro.seasonId
    }
    const url = Site.resolveClientUrl('Euro2024/GetMinigameByUser');
    await DataService.postDataAsync(url, params).then(response => {
        const { votes, statusStages, league, matches } = response.data;
        dispatch(setVotes(votes));
        dispatch(setStatusStages(statusStages));
        dispatch(setLeague(league));
        dispatch(setMatches(matches));
    }).catch(Site.handleAxiosError);
};



export const ActionCreators = {
    setMatches,
    setVotes,
    setLeague,
    setStatusStages,
    getProfileData,
};