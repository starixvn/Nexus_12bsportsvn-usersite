import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Site from '@jsroot/common/site';
import DataService from '@jsroot/common/dataService';
import { ActionCreators } from '../actions';
import { Euro } from '../../euro-constants';
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('actionCreators', () => {
    beforeAll(() => {
        Site.resolveClientUrl = jest.fn(url => url);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getMatches', () => {
        it('should call setMatches when get matches have been done', async () => {
            // Arrange
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
                { type: ActionCreators.setMatches.type, payload: response.data.matches }
            ];
            const store = mockStore({
                majorLeagues: [],
                league: null,
                preMatches: null,
                postMatches: null
            });

            // Act
            await store.dispatch(ActionCreators.getMatches());

            // Assert
            expect(DataService.postDataAsync).toHaveBeenCalledWith('Euro2024/GetFixture');
            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    describe('getVotes', () => {
        it('should call setMatches when get matches have been done', async () => {
            // Arrange
            window.stage = 1;
            const response = {
                data: [
                    {matchId: 1, userId: 1},
                    {matchId: 2, userId: 1}
                ]
            };

            var expectedParam = {
                stage: 1,
                leagueId: Euro.leagueId,
                seasonId: Euro.seasonId
            }
            const promise = Promise.resolve(response);
            DataService.postDataAsync = jest.fn(() => promise);
            const expectedActions = [
                { type: ActionCreators.setVotes.type, payload: response.data },
            ];
            const store = mockStore({
                votes: null,
            });

            // Act
            await store.dispatch(ActionCreators.getVotes());

            // Assert
            expect(DataService.postDataAsync).toHaveBeenCalledWith('Euro2024/GetLegueMinigameByUserStage', expectedParam);
            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    describe('updateVote', () => {
        it('should call setUpdateVote when update vote have been done', async () => {
            // Arrange
            const params = {
                matchId: 1,
                teamId: 0,
                leagueId: Euro.leagueId,
                seasonId: Euro.seasonId
            }
            const response = {
                data: {
                    isSuccessful: true,
                    message: 'success'
                }
            };
            const promise = Promise.resolve(response);
            DataService.postDataAsync = jest.fn(() => promise);
            const expectedActions = [
                { type: ActionCreators.setUpdateVote.type, payload: response.data },
            ];
            const store = mockStore({
                votes: null,
            });

            // Act
            await store.dispatch(ActionCreators.updateVote(params));

            // Assert
            expect(DataService.postDataAsync).toHaveBeenCalledWith('Euro2024/UpdateVoteMinigame', params);
            expect(store.getActions()).toEqual(expectedActions);
        });

        it('should call setUpdateVote when update vote have been done', async () => {
            // Arrange
            const params = {
                matchId: 1,
                teamId: 0,
                leagueId: Euro.leagueId,
                seasonId: Euro.seasonId
            }
            const response = {
                data: null
            };
            const promise = Promise.resolve(response);
            DataService.postDataAsync = jest.fn(() => promise);
            const store = mockStore({
                votes: null,
            });

            // Act
            await store.dispatch(ActionCreators.updateVote(params));

        });
    });
});