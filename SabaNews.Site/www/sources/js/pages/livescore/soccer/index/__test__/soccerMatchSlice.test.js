import soccerMatchSlice, {
    setSearchKey,
    setSelectedDate,
    setDateRanges,
    setFavLeagues,
    setMatches,
    setLiveMatches,
    setFlagToggleFavLeagueIcon,
    setLeagues,
    setBanner,
    setTodayFixturePosts
} from '../soccerMatchSlice';

describe('soccerMatchSlice', () => {
    describe('reducers', () => {
        describe('setSearchKey', () => {
            it('updates state correctly', () => {
                expect(
                    soccerMatchSlice({
                        today: '2022-05-25',
                        searchKey: ''
                    }, {
                        type: setSearchKey.type,
                        payload: 'searchkey'
                    })
                ).toEqual({
                    today: '2022-05-25',
                    searchKey: 'searchkey'
                });
            });
        });

        describe('setSelectedDate', () => {
            it('updates state correctly', () => {
                expect(
                    soccerMatchSlice({
                        today: '2022-05-25',
                        selectedDate: ''
                    }, {
                        type: setSelectedDate.type,
                        payload: '2022-05-25'
                    })
                ).toEqual({
                    today: '2022-05-25',
                    selectedDate: '2022-05-25'
                });
            });
        });

        describe('setDateRanges', () => {
            it('updates state correctly', () => {
                expect(
                    soccerMatchSlice({
                        today: '2022-05-25',
                        dateRanges: []
                    }, {
                        type: setDateRanges.type,
                        payload: ['2022-05-24', '2022-05-25']
                    })
                ).toEqual({
                    today: '2022-05-25',
                    dateRanges: ['2022-05-24', '2022-05-25']
                });
            });
        });

        describe('setFavLeagues', () => {
            it('updates state correctly', () => {
                expect(
                    soccerMatchSlice({
                        today: '2022-05-25',
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
                    today: '2022-05-25',
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

        describe('setMatches', () => {
            it('updates state correctly', () => {
                expect(
                    soccerMatchSlice({
                        today: '2022-05-25',
                        matches: []
                    }, {
                        type: setMatches.type,
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
                    today: '2022-05-25',
                    matches: [
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
            });
        });

        describe('setLiveMatches', () => {
            afterEach(() => {
                window.isLivePage = false;
            });

            it('updates state correctly when isLivePage = true', () => {
                window.isLivePage = true;

                expect(
                    soccerMatchSlice({
                        today: '2022-05-25',
                        matches: []
                    }, {
                        type: setLiveMatches.type,
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
                    today: '2022-05-25',
                    totalLiveMatches: 1,
                    matches: [
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
            });

            it('do nothing when isLivePage = false and today != selectedDate', () => {
                expect(
                    soccerMatchSlice({
                        today: '2022-05-25',
                        selectedDate: '2022-05-24',
                        matches: []
                    }, {
                        type: setLiveMatches.type,
                        payload: [
                            {
                                matchId: 1,
                                league: {
                                    leagueId: 1,
                                    leagueNameEN: 'Premier League',
                                    leagueNameVN: 'Ngoại hạng Anh',
                                }
                            }
                        ]
                    })
                ).toEqual({
                    today: '2022-05-25',
                    selectedDate: '2022-05-24',
                    totalLiveMatches: 1,
                    matches: []
                });
            });

            it('do nothing when isLivePage = false and matches = null', () => {
                expect(
                    soccerMatchSlice({
                        today: '2022-05-25',
                        selectedDate: '2022-05-25',
                        matches: null
                    }, {
                        type: setLiveMatches.type,
                        payload: [
                            {
                                matchId: 1,
                                league: {
                                    leagueId: 1,
                                    leagueNameEN: 'Premier League',
                                    leagueNameVN: 'Ngoại hạng Anh',
                                }
                            }
                        ]
                    })
                ).toEqual({
                    today: '2022-05-25',
                    selectedDate: '2022-05-25',
                    totalLiveMatches: 1,
                    matches: null
                });
            });

            it('updates state correctly when isLivePage = false, today === selectedDate, matches != null', () => {
                expect(
                    soccerMatchSlice({
                        today: '2022-05-25',
                        selectedDate: '2022-05-25',
                        matches: [
                            {
                                matchId: 1,
                                league: {
                                    leagueId: 1,
                                    leagueNameEN: 'Premier League',
                                    leagueNameVN: 'Ngoại hạng Anh',
                                }
                            },
                            {
                                matchId: 2,
                                league: {
                                    leagueId: 2,
                                    leagueNameEN: 'La Liga'
                                }
                            }
                        ]
                    }, {
                        type: setLiveMatches.type,
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
                    today: '2022-05-25',
                    selectedDate: '2022-05-25',
                    totalLiveMatches: 1,
                    matches: [
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
                        },
                        {
                            matchId: 2,
                            league: {
                                leagueId: 2,
                                leagueNameEN: 'La Liga'
                            }
                        }
                    ]
                });
            });
        });

        describe('setLeagues', () => {
            it('should update state correctly', () => {
                expect(
                    soccerMatchSlice({
                        leagues: []
                    }, {
                        type: setLeagues.type,
                        payload: [
                            {leagueId: 1},
                            {leagueId: 2}
                        ]
                    })
                ).toEqual({
                    leagues: [
                        {leagueId: 1},
                        {leagueId: 2}
                    ]
                });
            })
        });

        describe('setBanner', () => {
            it('should update state correctly', () => {
                expect(
                    soccerMatchSlice({
                        banner: {}
                    }, {
                        type: setBanner.type,
                        payload: {'desktop': 'desktopUrl', 'mobile': 'mobileUrl'}
                    })
                ).toEqual({
                    banner: {'desktop': 'desktopUrl', 'mobile': 'mobileUrl'}
                });
            })
        });

        describe('setFlagToggleFavLeagueIcon', () => {
            it('should update state correctly', () => {
                expect(
                    soccerMatchSlice({
                        flagToggleFavLeagueIcon: false
                    }, {
                        type: setFlagToggleFavLeagueIcon.type,
                        payload: true
                    })
                ).toEqual({
                    flagToggleFavLeagueIcon: true
                });
            })
        });
        describe('setTodayFixturePosts', () => {
            it('should update state correctly', () => {
                expect(
                    soccerMatchSlice({
                        todayFixturePosts: []
                    }, {
                        type: setTodayFixturePosts.type,
                        payload: [{postId: 1}, {postId: 2}]
                    })
                ).toEqual({
                    todayFixturePosts: [{postId: 1}, {postId: 2}]
                });
            })
        });
    });
});