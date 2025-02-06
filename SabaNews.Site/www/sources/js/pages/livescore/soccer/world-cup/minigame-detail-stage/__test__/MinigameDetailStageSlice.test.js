import minigameDetailStageSlice, {
    setMatches,
    setLeague,
    setVotes,
    setUpdateVote
} from '../minigameDetailStageSlice';


describe('minigameDetailStageSlice', () => {
    afterAll(() => {
        jest.clearAllMocks();
    });

    it('initial state correctly', () => {
        expect(minigameDetailStageSlice(undefined, {})).toEqual({
            matches: null,
            stages: null,
            league: null,
            votes: null,
            updateVoteResult: null,
            teams: null
        });
    });

    describe('reducers', () => {
        describe('setMatches', () => {
            it('updates state correctly', () => {
                expect(
                    minigameDetailStageSlice({
                        matches: [],
                        stages: [],
                        teams: []
                    }, {
                        type: setMatches.type,
                        payload: [
                            { matchId: 1, homeTeam:{teamId: 1},  awayTeam:{teamId: 2}, status: 0, stage: { stageId: 30537 }, endTime: '2022-05-20' },
                            { matchId: 2, homeTeam:{teamId: 2},  awayTeam:{teamId: 3}, status: 0, stage: { stageId: 30537 }, endTime: '2022-05-25' },
                            { matchId: 2, homeTeam:{teamId: 3},  awayTeam:{teamId: 4}, status: 0, stage: { stageId: 30540 }, endTime: '2022-05-25' },
                        ]
                    })
                ).toEqual({
                    matches:  [
                        { matchId: 1, homeTeam:{teamId: 1},  awayTeam:{teamId: 2}, status: 0, stage: { stageId: 30537 }, endTime: '2022-05-20' },
                        { matchId: 2, homeTeam:{teamId: 2},  awayTeam:{teamId: 3}, status: 0, stage: { stageId: 30537 }, endTime: '2022-05-25' },
                        { matchId: 2, homeTeam:{teamId: 3},  awayTeam:{teamId: 4}, status: 0, stage: { stageId: 30540 }, endTime: '2022-05-25' },
                    ],
                    stages: [{stageId: 30537}, {stageId: 30540}],
                    teams: [1, 2]
                });
            });
        });


        describe('setLeague', () => {
            it('updates state correctly', () => {
                expect(
                    minigameDetailStageSlice({
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
                    minigameDetailStageSlice({
                        votes: null
                    }, {
                        type: setVotes.type,
                        payload: [
                                { matchId: 1, userId: 1 },
                                { matchId: 1, userId: 2 }
                            ]
                    })
                ).toEqual({
                    votes: [
                        { matchId: 1, userId: 1 },
                        { matchId: 1, userId: 2 }
                    ]
                });
            });
        });

        describe('setUpdateVote', () => {
            it('updates state correctly', () => {
                expect(
                    minigameDetailStageSlice({
                        updateVoteResult: null
                    }, {
                        type: setUpdateVote.type,
                        payload: {
                            isSuccessful: true
                        }
                    })
                ).toEqual({
                    updateVoteResult:{
                        isSuccessful: true
                    }
                });
            });
        });
    });
});