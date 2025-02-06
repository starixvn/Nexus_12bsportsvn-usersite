import minigameWinnersSlice, {
    setMatches,
    setLeague,
    setVotes
} from '../minigameWinnersSlice';


describe('minigameWinnersSlice', () => {
    afterAll(() => {
        jest.clearAllMocks();
    });

    it('initial state correctly', () => {
        expect(minigameWinnersSlice(undefined, {})).toEqual({
            votes: [],
            matches: null,
            league: null,
            stages: null,
            teams: null
        });
    });

    describe('reducers', () => {
        describe('setMatches', () => {
            it('updates state correctly', () => {
                expect(
                    minigameWinnersSlice({
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
                    minigameWinnersSlice({
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

        describe('setVotes', () => {
            it('updates state correctly', () => {
                expect(
                    minigameWinnersSlice({
                        votes: []
                    }, {
                        type: setVotes.type,
                        payload: {
                            data:[{ matchId: 1, userId: 1 },{ matchId: 1, userId: 2 }],
                            stage: 1
                        }
                    })
                ).toEqual({
                    votes: [
                        [{ matchId: 1, userId: 1 },{ matchId: 1, userId: 2 }]
                    ]
                });
            });
        });
    });
});