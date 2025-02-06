import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { Grid }  from '../Grid';
import CommonFunctions from '@jsroot/common/common-functions';
import DateTimeService from '@jsroot/common/dateTimeService';
import Site from '@jsroot/common/site';
describe('Grid', () => {
    const defaultProps = {
        selectedStageId: 0,
        stages: [
            {key: 1}, {key: 2}
        ],
        league: {season: {endTime: '2022-10-10'}},
        setSelectedStageId: jest.fn(),
        getMatches: jest.fn()
    };


    afterEach(() => {
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
            const instance = shallow(<Grid {...defaultProps} />).instance();

            // Assert
            expect(instance.state.isMobile).toEqual(true);
        });

        it('inital correctly state when innerWidth = 768', () => {
            // Arrange
            window.innerWidth = 768;

            // Act
            const instance = shallow(<Grid {...defaultProps} />).instance();

            // Assert
            expect(instance.state.isMobile).toEqual(true);
        });

        it('inital correctly state when innerWidth > 768', () => {
            // Arrange
            window.innerWidth = 960;

            // Act
            const instance = shallow(<Grid {...defaultProps} />).instance();

            // Assert
            expect(instance.state.isMobile).toEqual(false);
        });
    });

    describe('componentDidMount', () => {
        
        it('calls correctly functions', () => {
            // Arrange
            window.addEventListener = jest.fn();

            const container = shallow(<Grid {...defaultProps} />);
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

            const container = shallow(<Grid {...defaultProps} />);
            const instance = container.instance();

            // Act
            instance.componentWillUnmount();

            // Assert
            expect(window.removeEventListener).toHaveBeenCalledWith('resize', instance.handleResize);
        });
    });

    describe('handleResize', () => {
        it('updates correctly state when isMobile = false and window.innerWidth < 768', () => {
            // Arrange
            window.innerWidth = 767;
            const container = shallow(<Grid {...defaultProps} />);
            const instance = container.instance();
            instance.setState({ isMobile: false });

            // Act
            instance.handleResize();

            // Assert
            expect(instance.state.isMobile).toEqual(true);
        });

        it('updates correctly state when isMobile = false and window.innerWidth = 768', () => {
            // Arrange
            window.innerWidth = 768;
            const container = shallow(<Grid {...defaultProps} />);
            const instance = container.instance();
            instance.setState({ isMobile: false });

            // Act
            instance.handleResize();

            // Assert
            expect(instance.state.isMobile).toEqual(true);
        });

        it('do nothing when isMobile = true and window.innerWidth < 768', () => {
            // Arrange
            window.innerWidth = 767;
            const container = shallow(<Grid {...defaultProps} />);
            const instance = container.instance();
            instance.setState({ isMobile: true });
            instance.setState = jest.fn();

            // Act
            instance.handleResize();

            // Assert
            expect(instance.setState).toHaveBeenCalledTimes(0);
            expect(instance.state.isMobile).toEqual(true);
        });

        it('do nothing when isMobile = true and window.innerWidth = 768', () => {
            // Arrange
            window.innerWidth = 768;
            const container = shallow(<Grid {...defaultProps} />);
            const instance = container.instance();
            instance.setState({ isMobile: true });
            instance.setState = jest.fn();

            // Act
            instance.handleResize();

            // Assert
            expect(instance.setState).toHaveBeenCalledTimes(0);
            expect(instance.state.isMobile).toEqual(true);
        });

        it('updates correctly state when isMobile = true and window.innerWidth > 768', () => {
            // Arrange
            window.innerWidth = 769;
            const container = shallow(<Grid {...defaultProps} />);
            const instance = container.instance();
            instance.setState({ isMobile: true });

            // Act
            instance.handleResize();

            // Assert
            expect(instance.state.isMobile).toEqual(false);
        });
    });

    describe('initStageId', () => {
        it('init state correctly when season is finished', () => {
            // Arrange
            const props = {
                ...defaultProps,
                league: {
                    season: { endTime: '2022-08-18 02:00:00' }
                }
            }
            DateTimeService.getCurrentClientDateTime = jest.fn().mockReturnValue('2022-08-18 10:00:00');
            const container = shallow(<Grid {...props} />);
            const instance = container.instance();

            // Act
            const result = instance.initStageId();

            // Assert
            expect(result).toEqual(2)
        });

        it('init state correctly when league current stage is null', () => {
            // Arrange
            const props = {
                ...defaultProps,
                league: {
                    season: { endTime: '2022-09-18 02:00:00' },
                    currentStageId: 0
                }
            }
            DateTimeService.getCurrentClientDateTime = jest.fn().mockReturnValue('2022-08-18 10:00:00');
            const container = shallow(<Grid {...props} />);
            const instance = container.instance();
            // Act
            const result = instance.initStageId();

            // Assert
            expect(result).toEqual(1)
        });

        it('init state correctly when league have current stage', () => {
            // Arrange
            const props = {
                ...defaultProps,
                league: {
                    season: { endTime: '2022-09-18 02:00:00' },
                    currentStageId: 1
                }
            }
            DateTimeService.getCurrentClientDateTime = jest.fn().mockReturnValue('2022-08-18 10:00:00');
            const container = shallow(<Grid {...props} />);
            const instance = container.instance();

            // Act
            const result = instance.initStageId();

            // Assert
            expect(result).toEqual(1)
        });
    })

    describe('onSetStageId', () => {
        it('call exactly function', () => {
            // Arrange
            const container = shallow(<Grid {...defaultProps} />);
            const instance = container.instance();

            // Act
            instance.onSetStageId(2);

            // Assert
            expect(instance.state.selectedStageId).toEqual(2);
        });
    })

    describe('renders', () => {
        it('render correctly when isMobile = true & selectedStageId = 0', () => {
            // Arrange
            const props = {
                ...defaultProps,
                selectedStageId: 0
            };
            const container = shallow(<Grid {...props} />);
            const instance = container.instance();
            instance.setState({ isMobile: true });

            // Act
            const result = instance.render();

            // Assert
            expect(result).toMatchSnapshot();
        });
        it('render correctly when isMobile = false & selectedStageId != 0', () => {
            // Arrange
            const props = {
                ...defaultProps,
                selectedStageId: 1
            };
            const container = shallow(<Grid {...props} />);
            const instance = container.instance();
            instance.setState({ isMobile: false });

            // Act
            const result = instance.render();

            // Assert
            expect(result).toMatchSnapshot();
        });
    });
});