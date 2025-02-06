import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import DragItem  from '../DragItem';
import CommonFunctions from '@jsroot/common/common-functions';
import GridItem from '../../../league-detail/components/match-grid/GridItem';

describe('DragItem', () => {
    const defaultProps = {
        leagues: [],
        onUpdateFavLeague: jest.fn(),
        onDrag: jest.fn
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('componentDidUpdate', () => {
        it('setState correctly with default props', () => {
            // Arrange
            const prevProps = {
                leagues: [{leagueId: 1, leagueNameEN: 'name'}]
            };
            const container = shallow(<DragItem {...defaultProps} />);
            const instance = container.instance();

            // Act
            instance.componentDidUpdate(prevProps);

            // Assert
            expect(instance.state.leagues).toEqual([]);
        });

        it('setState correctly when props change', () => {
            // Arrange
            const prevProps = {
                leagues: [{leagueId: 1, leagueNameEN: 'name'}]
            };
            const props = {
                leagues: [{leagueId: 2, leagueNameEN: 'name'}]
            };
            const container = shallow(<DragItem {...props} />);
            const instance = container.instance();

            // Act
            instance.componentDidUpdate(prevProps);

            // Assert
            expect(instance.state.leagues).toEqual(props.leagues);
        });

        it('setState correctly when props not change', () => {
            // Arrange
            const prevProps = {
                leagues: []
            };
            const props = {
                leagues: []
            };
            const container = shallow(<DragItem {...props} />);
            const instance = container.instance();

            // Act
            instance.componentDidUpdate(prevProps);

            // Assert
            expect(instance.state.leagues).toEqual(prevProps.leagues);
        });
    });

    describe('onUpdateFavLeague call correctly funtion', () => {
        // Arrange
        const leagues = [{leagueId: 1, leagueNameEN: 'name'}]
        const container = shallow(<DragItem {...defaultProps} />);
        const instance = container.instance();

        // Act
        instance.onUpdateFavLeague(leagues);

        // Assert
        expect(defaultProps.onUpdateFavLeague).toHaveBeenCalled();
    });

    describe('onDrag', () => {
        it('do nothing when drag source is null', () => {
            // Arrange
            const dragData = {
                source: null,
                destination: {}
            }
            const container = shallow(<DragItem {...defaultProps} />);
            const instance = container.instance();

            // Act
            instance.onDrag(dragData);

            // Assert
            expect(defaultProps.onDrag()).toHaveBeenCalledTimes(0);
        });

        it('do nothing when drag destination is null', () => {
            // Arrange
            const dragData = {
                source: {},
                destination: null
            }
            const container = shallow(<DragItem {...defaultProps} />);
            const instance = container.instance();

            // Act
            instance.onDrag(dragData);

            // Assert
            expect(defaultProps.onDrag()).toHaveBeenCalledTimes(0);
        });

        it('do nothing when drag to source index', () => {
            // Arrange
            const leagues = [{leagueId: 1, leagueNameEN: 'name'}];
            const dragData = {
                source: {index: 1},
                destination: {index: 1}
            }
            const container = shallow(<DragItem {...defaultProps} />);
            const instance = container.instance();

            // Act
            instance.onDrag(dragData);

            // Assert
            expect(defaultProps.onDrag()).toHaveBeenCalledTimes(0);
        });

        it('call exacly function when drag end', () => {
            // Arrange
            const leagues = [{leagueId: 1, leagueNameEN: 'name'}, {leagueId: 2, leagueNameEN: 'name'}];
            const dragData = {
                source: {index: 0},
                destination: {index: 1}
            }
            CommonFunctions.getFavLeagues = jest.fn().mockReturnValue(leagues);
            const container = shallow(<DragItem {...defaultProps} />);
            const instance = container.instance();
            instance.state.leagues = leagues;
            instance.orderNewLeagues = jest.fn().mockReturnValue(leagues);
            // Act
            instance.onDrag(dragData);

            // Assert
            expect(instance.state.toggleIcon).toEqual(true);
        });
    });

    describe('orderNewLeagues', () => {
        it('return correctly when call function', () => {
            // Arrange
            const leagues = [{leagueId: 1, leagueNameEN: 'name'}, {leagueId: 2, leagueNameEN: 'name'}];
            const dragData = {
                source: {index: 0},
                destination: {index: 1}
            }
            const expectedLeagues = [{leagueId: 2, leagueNameEN: 'name', order: 2}, {leagueId: 1, leagueNameEN: 'name', order:1}];
            const container = shallow(<DragItem {...defaultProps} />);
            const instance = container.instance();

            // Act
            const result =  instance.orderNewLeagues(dragData.source.index, dragData.destination.index, leagues);

            // Assert
            expect(result).toEqual(expectedLeagues);
        });
    });

    describe('handleClickLeague', () => {
        const { location } = window;

        beforeAll(() => {
            delete window.location;
            window.location = { href: '' };
        });

        afterAll(() => {
            window.location = location;
        });

        it('redirect correctly when click into icon', () => {
            // Arrange
            const event = {
                target: { className: 'icon-livescore' },
                ctrlKey: false
            };
            window.open = jest.fn();
            const container = shallow(<DragItem {...defaultProps} />);
            const instance = container.instance();
            // Act
            instance.handleClickLeague(event);

            // Assert
            expect(window.open).toHaveBeenCalledTimes(0);
        });

        it('redirect correctly when ctrlKey = false', () => {
            // Arrange
            const event = {
                target: { className: '' },
                ctrlKey: false
            };

            window.open = jest.fn();
            const container = shallow(<DragItem {...defaultProps} />);
            const instance = container.instance();
            CommonFunctions.getLeaguePageUrl = jest.fn().mockReturnValue('/lich-thi-dau/bong-da');
            // Act
            instance.handleClickLeague(event);

            // Assert
            expect(window.open).toHaveBeenCalledTimes(0);
            expect(window.location).toEqual('/lich-thi-dau/bong-da');
        });

        it('calls correctly when ctrlKey = true', () => {
           // Arrange
           const event = {
                target: { className: '' },
                ctrlKey: true
            };
            window.open = jest.fn();
            const container = shallow(<DragItem {...defaultProps} />);
            const instance = container.instance();
            CommonFunctions.getLeaguePageUrl = jest.fn().mockReturnValue('/lich-thi-dau/bong-da');

            // Act
            instance.handleClickLeague(event);

            // Assert
            expect(window.open).toHaveBeenCalledWith('/lich-thi-dau/bong-da', '_blank');
        });
    });

    describe('renders', () => {
        it('render correctly when leagues is empty', () => {
            // Arrange
            const container = shallow(<DragItem {...defaultProps} />);


            // Assert
            expect(container).toMatchSnapshot();
        });

        it('render correctly when leagues have data', () => {
            // Arrange
            const  props = {
                ...defaultProps,
                leagues:[{leagueId: 1, leagueNameEN:'name', priority: 1}, {leagueId: 2, leagueNameEN:'name', priority: 0}]

            }
            const event = {
                target: { className: '' },
                ctrlKey: true
            };
            const container = shallow(<DragItem {...props} />);


            // Assert
            // container.find('.my-league-item').first().simulate('click', event);
            expect(container).toMatchSnapshot();
        });
    });
});