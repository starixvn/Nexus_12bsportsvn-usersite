import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Site from '@jsroot/common/site';
import DataService from '@jsroot/common/dataService';
import { ActionCreators } from '../actions';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('actionCreators', () => {
    beforeAll(() => {
        window.selectedMatchId = 1;
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
                    generalInfo: {
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
                    headToHead: {
                        away: [{
                            matchId: 1,
                            league: {
                                leagueId: 1,
                                leagueNameEN: 'Seagame',
                                leagueNameVN: 'Seagame',
                            },
                            homeTeam: {
                                teamId: 1,
                                teamNameEN: 'VietNam',
                            },
                            awayTeam: {
                                teamId: 2,
                                teamNameEN: 'ThaiLan',
                            }
                        }],
                        common: [{
                            matchId: 1,
                            league: {
                                leagueId: 1,
                                leagueNameEN: 'Seagame',
                                leagueNameVN: 'Seagame',
                            },
                            homeTeam: {
                                teamId: 1,
                                teamNameEN: 'VietNam',
                            },
                            awayTeam: {
                                teamId: 2,
                                teamNameEN: 'ThaiLan',
                            }
                        }],
                        home: [{
                            matchId: 1,
                            league: {
                                leagueId: 1,
                                leagueNameEN: 'Seagame',
                                leagueNameVN: 'Seagame',
                            },
                            homeTeam: {
                                teamId: 1,
                                teamNameEN: 'VietNam',
                            },
                            awayTeam: {
                                teamId: 2,
                                teamNameEN: 'ThaiLan',
                            }
                        }],

                    },
                    incidents: [{
                        matchId: 1,
                        type: 11,
                        position: 0,
                        time: 45
                    }],
                    lineup:{
                        generalInfo: {
                            awayCoach: "Carlo",
                            awayFormation: "4-3-3",
                            homeCoach: "Klopp",
                            homeFormartion: "4-3-3"
                        },
                        away: [{
                            matchId: 1,
                            teamId: 32948,
                            playerId: 25185,
                            palyerName:"alaba"
                        }],
                        home: [{
                            matchId: 1,
                            teamId: 41784,
                            playerId: 43464,
                            palyerName:"Becker"
                        }]
                    },
                    statistic:{
                        awayStatistic: [{
                            matchId: 1,
                            onGoal:3
                        }],
                        homeStatistic: [{
                            matchId: 1,
                            onGoal:2
                        }]
                    }
                }
            };
            const expectedParams = {
                matchId: window.selectedMatchId
            };
            const promise = Promise.resolve(response);
            DataService.postDataAsync = jest.fn(() => promise);
            const expectedActions = [{ type: ActionCreators.setMatch.type, payload: response.data }];
            const store = mockStore({
                matches: []
            });

            // Act
            await store.dispatch(ActionCreators.getMatchDetail(expectedParams));

            // Assert
            expect(DataService.postDataAsync).toHaveBeenCalledWith('soccer/GetMatchDetail', expectedParams);
            expect(store.getActions()).toEqual(expectedActions);
        });
    });
});