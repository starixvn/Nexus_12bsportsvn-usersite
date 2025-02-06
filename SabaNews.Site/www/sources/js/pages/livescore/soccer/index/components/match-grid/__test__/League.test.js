import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { League } from '../League';
import Site from '@jsroot/common/site';
import CommonFunctions from '@jsroot/common/common-functions';

describe('League', () => {
    const defaultProps = {
        league: {
            leagueId: 1,
            icon: '',
            matches: [
                { matchId: 1 },
                { matchId: 2 }
            ],
            countryVN:''
        },
        searchKey: '',
        selectedDate: '2022-05-25',
        setFavLeagues: jest.fn()
    };

    beforeAll(() => {
        Site.resolveClientUrl = jest.fn(url => url);
        CommonFunctions.getLeagueNameWithStage = jest.fn(() => 'World Cup');
        CommonFunctions.getLeagueName = jest.fn(() => 'World Cup');
        Site.toSlug = jest.fn(() => 'world-cup');
    });

    afterAll(() => {
        jest.clearAllMocks();
    });

    describe('constructor', () => {
        afterEach(() => {
            window.innerWidth = 0;
        });

        it('inital correctly state when innerWidth < 768', () => {
            // Arrange
            window.innerWidth = 600;

            // Act
            const instance = shallow(<League {...defaultProps} />).instance();

            // Assert
            expect(instance.state).toEqual({ isShowCountrySeparate: true });
        });

        it('inital correctly state when innerWidth = 1024', () => {
            // Arrange
            window.innerWidth = 1024;

            // Act
            const instance = shallow(<League {...defaultProps} />).instance();

            // Assert
            expect(instance.state).toEqual({ isShowCountrySeparate: true });
        });

        it('inital correctly state when innerWidth > 1024', () => {
            // Arrange
            window.innerWidth = 1025;

            // Act
            const instance = shallow(<League {...defaultProps} />).instance();

            // Assert
            expect(instance.state).toEqual({ isShowCountrySeparate: false });
        });
    });

    describe('componentDidMount', () => {
        it('calls correctly functions', () => {
            // Arrange
            window.addEventListener = jest.fn();

            const container = shallow(<League {...defaultProps} />);
            const instance = container.instance();
            instance.handleResize = jest.fn();

            // Act
            instance.componentDidMount();

            // Assert
            expect(window.addEventListener).toHaveBeenCalledWith('resize', instance.handleResize);
        });
    });

    describe('componentWillUnmount', () => {
        it('calls correctly functions', () => {
            // Arrange
            window.removeEventListener = jest.fn();

            const container = shallow(<League {...defaultProps} />);
            const instance = container.instance();

            // Act
            instance.componentWillUnmount();

            // Assert
            expect(window.removeEventListener).toHaveBeenCalledWith('resize', instance.handleResize);
        });
    });

    describe('handleResize', () => {
        it('updates correctly state when isMobile = false and window.innerWidth < 1024', () => {
            // Arrange
            window.innerWidth = 1023;
            const container = shallow(<League {...defaultProps} />);
            const instance = container.instance();
            instance.setState({ isShowCountrySeparate: false });

            // Act
            instance.handleResize();

            // Assert
            expect(instance.state.isShowCountrySeparate).toEqual(true);
        });

        it('updates correctly state when isMobile = false and window.innerWidth = 1024', () => {
            // Arrange
            window.innerWidth = 1024;
            const container = shallow(<League {...defaultProps} />);
            const instance = container.instance();
            instance.setState({ isShowCountrySeparate: false });

            // Act
            instance.handleResize();

            // Assert
            expect(instance.state.isShowCountrySeparate).toEqual(true);
        });

        it('do nothing when isMobile = true and window.innerWidth < 1024', () => {
            // Arrange
            window.innerWidth = 1023;
            const container = shallow(<League {...defaultProps} />);
            const instance = container.instance();
            instance.setState({ isShowCountrySeparate: true });
            instance.setState = jest.fn();

            // Act
            instance.handleResize();

            // Assert
            expect(instance.setState).toHaveBeenCalledTimes(0);
            expect(instance.state.isShowCountrySeparate).toEqual(true);
        });

        it('do nothing when isMobile = true and window.innerWidth = 1024', () => {
            // Arrange
            window.innerWidth = 1024;
            const container = shallow(<League {...defaultProps} />);
            const instance = container.instance();
            instance.setState({ isShowCountrySeparate: true });
            instance.setState = jest.fn();

            // Act
            instance.handleResize();

            // Assert
            expect(instance.setState).toHaveBeenCalledTimes(0);
            expect(instance.state.isShowCountrySeparate).toEqual(true);
        });

        it('updates correctly state when isMobile = true and window.innerWidth > 1024', () => {
            // Arrange
            window.innerWidth = 1025;
            const container = shallow(<League {...defaultProps} />);
            const instance = container.instance();
            instance.setState({ isShowCountrySeparate: true });

            // Act
            instance.handleResize();

            // Assert
            expect(instance.state.isShowCountrySeparate).toEqual(false);
        });
    });

    describe('onUpdateFavLeague call exacly function', () => {
        // Arrange
        const instance = shallow(<League {...defaultProps} />).instance();

        // Act
        instance.onUpdateFavLeague();

        // Assert
        expect(defaultProps.setFavLeagues).toHaveBeenCalled();
    });

    it('renders correctly when searchKey.length = 0', () => {
        // Act
        const container = shallow(<League {...defaultProps} />);

        // Assert
        expect(toJson(container)).toMatchSnapshot();
    });

    it('renders correctly when searchKey.length > 0', () => {
        // Arrange
        const props = { ...defaultProps, searchKey: 'world' };

        // Act
        const container = shallow(<League {...props} />);

        // Assert
        expect(toJson(container)).toMatchSnapshot();
    });

    it('renders correctly when country has value', () => {
        // Arrange
        const league = {
            leagueId: 1,
            icon: '',
            matches: [
                { matchId: 1 },
                { matchId: 2 }
            ],
            countryVN:'country',
            country: {
                countryLogo:'icon'
            }
        }
        const props = { ...defaultProps, searchKey: 'world', league: league };

        // Act
        const container = shallow(<League {...props} />);

        // Assert
        expect(toJson(container)).toMatchSnapshot();
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


        it('calls correctly functions when click into icon', () => {
            // Arrange
            window.open = jest.fn();
            const container = shallow(<League {...defaultProps} />);
            const event = {
                target: {className: 'icon-fav-league'},
                ctrlKey: false
            }
            // Act
            container.find('div.soccer-match-grid-item-header').simulate('click', event);

            // Assert
            expect(window.open).toHaveBeenCalledTimes(0);
        });

        it('calls correctly functions when ctrlKey = false', () => {
            // Arrange
            window.open = jest.fn();
            const container = shallow(<League {...defaultProps} />);
            const event = {
                target: {className: ''},
                ctrlKey: false
            }
            // Act
            container.find('div.soccer-match-grid-item-header').simulate('click', event);

            // Assert
            expect(window.open).toHaveBeenCalledTimes(0);
            expect(window.location).toEqual('lich-thi-dau/bong-da/world-cup/1/tong-hop');
        });

        it('calls correctly functions when season != null', () => {
            // Arrange
            window.open = jest.fn();
            const props = {
                ...defaultProps,
                league: {
                    ...defaultProps.league,
                    season: { seasonId: 1 }
                }
            };
            const event = {
                target: {className: ''},
                ctrlKey: false
            }
            const container = shallow(<League {...props} />);

            // Act
            container.find('div.soccer-match-grid-item-header').simulate('click', event);

            // Assert
            expect(window.open).toHaveBeenCalledTimes(0);
            expect(window.location).toEqual('lich-thi-dau/bong-da/world-cup/1/tong-hop');
        });

        it('calls correctly functions when ctrlKey = true', () => {
            // Arrange
            window.open = jest.fn();
            const event = {
                target: {className: ''},
                ctrlKey: true
            }
            const container = shallow(<League {...defaultProps} />);

            // Act
            container.find('div.soccer-match-grid-item-header').simulate('click', event);

            // Assert
            expect(window.open).toHaveBeenCalledWith('lich-thi-dau/bong-da/world-cup/1/tong-hop', '_blank');
        });
    });
});