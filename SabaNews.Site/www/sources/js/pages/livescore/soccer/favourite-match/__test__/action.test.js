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

    describe('getMatches', () => {
        it('should call setMatches when get major leagues have been done', async () => {
            // Arrange
            const response = {
                data: [{
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
                }]
            };
            const favMatch = [1, 2 ,3];
            const param = {
                matchIds: JSON.stringify(favMatch)
            }
            const promise = Promise.resolve(response);
            DataService.postDataAsync = jest.fn(() => promise);
            const expectedActions = [{ type: ActionCreators.setMatches.type, payload: response.data }];
            const store = mockStore({
                matches: []
            });
            CommonFunctions.getFavouriteMatches = jest.fn().mockReturnValue(favMatch);

            // Act
            await store.dispatch(ActionCreators.getMatches());

            // Assert
            expect(DataService.postDataAsync).toHaveBeenCalledWith('soccer/GetFavMatches', param);
            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    describe('getLiveMatches', () => {
        it('should call setMatches when get major leagues have been done', async () => {
            // Arrange
            const response = {
                data: [{
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
                }]
            };
            const promise = Promise.resolve(response);
            DataService.postDataAsync = jest.fn(() => promise);
            const expectedActions = [{ type: ActionCreators.setMatches.type, payload: response.data }];
            const store = mockStore({
                matches: []
            });

            // Act
            await store.dispatch(ActionCreators.getLiveMatches());

            // Assert
            expect(DataService.postDataAsync).toHaveBeenCalledWith('soccer/getLiveMatches');
            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    describe('getLastestNews', () => {
        it('should call setPosts when get major leagues have been done', async () => {
            // Arrange
            const response = {
                data: [{
                    postId: 1
                },
                {
                    postId: 2,
                }]
            };
            const promise = Promise.resolve(response);
            DataService.postDataAsync = jest.fn(() => promise);
            const expectedActions = [{ type: ActionCreators.setPosts.type, payload: response.data }];
            const store = mockStore({
                posts: []
            });

            // Act
            await store.dispatch(ActionCreators.getLastestNews());

            // Assert
            expect(DataService.postDataAsync).toHaveBeenCalledWith('api/post/lastestNews');
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