import React from 'react';
import { shallow } from 'enzyme';
import { Stages }  from '../Stages';
import CommonFunctions from '@jsroot/common/common-functions';
import DateTimeService from '@jsroot/common/dateTimeService';
import DataService from '@jsroot/common/dataService';
import { Euro } from '../../../euro-constants';
describe('Stages', () => {
    const defaultProps = {
        stages: [
            {stageId: 1}, {stageId: 2}
        ],
        league: {teamId: 1, matchId: 1, season: { endTime: '2022-09-18 02:00:00' }, currentStageId: 1 },
        votes: [],
        groupStages: [{key: 1, stage: 1, matches: [{matchId: 1, status: 50}]}, {key: 2, stage: 2, matches: [{matchId: 2, status:0 }]}],
        matches: [{matchId: 1}, {matchId:2}]
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
            const instance = shallow(<Stages {...defaultProps} />).instance();

            // Assert
            expect(instance.state.isMobile).toEqual(true);
        });

        it('inital correctly state when innerWidth = 768', () => {
            // Arrange
            window.innerWidth = 768;

            // Act
            const instance = shallow(<Stages {...defaultProps} />).instance();

            // Assert
            expect(instance.state.isMobile).toEqual(true);
        });

        it('inital correctly state when innerWidth > 768', () => {
            // Arrange
            window.innerWidth = 960;

            // Act
            const instance = shallow(<Stages {...defaultProps} />).instance();

            // Assert
            expect(instance.state.isMobile).toEqual(false);
        });
    });

    describe('componentDidMount', () => {
        
        it('calls correctly functions', () => {
            // Arrange
            window.addEventListener = jest.fn();

            const container = shallow(<Stages {...defaultProps} />);
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

            const container = shallow(<Stages {...defaultProps} />);
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
            const container = shallow(<Stages {...defaultProps} />);
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
            const container = shallow(<Stages {...defaultProps} />);
            const instance = container.instance();
            instance.initStageId = jest.fn().mockReturnValue(1);
            instance.setState({ isMobile: false });

            // Act
            instance.handleResize();

            // Assert
            expect(instance.state.isMobile).toEqual(true);
        });

        it('do nothing when isMobile = true and window.innerWidth < 768', () => {
            // Arrange
            window.innerWidth = 767;
            const container = shallow(<Stages {...defaultProps} />);
            const instance = container.instance();
            instance.setState({ isMobile: true, selectedStageId:1 });
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
            const container = shallow(<Stages {...defaultProps} />);
            const instance = container.instance();
            instance.initStageId = jest.fn().mockReturnValue(1);
            instance.setState({ isMobile: true, selectedStageId: 1 });

            // Act
            instance.handleResize();

            // Assert
            expect(instance.state.isMobile).toEqual(true);
        });

        it('updates correctly state when isMobile = true and window.innerWidth > 768', () => {
            // Arrange
            window.innerWidth = 769;
            const container = shallow(<Stages {...defaultProps} />);
            const instance = container.instance();
            instance.setState({ isMobile: true, selectedStageId: 1 });

            // Act
            instance.handleResize();

            // Assert
            expect(instance.state.isMobile).toEqual(false);
        });
    });

    describe('initStageId', () => {

        it('init state correctly when league current stage is null', () => {
            // Arrange
            const props = {
                ...defaultProps,
                league: {
                    season: { endTime: '2022-09-18 02:00:00' },
                    currentStageId: 0
                }
            }
            const container = shallow(<Stages {...props} />);
            const instance = container.instance();
            // Act
            const result = instance.initStageId();

            // Assert
            expect(result).toEqual(2)
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
            const container = shallow(<Stages {...props} />);
            const instance = container.instance();

            // Act
            const result = instance.initStageId();

            // Assert
            expect(result).toEqual(2)
        });
    });

    describe('handleSelectTab', () => {
        it('setState correctly when call function', () => {
            // Arrange
            const container = shallow(<Stages {...defaultProps} />);
            const instance = container.instance();

            // Act
            const result = instance.handleSelectTab(2);

            // Assert
            expect(instance.state.selectedStageId).toEqual(2)
        });
    });

    describe('onChange', () => {
        it('setState correctly when call function', () => {
            // Arrange
            const container = shallow(<Stages {...defaultProps} />);
            const instance = container.instance();
            const event = {target: {value: 2}}
            // Act
            const result = instance.onChange(event);

            // Assert
            expect(instance.state.selectedStageId).toEqual(2)
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


        it('calls correctly functions when ctrlKey = false', () => {
            // Arrange
            const event = {
                target: { className: '' },
                ctrlKey: false
            };
            window.open = jest.fn();
            const container = shallow(<Stages {...defaultProps} />);

            // Act
            container.find('.stage-number li').at(1).simulate('click', event);

            // Assert
            expect(window.open).toHaveBeenCalledTimes(0);
            expect(window.location).toEqual('/' + Euro.MinigameProfileUrl);
        });

        it('calls correctly functions when ctrlKey = true', () => {
            // Arrange
            const event = {
                target: { className: '' },
                ctrlKey: true
            };
            window.open = jest.fn();
            const container = shallow(<Stages {...defaultProps} />);

            // Act
            container.find('.stage-number li').at(1).simulate('click', event);

            // Assert
            expect(window.open).toHaveBeenCalledWith('/' + Euro.MinigameProfileUrl, '_blank');
        });
    });

    describe('renders', () => {
        it('render null when votes = null', () => {
            // Arrange
            const props = {
                ...defaultProps,
                groupStages: [{stage: 1, matches: [{matchId: 1}]}],
                votes: null
            }
            const container = shallow(<Stages {...props} />);
            const instance = container.instance();

            // Act
            const result = instance.render();

            // Assert
            expect(result).toEqual(null);
        });
        it('render correctly when there is only one group stage', () => {
            // Arrange
            const props = {
                ...defaultProps,
                groupStages: [{stage: 1, matches: [{matchId: 1}]}]
            }
            const container = shallow(<Stages {...props} />);
            const instance = container.instance();

            // Act
            const result = instance.render();

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('render correctly when there are more than one group stage and isMobile = true', () => {
            // Arrange
            const props = {
                ...defaultProps,
                groupStages: [{key: 1, stage: 1, matches: [{matchId: 1}]}, {key: 2, stage: 2, matches: [{matchId: 2}]}]
            }
            const container = shallow(<Stages {...props} />);
            const instance = container.instance();
            instance.state.isMobile = true;
            instance.getMatchWithStage = jest.fn().mockReturnValue({matches:[{matchId:1}]})

            // Act
            const result = instance.render();

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('render correctly when there are more than one group stage and isMobile = false', () => {
            // Arrange
            const props = {
                ...defaultProps,
                groupStages: [{key: 1, stage: 1, matches: [{matchId: 1}]}, {key: 2, stage: 2, matches: [{matchId: 2}]}]
            }
            const container = shallow(<Stages {...props} />);
            const instance = container.instance();
            instance.state.isMobile = false;

            // Act
            const result = instance.render();

            // Assert
            expect(result).toMatchSnapshot();
        });
    });
});