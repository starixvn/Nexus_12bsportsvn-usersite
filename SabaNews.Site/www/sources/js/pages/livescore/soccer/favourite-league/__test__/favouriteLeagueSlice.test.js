import favouriteLeagueSlice, {
    setFavLeagues,
    setLeagues,
    setPosts
} from '../favouriteLeagueSlice';

describe('favouriteLeagueSlice', () => {
    afterAll(() => {
        jest.clearAllMocks();
    });

    describe('reducers', () => {
        describe('setFavLeagues', () => {
            it('should update state correctly', () => {
                expect(
                    favouriteLeagueSlice({
                        favLeagues: []
                    }, {
                        type: setFavLeagues.type,
                        payload: [
                            {leagueId: 1},
                            {leagueId: 2}
                        ]
                    })
                ).toEqual({
                    favLeagues: [
                        {leagueId: 1},
                        {leagueId: 2}
                    ]
                });
            })
        });

        describe('setLeagues', () => {
            it('should update state correctly', () => {
                expect(
                    favouriteLeagueSlice({
                        leagues: []
                    }, {
                        type: setLeagues.type,
                        payload: [
                            {leagueId: 1},
                            {leagueId: 2}
                        ]
                    })
                ).toEqual({
                    leagues: [
                        {leagueId: 1},
                        {leagueId: 2}
                    ]
                });
            })
        });

        describe('setPosts', () => {
            it('should update state correctly', () => {
                expect(
                    favouriteLeagueSlice({
                        posts: []
                    }, {
                        type: setPosts.type,
                        payload: [
                            {postId: 1},
                            {postId: 2}
                        ]
                    })
                ).toEqual({
                    posts: [
                        {postId: 1},
                        {postId: 2}
                    ]
                });
            })
        });
    });
});