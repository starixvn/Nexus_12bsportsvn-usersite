import fullFixtureSlice, {
    setMatches,
    setLeague,
    setLiveMatches,
    setSelectedStageId
} from '../fullFixtureSlice';


describe('fullFixtureSlice', () => {
    afterAll(() => {
        jest.clearAllMocks();
    });

    it('initial state correctly', () => {
        expect(fullFixtureSlice(undefined, {})).toEqual({
            matches: null,
            liveMatches: null,
            league: null,
            selectedStageId: 0
        });
    });

    describe('reducers', () => {
        describe('setMatches', () => {
            it('updates state correctly', () => {
                expect(
                    fullFixtureSlice({
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
                    fullFixtureSlice({
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
                    fullFixtureSlice({
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
        describe('setSelectedStageId', () => {
            it('updates state correctly', () => {
                expect(
                    fullFixtureSlice({
                        selectedStageId: 0
                    }, {
                        type: setSelectedStageId.type,
                        payload: 10
                    })
                ).toEqual({
                    selectedStageId: 10
                });
            });
        });
    });
});