import fixtureSlice, {
    setMatches,
    setLeague,
    setLiveMatches
} from '../fixtureSlice';


describe('fixtureSlice', () => {
    afterAll(() => {
        jest.clearAllMocks();
    });

    it('initial state correctly', () => {
        expect(fixtureSlice(undefined, {})).toEqual({
            matches: null,
            liveMatches: null,
            league: null
        });
    });

    describe('reducers', () => {
        describe('setMatches', () => {
            it('updates state correctly', () => {
                expect(
                    fixtureSlice({
                        matches: []
                    }, {
                        type: setMatches.type,
                        payload: [
                            { matchId: 1, status: 0, stage: { stageId: 1 }, endTime: '2022-05-20' },
                            { matchId: 2, status: 0, stage: { stageId: 2 }, endTime: '2022-05-25' },
                            { matchId: 3, status: 50, endTime: '2022-05-24' }
                        ]
                    })
                ).toEqual({
                    matches:  [
                        { matchId: 1, status: 0, stage: { stageId: 1 }, endTime: '2022-05-20' },
                        { matchId: 2, status: 0, stage: { stageId: 2 }, endTime: '2022-05-25' },
                        { matchId: 3, status: 50, endTime: '2022-05-24' }
                    ]
                });
            });
        });

        describe('setLiveMatches', () => {
            it('updates state correctly', () => {
                expect(
                    fixtureSlice({
                        matches: [{ matchId: 1 }, { matchId: 2 }],
                        liveMatches: null
                    }, {
                        type: setLiveMatches.type,
                        payload: [
                            { matchId: 1, status: 0 },
                            { matchId: 3, status: 50 }
                        ]
                    })
                ).toEqual({
                    matches: [{ matchId: 1, status: 0 }, { matchId: 2 }],
                    liveMatches: null
                });
            });
        });

        describe('setLeague', () => {
            it('updates state correctly', () => {
                expect(
                    fixtureSlice({
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
                    league: {
                        leagueId: 1,
                        leagueNameEN: 'Champions League',
                        leagueNameVN: 'Champions League'
                    }
                });
            });
        });
    });
});