import matchDetailSlice, {
    setMatch,
    setActiveTab,
    setLeagues
} from '../matchDetailSlice';


describe('matchDetailSlice', () => {
    describe('reducers', () => {

        describe('setMatch', () => {
            it('should update state correctly', () => {
                expect(
                    matchDetailSlice({
                        match: null
                    }, {
                        type: setMatch.type,
                        payload: {
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
                    })
                ).toEqual({
                    match: {
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
                });
            });
        });
        describe('setActiveTab', () => {
            it('should update state correctly', () => {
                expect(
                    matchDetailSlice({
                        activeTab: ''
                    }, {
                        type: setActiveTab.type,
                        payload: 'dien-bien'
                    })
                ).toEqual({
                    activeTab: 'dien-bien',
                });
            });
        });
    });
});