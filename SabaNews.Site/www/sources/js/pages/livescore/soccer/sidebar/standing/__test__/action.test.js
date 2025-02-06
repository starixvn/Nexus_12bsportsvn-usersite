import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Site from '@jsroot/common/site';
import DataService from '@jsroot/common/dataService';
import { ActionCreators } from '../actions';
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('actionCreators', () => {
    beforeAll(() => {
        Site.resolveClientUrl = jest.fn(url => url);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getStandings', () => {
        it('should call setStandings when function have been done', async () => {
            // Arrange
            const response = {
                data: [
                    {leagueId: 1}, [{stageId: 1}, {stageId: 2}],
                    {leagueId: 2}, [{stageId: 3}, {stageId: 4}]
                ]
            };
            const promise = Promise.resolve(response);
            DataService.postDataAsync = jest.fn(() => promise);
            const expectedActions = [
                { type: ActionCreators.setStandings.type, payload: response.data },
            ];
            const store = mockStore({
                standings: null
            });

            // Act
            await store.dispatch(ActionCreators.getStandings());

            // Assert
            expect(DataService.postDataAsync).toHaveBeenCalledWith('api/GetHomeStanding');
            expect(store.getActions()).toEqual(expectedActions);
        });
    });
});