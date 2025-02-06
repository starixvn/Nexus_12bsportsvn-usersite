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


    describe('getStanding', () => {
        it('should call setMatches when get matches have been done', async () => {
            // Arrange
            const expectedParams = {
                leagueId: window.leagueId,
                seasonId: window.seasonId
            };
            const response = {
                data: {
                    league: {
                        leagueId: 1,
                        leagueNameEN: 'Premier League',
                        leagueNameVN: 'Ngoại hạng Anh'
                    },
                    standing: [{teamId: 1}, {teamId: 2}]
                }
            };
            const promise = Promise.resolve(response);
            DataService.postDataAsync = jest.fn(() => promise);
            const expectedActions = [
                { type: ActionCreators.setStanding.type, payload: response.data.standing },
                { type: ActionCreators.setLeague.type, payload: response.data.league }
            ];
            const store = mockStore({
                standing: null,
                league: null,
            });

            // Act
            await store.dispatch(ActionCreators.getStanding(expectedParams));

            // Assert
            expect(DataService.postDataAsync).toHaveBeenCalledWith('soccer/GetLeagueSeasonStanding', expectedParams);
            expect(store.getActions()).toEqual(expectedActions);
        });
    });
});