import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import League from '../League';
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
        flagToggleIcon: false,
        onUpdateFavLeague: jest.fn()
    };

    afterAll(() => {
        jest.clearAllMocks();
    });

    describe('constructor', () => {
        afterEach(() => {
            window.innerWidth = 0;
        });

        it('inital correctly state when innerWidth < 1024', () => {
            // Arrange
            window.innerWidth = 600;

            // Act
            const instance = shallow(<League {...defaultProps} />).instance();

            // Assert
            expect(instance.state).toEqual({ isMobile: true });
        });

        it('inital correctly state when innerWidth = 1024', () => {
            // Arrange
            window.innerWidth = 1024;

            // Act
            const instance = shallow(<League {...defaultProps} />).instance();

            // Assert
            expect(instance.state).toEqual({ isMobile: true });
        });

        it('inital correctly state when innerWidth > 1024', () => {
            // Arrange
            window.innerWidth = 1025;

            // Act
            const instance = shallow(<League {...defaultProps} />).instance();

            // Assert
            expect(instance.state).toEqual({ isMobile: false });
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
            instance.setState({ isMobile: false });

            // Act
            instance.handleResize();

            // Assert
            expect(instance.state).toEqual({ isMobile: true });
        });

        it('updates correctly state when isMobile = false and window.innerWidth = 1024', () => {
            // Arrange
            window.innerWidth = 1024;
            const container = shallow(<League {...defaultProps} />);
            const instance = container.instance();
            instance.setState({ isMobile: false });

            // Act
            instance.handleResize();

            // Assert
            expect(instance.state).toEqual({ isMobile: true });
        });

        it('do nothing when isMobile = true and window.innerWidth < 1024', () => {
            // Arrange
            window.innerWidth = 1023;
            const container = shallow(<League {...defaultProps} />);
            const instance = container.instance();
            instance.setState({ isMobile: true });
            instance.setState = jest.fn();

            // Act
            instance.handleResize();

            // Assert
            expect(instance.setState).toHaveBeenCalledTimes(0);
            expect(instance.state).toEqual({ isMobile: true });
        });

        it('do nothing when isMobile = true and window.innerWidth = 1024', () => {
            // Arrange
            window.innerWidth = 1024;
            const container = shallow(<League {...defaultProps} />);
            const instance = container.instance();
            instance.setState({ isMobile: true });
            instance.setState = jest.fn();

            // Act
            instance.handleResize();

            // Assert
            expect(instance.setState).toHaveBeenCalledTimes(0);
            expect(instance.state).toEqual({ isMobile: true });
        });

        it('updates correctly state when isMobile = true and window.innerWidth > 1025', () => {
            // Arrange
            window.innerWidth = 1025;
            const container = shallow(<League {...defaultProps} />);
            const instance = container.instance();
            instance.setState({ isMobile: true });

            // Act
            instance.handleResize();

            // Assert
            expect(instance.state).toEqual({ isMobile: false });
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
            const container = shallow(<League {...defaultProps} />);
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
            const container = shallow(<League {...defaultProps} />);
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
            const container = shallow(<League {...defaultProps} />);
            const instance = container.instance();
            CommonFunctions.getLeaguePageUrl = jest.fn().mockReturnValue('/lich-thi-dau/bong-da');

            // Act
            instance.handleClickLeague(event);

            // Assert
            expect(window.open).toHaveBeenCalledWith('/lich-thi-dau/bong-da', '_blank');
        });
    });

    describe('renders', () => {
        it('render correctly with default props', () => {
           // Act
            const container = shallow(<League {...defaultProps} />);

            // Assert
            expect(toJson(container)).toMatchSnapshot();
        });

        it('renders correctly when country has value', () => {
            // Arrange
            const event = {
                target: { className: 'icon-livescore' },
                ctrlKey: false
            };
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
            container.find('.group-match-item-slogan').first().simulate('click', event)
            expect(toJson(container)).toMatchSnapshot();
        });
    });
})