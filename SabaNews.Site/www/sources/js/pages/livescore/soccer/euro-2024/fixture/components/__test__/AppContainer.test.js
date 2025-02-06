import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { AppContainer } from '../AppContainer';
import CommonFunctions from '@jsroot/common/common-functions';
import DateTimeService from '@jsroot/common/dateTimeService';
import Site from '@jsroot/common/site';

describe('AppContainer', () => {
    const defaultProps = {
        league: null,
        matches: null,
        getMatches: jest.fn()
    };


    afterEach(() => {
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
            const instance = shallow(<AppContainer {...defaultProps} />).instance();

            // Assert
            expect(instance.state.isMobile).toEqual(true);
        });

        it('inital correctly state when innerWidth = 1024', () => {
            // Arrange
            window.innerWidth = 1024;

            // Act
            const instance = shallow(<AppContainer {...defaultProps} />).instance();

            // Assert
            expect(instance.state.isMobile).toEqual(true);
        });

        it('inital correctly state when innerWidth > 1024', () => {
            // Arrange
            window.innerWidth = 1026;

            // Act
            const instance = shallow(<AppContainer {...defaultProps} />).instance();

            // Assert
            expect(instance.state.isMobile).toEqual(false);
        });
    })

    describe('componentDidMount', () => {
        it('calls correctly functions', () => {
            // Arrange
            const container = shallow(<AppContainer {...defaultProps} />);
            const instance = container.instance();

            // Act
            instance.componentDidMount();

            // Assert
            expect(defaultProps.getMatches).toHaveBeenCalledTimes(2);
        });
    })

    describe('componentWillUnmount', () => {
        it('calls correctly functions', () => {
            // Arrange
            window.removeEventListener = jest.fn();

            const container = shallow(<AppContainer {...defaultProps} />);
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
            window.innerWidth = 767;
            const container = shallow(<AppContainer {...defaultProps} />);
            const instance = container.instance();
            instance.setState({ isMobile: false });

            // Act
            instance.handleResize();

            // Assert
            expect(instance.state.isMobile).toEqual(true);
        });

        it('updates correctly state when isMobile = false and window.innerWidth = 1024', () => {
            // Arrange
            window.innerWidth = 1024;
            const container = shallow(<AppContainer {...defaultProps} />);
            const instance = container.instance();
            instance.setState({ isMobile: false });

            // Act
            instance.handleResize();

            // Assert
            expect(instance.state.isMobile).toEqual(true);
        });

        it('do nothing when isMobile = true and window.innerWidth < 1024', () => {
            // Arrange
            window.innerWidth = 767;
            const container = shallow(<AppContainer {...defaultProps} />);
            const instance = container.instance();
            instance.setState({ isMobile: true });
            instance.setState = jest.fn();

            // Act
            instance.handleResize();

            // Assert
            expect(instance.setState).toHaveBeenCalledTimes(0);
            expect(instance.state.isMobile).toEqual(true);
        });

        it('do nothing when isMobile = true and window.innerWidth = 1024', () => {
            // Arrange
            window.innerWidth = 1024;
            const container = shallow(<AppContainer {...defaultProps} />);
            const instance = container.instance();
            instance.setState({ isMobile: true });
            instance.setState = jest.fn();

            // Act
            instance.handleResize();

            // Assert
            expect(instance.setState).toHaveBeenCalledTimes(0);
            expect(instance.state.isMobile).toEqual(true);
        });

        it('updates correctly state when isMobile = true and window.innerWidth > 1024', () => {
            // Arrange
            window.innerWidth = 1025;
            const container = shallow(<AppContainer {...defaultProps} />);
            const instance = container.instance();
            instance.setState({ isMobile: true });

            // Act
            instance.handleResize();

            // Assert
            expect(instance.state.isMobile).toEqual(false);
        });
    });

    describe('checkIsFinished', () => {
        it('return as expected when season finished', () => {
            // Arrange
            const league = {
                season: { endTime: '2022-08-18 02:00:00' }
            }
            const container = shallow(<AppContainer {...defaultProps} />);
            const instance = container.instance();
            DateTimeService.getCurrentClientDateTime = jest.fn().mockReturnValue('2022-08-18 10:00:00');
            // Act
            const result = instance.checkIsFinished(league);

            // Assert
            expect(result).toEqual(true);
        });

        it('return as expected when season does not finish', () => {
            // Arrange
            const league = {
                season: { endTime: '2022-08-19 05:00:00' }
            }
            const container = shallow(<AppContainer {...defaultProps} />);
            const instance = container.instance();
            DateTimeService.getCurrentClientDateTime = jest.fn().mockReturnValue('2022-08-18 10:00:00');
            // Act
            const result = instance.checkIsFinished(league);

            // Assert
            expect(result).toEqual(false);
        });
    });

    describe('getMatches', () => {
        it('return correctly when season finished', () => {
            // Arrange
            const matches = [{ matchId: 1, stage:{stageId:35540}, status: 50 }, { matchId: 2, stage:{stageId: 35540}, status: 50 }];
            const league = {
                season: { endTime: '2022-08-19 05:00:00' },
                currentStageId: 0
            }
            const props = {
                ...defaultProps,
                matches: matches,
                league: league
            }
            const container = shallow(<AppContainer {...props} />);
            const instance = container.instance();
            instance.checkIsFinished = jest.fn().mockReturnValue(true);
            // Act
            const result = instance.getMatches(league);

            // Assert
            expect(result.matches).toEqual(matches.reverse());
        });

        it('return correctly when stage < QuarterfinalsStage', () => {
            // Arrange
            const matches = [{ matchId: 1, status:0, stage: { stageId: 35537 } }, { matchId: 2, status:0, stage: { stageId: 35455 } }];
            const league = {
                season: { endTime: '2022-08-19 05:00:00' },
                currentStageId: 0
            }
            const props = {
                ...defaultProps,
                matches: matches,
                league: league
            }
            const container = shallow(<AppContainer {...props} />);
            const instance = container.instance();
            instance.checkIsFinished = jest.fn().mockReturnValue(false);
            // Act
            const result = instance.getMatches(league);

            // Assert
            expect(result.matches).toEqual(matches);
        });

        it('return correctly when stage >= QuarterfinalsStage', () => {
            // Arrange
            const matches = [{ matchId: 1, status: 50, stage: { stageId: 35537 } }, { matchId: 2, status:0 , stage: { stageId: 35455 } }];
            var expectedMatches = [{ matchId: 1, status: 50, stage: { stageId: 35537 } }];
            const league = {
                season: { endTime: '2022-08-19 05:00:00' },
                currentStageId: 35539
            }
            const props = {
                ...defaultProps,
                matches: matches,
                league: league
            }
            const container = shallow(<AppContainer {...props} />);
            const instance = container.instance();
            instance.checkIsFinished = jest.fn().mockReturnValue(false);
            // Act
            const result = instance.getMatches(league);

            // Assert
            expect(result.matches).toEqual(expectedMatches);
        });
    });

    describe('renders', () => {
        it('render skeleton when match is null', () => {
            // Arrange
            const container = shallow(<AppContainer {...defaultProps} />);
            const instance = container.instance();
            // Act
            const result = instance.render();

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('return correct when match is empty', () => {
            // Arrange
            const props = {
                ...defaultProps,
                matches: [],
                league: {leagueId: 1, season:{endTime: '2022-10-10'}}
            };
            const container = shallow(<AppContainer {...props} />);
            const instance = container.instance();
            instance.checkIsFinished = jest.fn();
            // Act
            const result = instance.render();

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('render correctly when matches has data', () => {
            // Arrange
            const matches = [{ matchId: 1, status: 0, stage: { stageId: 35537 } }, { matchId: 2, status: 0, stage: { stageId: 0 } }];
            const league = {
                season: { endTime: '2022-08-19 05:00:00' },
                currentStageId: 35537
            }
            const props = {
                ...defaultProps,
                matches: matches,
                league: league
            }
            const container = shallow(<AppContainer {...props} />);
            const instance = container.instance();
            instance.getMatches = jest.fn().mockReturnValue(matches);
            instance.checkIsFinished = jest.fn().mockReturnValue(false);
            // Act
            const result = instance.render();

            // Assert
            expect(result).toMatchSnapshot();
        });
    });
})