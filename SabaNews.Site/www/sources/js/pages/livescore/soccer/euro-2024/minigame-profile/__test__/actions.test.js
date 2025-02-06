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

    describe('getProfileData', () => {
        it('should call setData correct when called', async () => {
            // Arrange
            const expectedParams = {
                leagueId: Euro.leagueId,
                seasonId: Euro.seasonId
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
                    }],
                    votes: [
                        { userId: 1, matchId: 1, teamId: 0 }
                    ],
                    statusStages:[{stage: 1, status: "Đang diễn ra"},{stage: 1, status: "Đã kết thúc"}]
                }
            };
            const promise = Promise.resolve(response);
            DataService.postDataAsync = jest.fn(() => promise);
            const expectedActions = [
                { type: ActionCreators.setVotes.type, payload: response.data.votes },
                { type: ActionCreators.setStatusStages.type, payload: response.data.statusStages },
                { type: ActionCreators.setLeague.type, payload: response.data.league },
                { type: ActionCreators.setMatches.type, payload: response.data.matches }
            ];
            const store = mockStore({
                league: null,
                matches: null,
                votes: null,
                statusStages: null
            });

            // Act
            await store.dispatch(ActionCreators.getProfileData(expectedParams));

            // Assert
            expect(DataService.postDataAsync).toHaveBeenCalledWith('Euro2024/GetMinigameByUser', expectedParams);
            expect(store.getActions()).toEqual(expectedActions);
        });
    });
});