import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Site from '@jsroot/common/site';
import DataService from '@jsroot/common/dataService';
import { ActionCreators } from '../actions';
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('actionCreators', () => {
    beforeAll(() => {
        Site.resolveClientUrl = jest.fn(url => url);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getTeamData', () => {
        it('should call getTeamData when get team detail have been done', async () => {
            const response = {
                data: {
                    matches: [{
                        matchId: 1,
                        homeTeam: { teamId: 1, teamNameEN: 'Arsenal' },
                        awayTeam: { teamId: 2, teamNameEN: 'Everton' }
                    }],
                    players : [{
                        teamId : 1,
                        playerId : 11,
                        playerFullName : 'best',
                        position: 3,
                        shirtNumber : 1,
                    }],
                    profile : {
                        id : 8054,
                        postName : 'best'
                    }
                }
            };
            const teamId = 33122;
            const expectedParams = {
                teamId: teamId
            };
            const promise = Promise.resolve(response);
            DataService.postDataAsync = jest.fn(() => promise);
            const expectedActions = [
                { type: ActionCreators.setMatches.type, payload: response.data.matches },
                { type: ActionCreators.setPlayers.type, payload: response.data.players },
                { type: ActionCreators.setProfile.type, payload: response.data.profile }
            ];
            const store = mockStore({
                stages: [],
                players: null,
                team: null,
                profile: null,
                preMatches: null,
                postMatches: null
            });
            await store.dispatch(ActionCreators.getTeamData(teamId));

            // Assert
            expect(DataService.postDataAsync).toHaveBeenCalledWith('euro2024/GetTeamDetailData', expectedParams);
            expect(store.getActions()).toEqual(expectedActions);
        })
    });
});