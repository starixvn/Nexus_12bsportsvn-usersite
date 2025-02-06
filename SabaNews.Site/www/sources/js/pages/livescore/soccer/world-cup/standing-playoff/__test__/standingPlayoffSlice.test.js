import standingPlayoffSlice, {
    setMatches,
    setLeague,
    setLiveMatches,
    setSelectedStageId
} from '../standingPlayoffSlice';


describe('standingPlayoffSlice', () => {
    afterAll(() => {
        jest.clearAllMocks();
    });

    it('initial state correctly', () => {
        expect(standingPlayoffSlice(undefined, {})).toEqual({
            matches: null,
            stages: [],
            league: null
        });
    });

    describe('reducers', () => {
        describe('setMatches', () => {
            it('updates state correctly', () => {
                expect(
                    standingPlayoffSlice({
                        matches: [],
                        stages: []
                    }, {
                        type: setMatches.type,
                        payload: [
                            { matchId: 1, status: 0, stage: { stageId: 1 }, endTime: '2022-05-20' },
                            { matchId: 2, status: 0, stage: { stageId: 2 }, endTime: '2022-05-25' },
                            { matchId: 2, status: 0, endTime: '2022-05-25' },
                        ]
                    })
                ).toEqual({
                    matches:  [
                        { matchId: 1, status: 0, stage: { stageId: 1 }, endTime: '2022-05-20' },
                        { matchId: 2, status: 0, stage: { stageId: 2 }, endTime: '2022-05-25' },
                        { matchId: 2, status: 0, endTime: '2022-05-25' },
                    ],
                    stages: [{stageId: 1}, {stageId: 2}]
                });
            });
        });

        describe('setLeague', () => {
            it('updates state correctly', () => {
                expect(
                    standingPlayoffSlice({
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