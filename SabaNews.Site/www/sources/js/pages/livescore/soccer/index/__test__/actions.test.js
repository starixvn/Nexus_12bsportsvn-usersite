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

    describe('getMatchesByDate', () => {
        it('should call setMatches when get matches have been done', async () => {
            // Arrange
            const expectedParams = {
                eventDate: '2022-05-25'
            };
            const response = {
                data: [{
                    matchId: 1,
                    league: {
                        leagueId: 1,
                        leagueNameEN: 'Premier League',
                        leagueNameVN: 'Ngoại hạng Anh'
                    },
                    homeTeam: { teamId: 1, teamNameEN: 'Arsenal' },
                    awayTeam: { teamId: 2, teamNameEN: 'Everton' }
                }]
            };
            const promise = Promise.resolve(response);
            DataService.postDataAsync = jest.fn(() => promise);
            const expectedActions = [{ type: ActionCreators.setMatches.type, payload: response.data }];
            const store = mockStore({
                today: '',
                matches: []
            });

            // Act
            await store.dispatch(ActionCreators.getMatchesByDate(expectedParams));

            // Assert
            expect(DataService.postDataAsync).toHaveBeenCalledWith('soccer/getMatches', expectedParams);
            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    describe('getLiveMatches', () => {
        it('should call setLiveMatches when get matches have been done', async () => {
            // Arrange
            const response = {
                data: [{
                    matchId: 1,
                    league: {
                        leagueId: 1,
                        leagueNameEN: 'Premier League',
                        leagueNameVN: 'Ngoại hạng Anh'
                    },
                    homeTeam: { teamId: 1, teamNameEN: 'Arsenal' },
                    awayTeam: { teamId: 2, teamNameEN: 'Everton' }
                }]
            };
            const promise = Promise.resolve(response);
            DataService.postDataAsync = jest.fn(() => promise);
            const expectedActions = [{ type: ActionCreators.setLiveMatches.type, payload: response.data }];
            const store = mockStore({
                today: '',
                matches: []
            });

            // Act
            await store.dispatch(ActionCreators.getLiveMatches());

            // Assert
            expect(DataService.postDataAsync).toHaveBeenCalledWith('soccer/getLiveMatches');
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

    describe('getBanner', () => {
        it('should call setLeagues when get major leagues have been done', async () => {
            // Arrange
            const response = {
                data: {'desktop': 'desktopUrl', 'mobile': 'mobileUrl'}
            };
            const promise = Promise.resolve(response);
            DataService.postDataAsync = jest.fn(() => promise);
            const expectedActions = [{ type: ActionCreators.setBanner.type, payload: response.data }];
            const store = mockStore({
                banner: []
            });

            // Act
            await store.dispatch(ActionCreators.getBanner());

            // Assert
            expect(DataService.postDataAsync).toHaveBeenCalledWith('api/banner');
            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    describe('getTodayFixturePosts', () => {
        it('should call setLeagues when get major leagues have been done', async () => {
            // Arrange
            const response = {
                data: {'desktop': 'desktopUrl', 'mobile': 'mobileUrl'}
            };
            const promise = Promise.resolve(response);
            DataService.postDataAsync = jest.fn(() => promise);
            const expectedActions = [{ type: ActionCreators.setTodayFixturePosts.type, payload: response.data }];
            const store = mockStore({
                banner: []
            });

            // Act
            await store.dispatch(ActionCreators.getTodayFixturePosts());

            // Assert
            expect(DataService.postDataAsync).toHaveBeenCalledWith('api/post/today-fixture');
            expect(store.getActions()).toEqual(expectedActions);
        });
    });
});