import matchDetailShortcutSlice, {
    setIncident,
    setMatch
} from '../matchDetailShortcutSlice';


describe('matchDetailShortcutSlice', () => {
    afterAll(() => {
        jest.clearAllMocks();
    });

    it('initial state correctly', () => {
        expect(matchDetailShortcutSlice(undefined, {})).toEqual({
            match: null,
            incidents: null
        });
    });

    describe('reducers', () => {
        describe('setIncident', () => {
            it('updates state correctly', () => {
                expect(
                    matchDetailShortcutSlice({
                        incidents: null
                    }, {
                        type: setIncident.type,
                        payload: [{ matchId: 1, position: 1  },{ matchId: 1, position: 2  }],
                    })
                ).toEqual({
                    incidents:  [{ matchId: 1, position: 1  },{ matchId: 1, position: 2  }]
                });
            });
        });

        describe('setMatch', () => {
            it('updates state correctly', () => {
                expect(
                    matchDetailShortcutSlice({
                        match: null
                    }, {
                        type: setMatch.type,
                        payload: { matchId: 1 },
                    })
                ).toEqual({
                    match:  { matchId: 1 }
                });
            });
        });
    });
});