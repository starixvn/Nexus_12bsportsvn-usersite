import standingHomepageSlice, {
    setStandings
} from '../standingHomepageSlice';


describe('standingHomepageSlice', () => {
    afterAll(() => {
        jest.clearAllMocks();
    });

    it('initial state correctly', () => {
        expect(standingHomepageSlice(undefined, {})).toEqual({
            standings: null,
        });
    });

    describe('reducers', () => {
        describe('setStandings', () => {
            it('updates state correctly', () => {
                expect(
                    standingHomepageSlice({
                        standings: null
                    }, {
                        type: setStandings.type,
                        payload: [
                            {leagueId: 1}, [{stageId: 1}, {stageId: 2}],
                            {leagueId: 2}, [{stageId: 3}, {stageId: 4}]
                        ]
                    })
                ).toEqual({
                    standings:  [
                        {leagueId: 1}, [{stageId: 1}, {stageId: 2}],
                        {leagueId: 2}, [{stageId: 3}, {stageId: 4}]
                    ]
                });
            });
        });
    });
});