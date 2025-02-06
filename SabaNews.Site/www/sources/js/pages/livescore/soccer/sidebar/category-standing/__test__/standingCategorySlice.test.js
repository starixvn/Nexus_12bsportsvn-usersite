import standingCategorySlice, {
    setStanding,
    setLeague
} from '../standingCategorySlice';


describe('standingCategorySlice', () => {
    afterAll(() => {
        jest.clearAllMocks();
    });

    it('initial state correctly', () => {
        expect(standingCategorySlice(undefined, {})).toEqual({
            standing: null,
            league: null
        });
    });

    describe('reducers', () => {
        describe('setLeague', () => {
            it('updates state correctly', () => {
                expect(
                    standingCategorySlice({
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

        describe('reducers', () => {
            describe('setStanding', () => {
                it('updates state correctly', () => {
                    expect(
                        standingCategorySlice({
                            standing: null
                        }, {
                            type: setStanding.type,
                            payload: [{ teamId: 1 }, {teamId: 2}],
                        })
                    ).toEqual({
                        standing:  [{ teamId: 1 }, {teamId: 2}]
                    });
                });
            });
        });
    });
});