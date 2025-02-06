import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import Item  from '../Item';
import CommonFunctions from '@jsroot/common/common-functions';

describe('Item', () => {
    const defaultProps = {
        searchKey: '',
        leagues: [],
        onUpdateFavLeague: jest.fn(),
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
            const container = shallow(<Item {...defaultProps} />);
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
            const container = shallow(<Item {...props} />);
            const instance = container.instance();

            // Act
            instance.componentDidUpdate(prevProps);

            // Assert
            expect(instance.state.leagues).toEqual(props.leagues);
        });

        it('setState correctly when props not change', () => {
            // Arrange
            const props = {
                leagues: []
            };
            const container = shallow(<Item {...props} />);
            const instance = container.instance();

            // Act
            instance.componentDidUpdate(props);

            // Assert
            expect(instance.state.leagues).toEqual(props.leagues);
        });
    });

    describe('onUpdateFavLeague call correctly funtion', () => {
        // Arrange
        const props = {
            ...defaultProps,
            leagues: [{leagueId: 1, leagueNameEN: 'name'}]
        };
        const container = shallow(<Item {...props} />);

        // Act
        container.find('FavouriteLeagueIcon').first().simulate('updateFavLeague');

        // Assert
        expect(props.onUpdateFavLeague).toHaveBeenCalled();
    })

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
            const container = shallow(<Item {...defaultProps} />);
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
            const container = shallow(<Item {...defaultProps} />);
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
            const container = shallow(<Item {...defaultProps} />);
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
            const container = shallow(<Item {...defaultProps} />);


            // Assert
            expect(container).toMatchSnapshot();
        });

        it('render correctly when leagues have data & call exacly action', () => {
            // Arrange
            const  props = {
                ...defaultProps,
                leagues:[{leagueId: 1, leagueNameEN:'name', priority: 1}, {leagueId: 2, leagueNameEN:'name', priority: 0}]

            }
            const event = {
                target: { className: '' },
                ctrlKey: true
            };
            const container = shallow(<Item {...props} />);


            // Assert
            container.find('.my-league-item').first().simulate('click', event);
            expect(container).toMatchSnapshot();
        })
    });
});