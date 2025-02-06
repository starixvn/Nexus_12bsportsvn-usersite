import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Site from '@jsroot/common/site';
import DataService from '@jsroot/common/dataService';
import { ActionCreators } from '../actions';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('actionCreators', () => {
    beforeAll(() => {
        window.matchId = 1;
        Site.resolveClientUrl = jest.fn(url => url);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getMatchDetail', () => {
        it('should call setMatch when get match detail have been done', async () => {
            // Arrange
            const response = {
                data: {
                    match: {
                        matchId: 1,
                        league: {
                            leagueId: 1,
                            leagueNameEN: 'Premier League',
                            leagueNameVN: 'Ngoại hạng Anh',
                        },
                        homeTeam: {
                            teamId: 1,
                            teamNameEN: 'Arsenal',
                        },
                        awayTeam: {
                            teamId: 2,
                            teamNameEN: 'Everton',
                        }
                    },
                    incidents: [{
                        matchId: 1,
                        type: 11,
                        position: 0,
                        time: 45
                    }]
                }
            };
            const expectedParams = {
                matchId: window.matchId
            };
            const promise = Promise.resolve(response);
            DataService.postDataAsync = jest.fn(() => promise);
            const expectedActions = [
                { type: ActionCreators.setIncident.type, payload: response.data.incidents },
                { type: ActionCreators.setMatch.type, payload: response.data.match }
            ];
            const store = mockStore({
                matches: []
            });

            // Act
            await store.dispatch(ActionCreators.getMatchDetail());

            // Assert
            expect(DataService.postDataAsync).toHaveBeenCalledWith('soccer/GetMatchGeneralInfo', expectedParams);
            expect(store.getActions()).toEqual(expectedActions);
        });
    });
});