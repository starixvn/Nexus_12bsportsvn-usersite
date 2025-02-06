import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import FavoriteLeagues from '../FavoriteLeagues';
import CommonFunctions from '@jsroot/common/common-functions';
import DateTimeService from '@jsroot/common/dateTimeService';

describe('FavoriteLeagues', () => {
    let defaultProps = {
        leagues: [],
        onToggleIcon:  false
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('render correctly', () => {
        // Arrange
        const props = {
            leagues: [
                {leagueId: 1, leagueNameVN: 'name', icon:'icon', currentSeasonId: 1},
                {leagueId: 2, leagueNameVN: 'name', icon:'icon'}
            ]
        }
         // Act
         const container = shallow(<FavoriteLeagues {...props} />);

         // Assert
         expect(toJson(container)).toMatchSnapshot();
    });

    describe('componentDidUpdate', () => {
        it('set correctly state function when leagues is change', () => {
            // Arrange
            const prevProps = {
                leagues: [{leagueId: 1}]
            }

            const container = shallow(<FavoriteLeagues {...defaultProps} />);
            const instance = container.instance();

            // Act
            instance.componentDidUpdate(prevProps);

            // Assert
            expect(instance.state.leagues).toEqual(defaultProps.leagues);
        });
    });

    describe('handleClick', () => {
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
            const props = {
                leagues: [
                    {leagueId: 1, leagueNameVN: 'name', icon:'icon', currentSeasonId: 1},
                    {leagueId: 2, leagueNameVN: 'name', icon:'icon'}
                ]
            }
            window.open = jest.fn();
            const container = shallow(<FavoriteLeagues {...props} />);

            // Act
            container.find('.leagues-item').last().simulate('click', event)

            // Assert
            expect(window.open).toHaveBeenCalledTimes(0);
        });

        it('redirect correctly when ctrlKey = false', () => {
            // Arrange
            const event = {
                target: { className: '' },
                ctrlKey: false
            };
            const props = {
                leagues: [
                    {leagueId: 1, leagueNameVN: 'name', icon:'icon', currentSeasonId: 1},
                    {leagueId: 2, leagueNameVN: 'name', icon:'icon'}
                ]
            }
            window.open = jest.fn();
            const container = shallow(<FavoriteLeagues {...props} />);
            CommonFunctions.getLeaguePageUrl = jest.fn().mockReturnValue('/lich-thi-dau/bong-da');

            // Act
            container.find('.leagues-item').first().simulate('click', event)

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
            const props = {
                leagues: [
                    {leagueId: 1, leagueNameVN: 'name', icon:'icon', currentSeasonId: 1},
                    {leagueId: 2, leagueNameVN: 'name', icon:'icon'}
                ]
            }
            window.open = jest.fn();
            const container = shallow(<FavoriteLeagues {...props} />);
            CommonFunctions.getLeaguePageUrl = jest.fn().mockReturnValue('/lich-thi-dau/bong-da');

            // Act
            container.find('.leagues-item').first().simulate('click', event)

            // Assert
            expect(window.open).toHaveBeenCalledWith('/lich-thi-dau/bong-da', '_blank');
        });
    });

    describe('sortLeagues', () => {
        it('return correctly data', () => {
            // Arrange
            const leagues = [{leagueId: 1, order: 2}, {leagueId: 2, order: 1}];

            const container = shallow(<FavoriteLeagues {...defaultProps} />);
            const instance = container.instance();

            // Act
            const result = instance.sortLeagues(leagues);

            // Assert
            expect(result).toEqual(leagues);
        });
    });

    describe('onUpdateFavLeague', () => {
        it('set correctly state', () => {
            // Arrange
            const leagues = [{leagueId: 1, order: 2}, {leagueId: 2, order: 1}];
            CommonFunctions.getFavLeagues = jest.fn().mockReturnValue(leagues);
            const container = shallow(<FavoriteLeagues {...defaultProps} />);
            const instance = container.instance();

            // Act
            instance.onUpdateFavLeague();

            // Assert
            expect(instance.state.leagues).toEqual(leagues);
        });

        it('set correctly state & call correctly functions', () => {
            // Arrange
            const leagues = [{leagueId: 1, order: 2}, {leagueId: 2, order: 1}];
            const props = {
                ...defaultProps,
                onToggleIcon: jest.fn()
            };
            CommonFunctions.getFavLeagues = jest.fn().mockReturnValue(leagues);
            const container = shallow(<FavoriteLeagues {...props} />);
            const instance = container.instance();

            // Act
            instance.onUpdateFavLeague();

            // Assert
            expect(instance.state.leagues).toEqual(leagues);
            expect(props.onToggleIcon).toHaveBeenCalled();
        });

    });

    describe('handleOpenSearchPopup set correctly state when call function', () => {
        // Arrange
        const container = shallow(<FavoriteLeagues {...defaultProps} />);
        const instance = container.instance();

        // Act
        instance.handleOpenSearchPopup();

        // Assert
        expect(instance.state.isShowSearchPopup).toEqual(true);
    });

    describe('handleCloseSearchPopup set correctly state when call function', () => {
        // Arrange
        const container = shallow(<FavoriteLeagues {...defaultProps} />);
        const instance = container.instance();

        // Act
        instance.handleCloseSearchPopup();

        // Assert
        expect(instance.state.isShowSearchPopup).toEqual(false);
    });

    describe('renderTooltip render correctly', () => {
        // Arrange
        const container = shallow(<FavoriteLeagues {...defaultProps} />);
        const instance = container.instance();

        // Act
        const result = instance.renderTooltip();

        // Assert
        expect(result).toMatchSnapshot(false);
    });

    describe('handleNavigateToMyLeaguePage', () => {
        it('redirect correctly when ctrlKey = false', () => {
            // Arrange
            const event = {
                target: { className: '' },
                ctrlKey: false
            };

            window.open = jest.fn();
            const container = shallow(<FavoriteLeagues {...defaultProps} />);

            // Act
            container.find('.leagues-group').first().simulate('click', event)

            // Assert
            expect(window.open).toHaveBeenCalledTimes(0);
            expect(window.location).toEqual('/lich-thi-dau/bong-da/giai-dau-quan-tam');
        });

        it('calls correctly when ctrlKey = true', () => {
           // Arrange
           const event = {
                target: { className: '' },
                ctrlKey: true
            };
            window.open = jest.fn();
            const container = shallow(<FavoriteLeagues {...defaultProps} />);

            // Act
            container.find('.leagues-group').first().simulate('click', event)

            // Assert
            expect(window.open).toHaveBeenCalledWith('/lich-thi-dau/bong-da/giai-dau-quan-tam', '_blank');
        });
    });
});