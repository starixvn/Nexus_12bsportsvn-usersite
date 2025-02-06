import fixtureCategorySlice, {
    setLeague,
    setMatches,
    setLiveMatches
} from '../fixtureCategorySlice';


describe('fixtureCategorySlice', () => {
    afterAll(() => {
        jest.clearAllMocks();
    });

    it('initial state correctly', () => {
        expect(fixtureCategorySlice(undefined, {})).toEqual({
            matches: null,
            league: null
        });
    });

    describe('reducers', () => {
        describe('setLeague', () => {
            it('updates state correctly', () => {
                expect(
                    fixtureCategorySlice({
                        league: null
                    }, {
                        type: setLeague.type,
                        payload: { leagueId: 1 },
                    })
                ).toEqual({
                    league:  { leagueId: 1 }
                });
            });
        });

        describe('setMatches', () => {
            it('updates state correctly', () => {
                expect(
                    fixtureCategorySlice({
                        matches: []
                    }, {
                        type: setMatches.type,
                        payload: [{ matchId: 1 }, {matchId: 2}],
                    })
                ).toEqual({
                    matches:  [{ matchId: 1 }, {matchId: 2}]
                });
            });
        });


        describe('setLiveMatches', () => {
            it('updates state correctly', () => {
                expect(
                    fixtureCategorySlice({
                        matches: [{matchId: 1}, {matchId: 2} ],
                        liveMatches: null
                    }, {
                        type: setLiveMatches.type,
                        payload: [
                            { matchId: 1, status: 0 },
                            { matchId: 3, status: 50 }
                        ]
                    })
                ).toEqual({
                    matches: [{ matchId: 1, status: 0 }, {matchId: 2}],
                    liveMatches: null
                });
            });
        });

    });
});