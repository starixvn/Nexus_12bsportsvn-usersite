import Site from '@jsroot/common/site';
import DataService from '@jsroot/common/dataService';

import {
    setMatches,
    setPlayers,
    setProfile,
    setLiveMatches
} from './teamDetailSlice';

const getTeamData = teamId => async dispatch => {
    var param = {teamId: teamId};
    const url = Site.resolveClientUrl('euro2024/GetTeamDetailData');
    await DataService.postDataAsync(url, param).then(response => {
        const { matches, players, profile } = response.data;
        dispatch(setMatches(matches));
        dispatch(setPlayers(players));
        dispatch(setProfile(profile));
    }).catch(Site.handleAxiosError);
};

export const ActionCreators = {
    setMatches,
    setPlayers,
    setProfile,
    setLiveMatches,
    getTeamData
};