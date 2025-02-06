import teamDetailSlice, { setMatches } from "../teamDetailSlice";
import DateTimeService from '@jsroot/common/dateTimeService';

describe('teamDetailSlice', () => {
    beforeAll(() => {
        DateTimeService.getCurrentClientDateTime = jest.fn(() => '2022-05-25')
    });

    afterAll(() => {
        jest.clearAllMocks();
    });
    it('initial state correctly', () => {
        expect(teamDetailSlice(undefined, {})).toEqual({
            stages: [],
            players: null,
            team: null,
            profile: null,
            preMatches: null,
            postMatches: null
        });
    });

    describe('reducers', () => {
        describe('setMatches', () => {
            it('updates state correctly', () => {
                expect(
                    teamDetailSlice({
                        stages: null,
                        preMatches: null,
                        postMatches: null
                    }, {
                        type: setMatches.type,
                        payload: [
                            {
                                matchId: 1,
                                status: 0,
                                stage: { stageId: 3 },
                                homeTeam: { teamId: 1, teamNameEN: 'Arsenal' },
                                awayTeam: { teamId: 2, teamNameEN: 'Everton' },
                                startTime: '2022-05-26'
                            },
                            {
                                matchId: 2,
                                status: 50,
                                stage: { stageId: 4 },
                                homeTeam: { teamId: 3, teamNameEN: 'Arsenal' },
                                awayTeam: { teamId: 4, teamNameEN: 'Everton' },
                                startTime: '2022-05-25'
                            }
                        ]
                    })
                ).toEqual({
                    stages:  [{ stageId: 3 }, { stageId: 4 }],
                    preMatches: [{
                        matchId: 1,
                        status: 0,
                        stage: { stageId: 3 },
                        homeTeam: { teamId: 1, teamNameEN: 'Arsenal' },
                        awayTeam: { teamId: 2, teamNameEN: 'Everton' },
                        startTime: '2022-05-26'
                    }],
                    postMatches: [ {
                        matchId: 2,
                        status: 50,
                        stage: { stageId: 4 },
                        homeTeam: { teamId: 3, teamNameEN: 'Arsenal' },
                        awayTeam: { teamId: 4, teamNameEN: 'Everton' },
                        startTime: '2022-05-25'
                    }],
                });
            });
        });
    });
});
