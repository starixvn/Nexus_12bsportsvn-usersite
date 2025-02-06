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

    describe('getTodayMatches', () => {
        it('should call getTodayMatches when get matches have been done', async () => {
            // Arrange
            const response = {
                data: [{
                    league: { leagueId: 1 },
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
                { type: ActionCreators.setToday.type, payload: response.data },
            ];
            const store = mockStore({
                todayMatches: null,
            });

            // Act
            await store.dispatch(ActionCreators.getTodayMatches());

            // Assert
            expect(DataService.postDataAsync).toHaveBeenCalledWith('api/getTodayMatches');
            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    describe('getLiveMatches', () => {
        it('should call getLiveMatches when get matches have been done', async () => {
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
            const expectedActions = [{ type: ActionCreators.setLive.type, payload: response.data }];
            const store = mockStore({
                liveMatches: null
            });

            // Act
            await store.dispatch(ActionCreators.getLiveMatches());

            // Assert
            expect(DataService.postDataAsync).toHaveBeenCalledWith('soccer/getLiveMatches');
            expect(store.getActions()).toEqual(expectedActions);
        });
    });
});