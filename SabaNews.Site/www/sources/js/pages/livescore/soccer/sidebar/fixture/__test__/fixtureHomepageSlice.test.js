import fixtureHomepageSlice, {
    setLeagues,
    setLiveMatches
} from '../fixtureHomepageSlice';


describe('fixtureHomepageSlice', () => {
    afterAll(() => {
        jest.clearAllMocks();
    });

    it('initial state correctly', () => {
        expect(fixtureHomepageSlice(undefined, {})).toEqual({
            leagues: null,
            liveMatches: null,
            league: null
        });
    });

    describe('reducers', () => {
        describe('setLeagues', () => {
            it('updates state correctly', () => {
                expect(
                    fixtureHomepageSlice({
                        leagues: []
                    }, {
                        type: setLeagues.type,
                        payload: [
                            { leagueId: 1 },
                            { leagueId: 2 },
                            { leagueId: 3 }
                        ]
                    })
                ).toEqual({
                    leagues:  [
                        { leagueId: 1 },
                        { leagueId: 2 },
                        { leagueId: 3 }
                    ]
                });
            });
        });

        describe('setLiveMatches', () => {
            it('updates state correctly', () => {
                expect(
                    fixtureHomepageSlice({
                        leagues: [{ matches:[ {matchId: 1}, {matchId: 2}] }],
                        liveMatches: null
                    }, {
                        type: setLiveMatches.type,
                        payload: [
                            { matchId: 1, status: 0 },
                            { matchId: 3, status: 50 }
                        ]
                    })
                ).toEqual({
                    leagues: [{ matches:[ { matchId: 1, status: 0 }, {matchId: 2}] }],
                    liveMatches: null
                });
            });
        });

    });
});