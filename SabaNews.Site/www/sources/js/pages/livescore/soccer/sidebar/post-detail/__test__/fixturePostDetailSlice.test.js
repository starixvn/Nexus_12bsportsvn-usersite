import fixturePostDetailSlice, { setToday , setLive , setLiveMatches } from '../fixturePostDetailSlice';
describe('fixtureTodayPostDetail', () => {
    afterAll(() => {
        jest.clearAllMocks();
    });
    describe('reducers', () => {
        describe('setToday', () => {
            it('updated state correctly',  () => {
                expect(
                    fixturePostDetailSlice({
                        today: '2023-08-18',
                        todayMatches: null
                    },{
                        type: setToday.type,
                        payload: [
                            {
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
                            }
                        ]
                    })
                ).toEqual({
                    today: '2023-08-18',
                    todayMatches: [
                        {
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
                        }
                    ]
                });
            })
        });
        describe('setLive', () => {
            it('updated state correctly',  () => {
                expect(
                    fixturePostDetailSlice({
                        liveMatches : [
                            {
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
                            }
                        ]
                    },{
                        type: setLive.type,
                        payload: [
                            {
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
                            }
                        ]
                    })
                ).toEqual({
                    liveMatches : [
                        {
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
                        }
                    ]
                });
            })
        });

        describe('setLiveMatches', () => {
            it('updates state correctly', () => {
                expect(
                    fixturePostDetailSlice({
                        todayMatches: [{matchId: 1}, {matchId: 2}],
                    }, {
                        type: setLiveMatches.type,
                        payload: [
                            { matchId: 1, status: 0 },
                            { matchId: 3, status: 50 }
                        ]
                    })
                ).toEqual({
                    liveMatches: [{ matchId: 1, status: 0 }, { matchId: 3, status: 50 }],
                    todayMatches: [ { matchId: 1, status: 0 }, {matchId: 2}],
                });
            });
        })
    });
});