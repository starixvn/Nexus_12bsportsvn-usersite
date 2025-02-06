import favouriteMatchSlice, {
    setMajorLeagues,
    setMatches,
    setLiveMatches,
    setFavouriteMatches,
    setLeagues,
    setFavLeagues,
    setPosts,
    setFlagToggleIcon
} from '../favouriteMatchSlice';
import DateTimeService from '@jsroot/common/dateTimeService';

describe('favouriteMatchSlice', () => {
    beforeAll(() => {
        DateTimeService.getCurrentClientDateTime = jest.fn(() => '2022-06-02');
    });

    afterAll(() => {
        jest.clearAllMocks();
    });
    describe('reducers', () => {
        describe('setFavLeagues', () => {
            it('should update state correctly', () => {
                expect(
                    favouriteMatchSlice({
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
            it('should update state correctly when dont have live match', () => {
                expect(
                    favouriteMatchSlice({
                        matches: [],
                        liveMatches: [],
                        postMatches: [],
                        preMatches: []
                    }, {
                        type: setMatches.type,
                        payload: {
                            matches: [
                                {matchId: 1, status: 0, startTime: '2022-06-02', endTime: '2022-06-02'},
                                {matchId: 2, status: 60, startTime: '2022-06-02', endTime: '2022-06-02'},
                                {matchId: 3, status: 63, startTime: '2022-06-02', endTime: '2022-06-02'},
                                {matchId: 4, status: 99, startTime: '2022-06-02', endTime: '2022-06-02'},
                                {matchId: 5, status: 50, startTime: '2022-06-05', endTime: '2022-06-05'},
                                {matchId: 6, status: 99, startTime: '2022-06-01', endTime: '2022-06-01'}
                            ],
                            liveMatches: [
                                {matchId: 1, status: 30, startTime: '2022-06-02', endTime: '2022-06-02'},
                                {matchId: 2, status: 10, startTime: '2022-06-02', endTime: '2022-06-02'}
                            ]
                        }
                    })
                ).toEqual({
                    matches: [
                        {matchId: 1, status: 0, startTime: '2022-06-02', endTime: '2022-06-02'},
                        {matchId: 2, status: 60, startTime: '2022-06-02', endTime: '2022-06-02'},
                        {matchId: 3, status: 63, startTime: '2022-06-02', endTime: '2022-06-02'},
                        {matchId: 4, status: 99, startTime: '2022-06-02', endTime: '2022-06-02'},
                        {matchId: 5, status: 50, startTime: '2022-06-05', endTime: '2022-06-05'},
                        {matchId: 6, status: 99, startTime: '2022-06-01', endTime: '2022-06-01'}
                    ],
                    liveMatches: [],
                    postMatches: [
                        {matchId: 5, status: 50, startTime: '2022-06-05', endTime: '2022-06-05'}
                    ],
                    preMatches: [
                        {matchId: 1, status: 0, startTime: '2022-06-02', endTime: '2022-06-02'},
                        {matchId: 2, status: 60, startTime: '2022-06-02', endTime: '2022-06-02'},
                        {matchId: 3, status: 63, startTime: '2022-06-02', endTime: '2022-06-02'},
                        {matchId: 4, status: 99, startTime: '2022-06-02', endTime: '2022-06-02'},
                    ]
                });
            });

            it('should update state correctly when have live match', () => {
                localStorage.setItem('favourite-matches', '[1,2]');
                expect(
                    favouriteMatchSlice({
                        matches: [],
                        liveMatches: [],
                        postMatches: [],
                        preMatches: []
                    }, {
                        type: setMatches.type,
                        payload: {
                            matches: [
                                {matchId: 1, status: 0, startTime: '2022-06-02', endTime: '2022-06-02'},
                                {matchId: 2, status: 60, startTime: '2022-06-02', endTime: '2022-06-02'},
                                {matchId: 3, status: 63, startTime: '2022-06-02', endTime: '2022-06-02'},
                                {matchId: 4, status: 99, startTime: '2022-06-02', endTime: '2022-06-02'},
                                {matchId: 5, status: 50, startTime: '2022-06-05', endTime: '2022-06-05'}
                            ],
                            liveMatches: [
                                {matchId: 1, status: 30, startTime: '2022-06-02', endTime: '2022-06-02'},
                                {matchId: 2, status: 10, startTime: '2022-06-02', endTime: '2022-06-02'}
                            ]
                        }
                    })
                ).toEqual({
                    matches: [
                        {matchId: 1, status: 0, startTime: '2022-06-02', endTime: '2022-06-02'},
                        {matchId: 2, status: 60, startTime: '2022-06-02', endTime: '2022-06-02'},
                        {matchId: 3, status: 63, startTime: '2022-06-02', endTime: '2022-06-02'},
                        {matchId: 4, status: 99, startTime: '2022-06-02', endTime: '2022-06-02'},
                        {matchId: 5, status: 50, startTime: '2022-06-05', endTime: '2022-06-05'}
                    ],
                    liveMatches: [
                        {matchId: 1, status: 30, startTime: '2022-06-02', endTime: '2022-06-02'},
                        {matchId: 2, status: 10, startTime: '2022-06-02', endTime: '2022-06-02'}
                    ],
                    postMatches: [
                        {matchId: 5, status: 50, startTime: '2022-06-05', endTime: '2022-06-05'}
                    ],
                    preMatches: [
                        {matchId: 1, status: 0, startTime: '2022-06-02', endTime: '2022-06-02'},
                        {matchId: 2, status: 60, startTime: '2022-06-02', endTime: '2022-06-02'},
                        {matchId: 3, status: 63, startTime: '2022-06-02', endTime: '2022-06-02'},
                        {matchId: 4, status: 99, startTime: '2022-06-02', endTime: '2022-06-02'},
                    ]
                });
            });

            
        });

        describe('setLiveMatches', () => {
            it('should update state correctly', () => {
                expect(
                    favouriteMatchSlice({
                        matches: [
                            {matchId: 1, status: 0, startTime: '2022-06-02', endTime: '2022-06-02'},
                            {matchId: 2, status: 60, startTime: '2022-06-02', endTime: '2022-06-02'},
                            {matchId: 20, status: 63, startTime: '2022-06-02', endTime: '2022-06-02'},
                            {matchId: 4, status: 99, startTime: '2022-06-02', endTime: '2022-06-02'},
                            {matchId: 5, status: 50, startTime: '2022-06-05', endTime: '2022-06-05'}
                        ],
                        liveMatches: [{matchId: 1, status: 0, startTime: '2022-06-02', endTime: '2022-06-02'}],
                        postMatches: [
                            {matchId: 3, status: 63, startTime: '2022-06-02', endTime: '2022-06-02'},
                            {matchId: 4, status: 99, startTime: '2022-06-02', endTime: '2022-06-02'}
                        ],
                        preMatches: [{matchId: 5, status: 50, startTime: '2022-06-05', endTime: '2022-06-05'}]

                    }, {
                        type: setLiveMatches.type,
                        payload: [
                            {matchId: 1, status: 0, startTime: '2022-06-02', endTime: '2022-06-02'},
                            {matchId: 2, status: 60, startTime: '2022-06-02', endTime: '2022-06-02'},
                            {matchId: 3, status: 63, startTime: '2022-06-02', endTime: '2022-06-02'},
                            {matchId: 5, status: 50, startTime: '2022-06-05', endTime: '2022-06-05'}
                        ]
                    })
                ).toEqual({
                    matches: [
                        {matchId: 1, status: 0, startTime: '2022-06-02', endTime: '2022-06-02'},
                        {matchId: 2, status: 60, startTime: '2022-06-02', endTime: '2022-06-02'},
                        {matchId: 20, status: 63, startTime: '2022-06-02', endTime: '2022-06-02'},
                        {matchId: 4, status: 99, startTime: '2022-06-02', endTime: '2022-06-02'},
                        {matchId: 5, status: 50, startTime: '2022-06-05', endTime: '2022-06-05'}
                    ],
                    liveMatches: [{matchId: 1, status: 0, startTime: '2022-06-02', endTime: '2022-06-02'}],
                    postMatches: [
                        {matchId: 3, status: 63, startTime: '2022-06-02', endTime: '2022-06-02'},
                        {matchId: 4, status: 99, startTime: '2022-06-02', endTime: '2022-06-02'}
                    ],
                    preMatches: [{matchId: 5, status: 50, startTime: '2022-06-05', endTime: '2022-06-05'}]
                });
            });
        });

        describe('setFavouriteMatches', () => {
            it('should update state correctly when matches has fav match', () => {
                expect(
                    favouriteMatchSlice({
                        matches: [
                            {matchId: 1, isFavourite: false},
                            {matchId: 2, isFavourite: false},
                            {matchId: 3, isFavourite: false},
                            {matchId: 4, isFavourite: false},
                            {matchId: 5, isFavourite: false}
                        ],
                        liveMatches: [{matchId: 1, isFavourite: false}],
                        postMatches: [
                            {matchId: 1, isFavourite: false},
                            {matchId: 4, isFavourite: false}
                        ],
                        preMatches: [{matchId: 1, isFavourite: false}]

                    }, {
                        type: setFavouriteMatches.type,
                        payload: {
                            matchId: 1
                        }
                    })
                ).toEqual({
                    matches: [
                        {matchId: 1, isFavourite: true},
                        {matchId: 2, isFavourite: false},
                        {matchId: 3, isFavourite: false},
                        {matchId: 4, isFavourite: false},
                        {matchId: 5, isFavourite: false}
                    ],
                    liveMatches: [{matchId: 1, isFavourite: true}],
                    postMatches: [
                        {matchId: 1, isFavourite: true},
                        {matchId: 4, isFavourite: false}
                    ],
                    preMatches: [{matchId: 1, isFavourite: true}]
                });
            });

            it('should update state correctly when matches dont have any fav match', () => {
                expect(
                    favouriteMatchSlice({
                        matches: [
                            {matchId: 1, isFavourite: false},
                            {matchId: 2, isFavourite: false},
                            {matchId: 3, isFavourite: false},
                            {matchId: 4, isFavourite: false},
                            {matchId: 5, isFavourite: false}
                        ],
                        liveMatches: [{matchId: 1, isFavourite: false}],
                        postMatches: [
                            {matchId: 1, isFavourite: false},
                            {matchId: 4, isFavourite: false}
                        ],
                        preMatches: [{matchId: 1, isFavourite: false}]

                    }, {
                        type: setFavouriteMatches.type,
                        payload: {
                            matchId: 20
                        }
                    })
                ).toEqual({
                    matches: [
                        {matchId: 1, isFavourite: false},
                        {matchId: 2, isFavourite: false},
                        {matchId: 3, isFavourite: false},
                        {matchId: 4, isFavourite: false},
                        {matchId: 5, isFavourite: false}
                    ],
                    liveMatches: [{matchId: 1, isFavourite: false}],
                    postMatches: [
                        {matchId: 1, isFavourite: false},
                        {matchId: 4, isFavourite: false}
                    ],
                    preMatches: [{matchId: 1, isFavourite: false}]
                });
            });
        });

        describe('setLeagues', () => {
            it('should update state correctly', () => {
                expect(
                    favouriteMatchSlice({
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

        describe('setPosts', () => {
            it('should update state correctly', () => {
                expect(
                    favouriteMatchSlice({
                        posts: []
                    }, {
                        type: setPosts.type,
                        payload: [
                            {postId: 1},
                            {postId: 2}
                        ]
                    })
                ).toEqual({
                    posts: [
                        {postId: 1},
                        {postId: 2}
                    ]
                });
            })
        });

        describe('setFlagToggleIcon', () => {
            it('should update state correctly', () => {
                expect(
                    favouriteMatchSlice({
                        flagToggleIcon: false
                    }, {
                        type: setFlagToggleIcon.type,
                        payload: true
                    })
                ).toEqual({
                    flagToggleIcon: true
                });
            })
        });
    });
});