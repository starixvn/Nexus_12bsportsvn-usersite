import leagueDetailSlice, {
    setFavLeagues,
    setLeague,
    setMatches,
    setLiveMatches,
    setSeasonStandings,
    setLeagues,
    setIsCurrentSeason
} from '../leagueDetailSlice';
import DateTimeService from '@jsroot/common/dateTimeService';

describe('leagueDetailSlice', () => {
    beforeAll(() => {
        DateTimeService.getCurrentClientDateTime = jest.fn(() => '2022-05-25')
    });

    afterAll(() => {
        jest.clearAllMocks();
    });

    it('initial state correctly', () => {
        expect(leagueDetailSlice(undefined, {})).toEqual({
            favLeagues: [],
            league: null,
            stages: [],
            preMatches: null,
            postMatches: null,
            seasonStandings: [],
            leagues: [],
            isCurrentSeason: true
        });
    });

    describe('reducers', () => {
        describe('setFavLeagues', () => {
            it('updates state correctly', () => {
                expect(
                    leagueDetailSlice({
                        preMatches: null,
                        favLeagues: []
                    }, {
                        type: setFavLeagues.type,
                        payload: [
                            {
                                leagueId: 1,
                                leagueNameEN: 'Champions League',
                                leagueNameVN: 'Champions League'
                            },
                            {
                                leagueId: 2,
                                leagueNameEN: 'Premier League',
                                leagueNameVN: 'Ngoại hạng Anh'
                            }
                        ]
                    })
                ).toEqual({
                    preMatches: null,
                    favLeagues: [
                        {
                            leagueId: 1,
                            leagueNameEN: 'Champions League',
                            leagueNameVN: 'Champions League'
                        },
                        {
                            leagueId: 2,
                            leagueNameEN: 'Premier League',
                            leagueNameVN: 'Ngoại hạng Anh'
                        }
                    ]
                });
            });
        });

        describe('setLeague', () => {
            it('updates state correctly', () => {
                expect(
                    leagueDetailSlice({
                        preMatches: null,
                        league: null
                    }, {
                        type: setLeague.type,
                        payload: {
                            leagueId: 1,
                            leagueNameEN: 'Champions League',
                            leagueNameVN: 'Champions League'
                        }
                    })
                ).toEqual({
                    preMatches: null,
                    league: {
                        leagueId: 1,
                        leagueNameEN: 'Champions League',
                        leagueNameVN: 'Champions League'
                    }
                });
            });
        });

        describe('setMatches', () => {
            it('updates state correctly', () => {
                expect(
                    leagueDetailSlice({
                        stages: [],
                        preMatches: [],
                        postMatches: [],
                        seasonStandings: []
                    }, {
                        type: setMatches.type,
                        payload: [
                            { matchId: 1, status: 0, stage: { stageId: 1 }, startTime: '2022-05-20' },
                            { matchId: 2, status: 0, stage: { stageId: 2 }, startTime: '2022-05-25' },
                            { matchId: 3, status: 50, startTime: '2022-05-24' }
                        ]
                    })
                ).toEqual({
                    stages: [{ stageId: 1 }, { stageId: 2 }],
                    preMatches: [{ matchId: 2, status: 0, stage: { stageId: 2 }, startTime: '2022-05-25' }],
                    postMatches: [{ matchId: 3, status: 50, startTime: '2022-05-24' }],
                    seasonStandings: []
                });
            });
        });

        describe('setLiveMatches', () => {
            it('updates state correctly', () => {
                expect(
                    leagueDetailSlice({
                        preMatches: [{ matchId: 1 }, { matchId: 2 }],
                        postMatches: [{ matchId: 3 }, { matchId: 4 }],
                        seasonStandings: []
                    }, {
                        type: setLiveMatches.type,
                        payload: [
                            { matchId: 1, status: 0 },
                            { matchId: 3, status: 50 }
                        ]
                    })
                ).toEqual({
                    preMatches: [{ matchId: 1, status: 0 }, { matchId: 2 }],
                    postMatches: [{ matchId: 3, status: 50 }, { matchId: 4 }],
                    seasonStandings: []
                });
            });
        });

        describe('setSeasonStandings', () => {
            it('updates state correctly', () => {
                expect(
                    leagueDetailSlice({
                        preMatches: null,
                        seasonStandings: []
                    }, {
                        type: setSeasonStandings.type,
                        payload: [
                            {
                                stageId: 1,
                                stageNameEN: 'League',
                                teamId: 1,
                                teamNameEN: 'Manchester City'
                            }
                        ]
                    })
                ).toEqual({
                    preMatches: null,
                    seasonStandings: [
                        {
                            stageId: 1,
                            stageNameEN: 'League',
                            teamId: 1,
                            teamNameEN: 'Manchester City'
                        }
                    ]
                });
            });
        });

        describe('setLeagues', () => {
            it('updates state correctly', () => {
                expect(
                    leagueDetailSlice({
                        leagues: []
                    }, {
                        type: setLeagues.type,
                        payload: [
                            {
                                leagueId: 1,
                                leagueNameEN: 'Champions League',
                                leagueNameVN: 'Champions League'
                            },
                            {
                                leagueId: 2,
                                leagueNameEN: 'Premier League',
                                leagueNameVN: 'Ngoại hạng Anh'
                            }
                        ]
                    })
                ).toEqual({
                    leagues: [
                        {
                            leagueId: 1,
                            leagueNameEN: 'Champions League',
                            leagueNameVN: 'Champions League'
                        },
                        {
                            leagueId: 2,
                            leagueNameEN: 'Premier League',
                            leagueNameVN: 'Ngoại hạng Anh'
                        }
                    ]
                });
            });
        });
        describe('setIsCurrentSeason', () => {
            it('updates state correctly', () => {
                expect(
                    leagueDetailSlice({
                        isCurrentSeason: false
                    }, {
                        type: setIsCurrentSeason.type,
                        payload: true
                    })
                ).toEqual({
                    isCurrentSeason: true
                });
            });
        });
    });
});