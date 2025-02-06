import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Site from '@jsroot/common/site';
import DataService from '@jsroot/common/dataService';
import { ActionCreators } from '../actions';
import CommonFunctions from '@jsroot/common/common-functions';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('actionCreators', () => {
    beforeAll(() => {
        Site.resolveClientUrl = jest.fn(url => url);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getFavLeagues', () => {
        it('should call setMatches when fav league is empty', () => {
            // Arrange
            CommonFunctions.getFavLeagueParam = jest.fn().mockReturnValue('');
            const store = mockStore({
                favLeagues: []
            });
            // Act
            store.dispatch(ActionCreators.getFavLeagues());
        });

        it('should call setMatches when have fav leagues', () => {
            // Arrange
            const response = {
                data: [{leagueId: 1}, {leagueId: 2}]
            };
            const params = {
                leagueIds: response.data
            };
            CommonFunctions.getFavLeagueParam = jest.fn().mockReturnValue(response.data);
            CommonFunctions.refreshFavLeagues = jest.fn().mockReturnValue(response.data);
            const store = mockStore({
                favLeagues: []
            });
            const promise = Promise.resolve(response);
            DataService.postDataAsync = jest.fn(() => promise);
            const expectedActions = [{ type: ActionCreators.setFavLeagues.type, payload: response.data }];

            // Act
            store.dispatch(ActionCreators.getFavLeagues());

            // Assert
            expect(DataService.postDataAsync).toHaveBeenCalledWith('soccer/GetFavLeagues', params);
        });
    });

    describe('getMatchesBySeason', () => {
        it('should call setMatches when get matches have been done', async () => {
            // Arrange
            const expectedParams = {
                leagueId: 1,
                seasonId: 1,
                isCurrentSeason: "True"
            };
            const response = {
                data: {
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
                }
            };
            const promise = Promise.resolve(response);
            DataService.postDataAsync = jest.fn(() => promise);
            const expectedActions = [
                { type: ActionCreators.setLeague.type, payload: response.data.league },
                { type: ActionCreators.setMatches.type, payload: response.data.matches },
                { type: ActionCreators.setIsCurrentSeason.type, payload: true }
            ];
            const store = mockStore({
                majorLeagues: [],
                league: null,
                preMatches: null,
                postMatches: null
            });

            // Act
            await store.dispatch(ActionCreators.getMatchesBySeason(expectedParams));

            // Assert
            expect(DataService.postDataAsync).toHaveBeenCalledWith('soccer/getMatchesBySeason', expectedParams);
            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    describe('getSeasonStandings', () => {
        it('should call setSeasonStandings when get season standings have been done', async () => {
            // Arrange
            const expectedParams = { seasonId: 1 };
            const response = {
                data: [
                    {
                        stageId: 1, stageNameEN: 'League',
                        teamId: 1, teamNameEN: 'Manchester City'
                    }
                ]
            };
            const promise = Promise.resolve(response);
            DataService.postDataAsync = jest.fn(() => promise);
            const expectedActions = [{ type: ActionCreators.setSeasonStandings.type, payload: response.data }];
            const store = mockStore({
                majorLeagues: [],
                seasonStandings: []
            });

            // Act
            await store.dispatch(ActionCreators.getSeasonStandings(expectedParams));

            // Assert
            expect(DataService.postDataAsync).toHaveBeenCalledWith('soccer/getSeasonStandings', expectedParams);
            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    describe('getLeagues', () => {
        it('should call setLeagues when get major leagues have been done', async () => {
            // Arrange
            const response = {
                data: [{
                    leagueId: 1,
                    leagueNameEN: 'Champions League',
                    leagueNameVN: 'Champions League'
                },
                {
                    leagueId: 2,
                    leagueNameEN: 'Premier League',
                    leagueNameVN: 'Ngoại hạng Anh'
                }]
            };
            const promise = Promise.resolve(response);
            DataService.postDataAsync = jest.fn(() => promise);
            const expectedActions = [{ type: ActionCreators.setLeagues.type, payload: response.data }];
            const store = mockStore({
                leagues: []
            });

            // Act
            await store.dispatch(ActionCreators.getLeagues());

            // Assert
            expect(DataService.postDataAsync).toHaveBeenCalledWith('soccer/getLeagues');
            expect(store.getActions()).toEqual(expectedActions);
        });
    });
});