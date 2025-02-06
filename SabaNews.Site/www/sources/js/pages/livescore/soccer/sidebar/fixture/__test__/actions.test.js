import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Site from '@jsroot/common/site';
import DataService from '@jsroot/common/dataService';
import { ActionCreators } from '../actions';
import { WorldCup } from '@jsroot/common/constants';
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('actionCreators', () => {
    beforeAll(() => {
        Site.resolveClientUrl = jest.fn(url => url);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getLeagues', () => {
        it('should call setMatches when get matches have been done', async () => {
            // Arrange
            const expectedParams = {
                leagueId: WorldCup.leagueId,
                seasonId: WorldCup.seasonId
            };
            const response = {
                data: [{
                    league: {
                        leagueId: 1,
                        leagueNameEN: 'Premier League',
                        leagueNameVN: 'Ngoại hạng Anh'
                    },
                    matches: [{
                        matchId: 1,
                        homeTeam: { teamId: 1, teamNameEN: 'Arsenal' },
                        awayTeam: { teamId: 2, teamNameEN: 'Everton' }
                    }]
                }]
            };
            const promise = Promise.resolve(response);
            DataService.postDataAsync = jest.fn(() => promise);
            const expectedActions = [
                { type: ActionCreators.setLeagues.type, payload: response.data },
            ];
            const store = mockStore({
                leagues: null,
            });

            // Act
            await store.dispatch(ActionCreators.getLeagues(expectedParams));

            // Assert
            expect(DataService.postDataAsync).toHaveBeenCalledWith('api/GetHomeFixture');
            expect(store.getActions()).toEqual(expectedActions);
        });
    });
});