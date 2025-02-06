jest.mock('react-redux');
jest.mock('redux');
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../../actions';

describe('connect ', () => {
    let mapStateToProps, mapDispatchToProps;
    const connectMock = jest.fn();

    beforeAll(() => {
        connect.mockImplementation((mapStateToPropsFunc, mapDispatchToPropsFunc) => {
            mapStateToProps = mapStateToPropsFunc;
            mapDispatchToProps = mapDispatchToPropsFunc;
            return connectMock;
        });
        require('../AppContainer').default;
    });

    afterAll(() => {
        jest.clearAllMocks();
    });

    it('props should be mapped correctly', () => {
        // Arrange
        const expected = {
            minDate: '2020-01-01',
            maxDate: '2023-12-31',
            selectedDate: '2022-05-25',
            dateRanges: [],
            searchKey: '',
            favLeagues: [],
            matches: [],
            totalLiveMatches: 0,
            flagToggleFavLeagueIcon: true,
            leagues: []
        };
        const state = {
            anotherState: 123,
            minDate: '2020-01-01',
            maxDate: '2023-12-31',
            selectedDate: '2022-05-25',
            dateRanges: [],
            searchKey: '',
            favLeagues: [],
            matches: [],
            totalLiveMatches: 0,
            flagToggleFavLeagueIcon: true,
            leagues: []
        };

        // Act
        const actual = mapStateToProps(state);

        // Assert
        expect(actual).toEqual(expected);
    });

    it('bindActionCreators should be called with correct parameter', () => {
        // Arrange
        const mockBindAction = jest.fn();
        bindActionCreators.mockImplementationOnce(mockBindAction);
        const dispatch = {};

        // Act
        mapDispatchToProps(dispatch);

        // Assert
        expect(mockBindAction).toHaveBeenCalledWith(ActionCreators, dispatch);
    });
});