import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import MatchStage from '../MatchStage';
import CommonFunctions from '@jsroot/common/common-functions'
import LangHelper from '@jsroot/common/langHelper';
import DateTimeService from '@jsroot/common/dateTimeService';

describe('MatchStage', () => {
    let defaultProps = {
        match: {status: 0}
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('render correcly', () => {
        // Arrange
        const props = {
            ...defaultProps,
            match: {
                matchId: 1,
                status: 10,
                startTime: '2022-06-02'
            }
        }
        const container = shallow(<MatchStage {...props} />);

        // Assert
        expect(container).toMatchSnapshot();
    });

    describe('componentDidMount', () => {
        it('call correctly function', () => {
            // Arrange
            const container = shallow(<MatchStage {...defaultProps} />);
            const instance = container.instance();
            instance.getMatchStage = jest.fn();

            // Act
            instance.componentDidMount();

            // Assert
            expect(instance.getMatchStage).toHaveBeenCalled();
        })
    });

    describe('componentWillUnmount', () => {
        it('call exacly function when have intervalId', () => {
            // Arrange
            jest.useFakeTimers();
            const container = shallow(<MatchStage {...defaultProps} />);
            const instance = container.instance();
            instance.getMatchStage = jest.fn();
            instance.intervalId = 1;

            // Act
            instance.componentWillUnmount();

            // Assert
            expect(clearInterval).toHaveBeenCalledWith(expect.any(Number));
        });

        it('call exacly function when intervalId is null', () => {
            // Arrange
            jest.useFakeTimers();
            const container = shallow(<MatchStage {...defaultProps} />);
            const instance = container.instance();
            instance.getMatchStage = jest.fn();

            // Act
            instance.componentWillUnmount();

            // Assert
            expect(clearInterval).toHaveBeenCalledTimes(0);
        });
    });

    describe('componentDidUpdate', () => {
        it('call correctly function when have intervalId', () => {
            // Arrange
            jest.useFakeTimers();
            const prevProps = {
                match: {matchId: 1}
            }
            const container = shallow(<MatchStage {...defaultProps} />);
            const instance = container.instance();
            instance.getMatchStage = jest.fn();
            instance.intervalId = 1;

            // Act
            instance.componentDidUpdate(prevProps);

            // Assert
            expect(clearInterval).toHaveBeenCalledWith(expect.any(Number));
            expect(instance.getMatchStage).toHaveBeenCalled();
        });

        it('call correctly function when intervalId is null', () => {
            // Arrange
            jest.useFakeTimers();
            const prevProps = {
                match: {matchId: 1}
            }
            const container = shallow(<MatchStage {...defaultProps} />);
            const instance = container.instance();
            instance.getMatchStage = jest.fn();

            // Act
            instance.componentDidUpdate(prevProps);

            // Assert
            expect(clearInterval).toHaveBeenCalledTimes(0);
            expect(instance.getMatchStage).toHaveBeenCalled();
        });
    });

    describe('getMatchStageOfLiveMatch', () => {
        it('return correctly stage when match status = finished', () => {
            // Arrange
            const match = {status:50}
            const container = shallow(<MatchStage {...defaultProps} />);
            const instance = container.instance();
            instance.getMatchStage = jest.fn();
            // Act
            const result = instance.getMatchStageOfLiveMatch(match);

            // Assert
            expect(result).toEqual('');
        });
        it('return correctly stage when match status = FirstHalf', () => {
            // Arrange
            const match = {status:10}
            const container = shallow(<MatchStage {...defaultProps} />);
            const instance = container.instance();
            instance.getMatchStage = jest.fn();
            instance.getFirstHalfTimeMinutes = jest.fn().mockReturnValue('20');
            // Act
            const result = instance.getMatchStageOfLiveMatch(match);

            // Assert
            expect(result).toEqual('20');
        });

        it('return correctly stage when match status = SecondHalf', () => {
            // Arrange
            const match = {status:30}
            const container = shallow(<MatchStage {...defaultProps} />);
            const instance = container.instance();
            instance.getMatchStage = jest.fn();
            instance.getSecondHalfTimeMinutes = jest.fn().mockReturnValue('50');
            // Act
            const result = instance.getMatchStageOfLiveMatch(match);

            // Assert
            expect(result).toEqual('50');
        });

        it('return correctly stage when match status = ExtraTime', () => {
            // Arrange
            const match = {status:40}
            const container = shallow(<MatchStage {...defaultProps} />);
            const instance = container.instance();
            instance.getMatchStage = jest.fn();
            instance.getExtraTimeMinutes = jest.fn().mockReturnValue('120');
            // Act
            const result = instance.getMatchStageOfLiveMatch(match);

            // Assert
            expect(result).toEqual('120');
        });

        it('return correctly stage when match status = Intermission', () => {
            // Arrange
            const match = {status:20}
            const container = shallow(<MatchStage {...defaultProps} />);
            const instance = container.instance();
            instance.getMatchStage = jest.fn();
            instance.getSecondHalfTimeMinutes = jest.fn().mockReturnValue('120');
            // Act
            const result = instance.getMatchStageOfLiveMatch(match);

            // Assert
            expect(result).toEqual(LangHelper.getResource('Intermission'));
        });

        it('return correctly stage when match status = PenaltyShootout', () => {
            // Arrange
            const match = {status:41}
            const container = shallow(<MatchStage {...defaultProps} />);
            const instance = container.instance();
            instance.getMatchStage = jest.fn();
            instance.getSecondHalfTimeMinutes = jest.fn().mockReturnValue('120');
            // Act
            const result = instance.getMatchStageOfLiveMatch(match);

            // Assert
            expect(result).toEqual(LangHelper.getResource('Penalty'));
        });
    });

    describe('getMatchStageOfPreAndPostMatch', () => {
        it('return correctly stage when match status = finished', () => {
            // Arrange
            const match = {status:50}
            const container = shallow(<MatchStage {...defaultProps} />);
            const instance = container.instance();
            // Act
            const result = instance.getMatchStageOfPreAndPostMatch(match);

            // Assert
            expect(result).toEqual(LangHelper.getResource('Finish'));
        });

        it('return correctly stage when match status = NotStarted', () => {
            // Arrange
            const match = {status:0, startTime: '2022-06-02 12:00:00'};
            const container = shallow(<MatchStage {...defaultProps} />);
            const instance = container.instance();
            // Act
            const result = instance.getMatchStageOfPreAndPostMatch(match);

            // Assert
            expect(result).toEqual('19:00');
        });
        it('return correctly stage when match status = Delay', () => {
            // Arrange
            const match = {status:60, startTime: '2022-06-02 12:00:00'};
            const container = shallow(<MatchStage {...defaultProps} />);
            const instance = container.instance();
            // Act
            const result = instance.getMatchStageOfPreAndPostMatch(match);

            // Assert
            expect(result).toEqual(LangHelper.getResource('Delay'));
        });

        it('return correctly stage when match status = Interrupt', () => {
            // Arrange
            const match = {status:61, startTime: '2022-06-02 12:00:00'};
            const container = shallow(<MatchStage {...defaultProps} />);
            const instance = container.instance();
            // Act
            const result = instance.getMatchStageOfPreAndPostMatch(match);

            // Assert
            expect(result).toEqual(LangHelper.getResource('Interrupt'));
        });

        it('return correctly stage when match status = Postpone', () => {
            // Arrange
            const match = {status:63, startTime: '2022-06-02 12:00:00'};
            const container = shallow(<MatchStage {...defaultProps} />);
            const instance = container.instance();
            // Act
            const result = instance.getMatchStageOfPreAndPostMatch(match);

            // Assert
            expect(result).toEqual(LangHelper.getResource('Postponed'));
        });

        it('return correctly stage when match status = Cancel', () => {
            // Arrange
            const match = {status:64, startTime: '2022-06-02 12:00:00'};
            const container = shallow(<MatchStage {...defaultProps} />);
            const instance = container.instance();
            // Act
            const result = instance.getMatchStageOfPreAndPostMatch(match);

            // Assert
            expect(result).toEqual(LangHelper.getResource('Cancel'));
        });

        it('return correctly stage when match status = TBD', () => {
            // Arrange
            const match = {status:99, startTime: '2022-06-02 12:00:00'};
            const container = shallow(<MatchStage {...defaultProps} />);
            const instance = container.instance();
            // Act
            const result = instance.getMatchStageOfPreAndPostMatch(match);

            // Assert
            expect(result).toEqual(LangHelper.getResource('ToBeDecided'));
        });
    });

    describe('getMatchStage', () => {
        it('setState correctly when match status = NotStarted', () => {
            // Arrange
            const props = {
                ...defaultProps,
                match: {status: 0}
            }
            const container = shallow(<MatchStage {...props} />);
            const instance = container.instance();
            instance.getMatchStageOfPreAndPostMatch = jest.fn().mockReturnValue('NotStarted');
            // Act
            instance.getMatchStage();

            // Assert
            expect(instance.state.stage).toEqual('NotStarted');
            expect(instance.state.className).toEqual('font-weight-bold');
        });

        it('setState correctly when match status = FirstHalf', () => {
            // Arrange
            const props = {
                ...defaultProps,
                match: {status: 10}
            }
            const container = shallow(<MatchStage {...props} />);
            const instance = container.instance();
            instance.getMatchStageOfLiveMatch = jest.fn().mockReturnValue('10');
            // Act
            instance.getMatchStage();

            // Assert
            expect(instance.state.stage).toEqual('10');
            expect(instance.state.className).toEqual('');
        });

        it('setState correctly when match status = SecondHalf', () => {
            // Arrange
            const props = {
                ...defaultProps,
                match: {status: 30}
            }
            const container = shallow(<MatchStage {...props} />);
            const instance = container.instance();
            instance.getMatchStageOfLiveMatch = jest.fn().mockReturnValue('46');
            // Act
            instance.getMatchStage();

            // Assert
            expect(instance.state.stage).toEqual('46');
            expect(instance.state.className).toEqual('');
        });

        it('setState correctly when match status = ExtraTime', () => {
            // Arrange
            const props = {
                ...defaultProps,
                match: {status: 40}
            }
            const container = shallow(<MatchStage {...props} />);
            const instance = container.instance();
            instance.getMatchStageOfLiveMatch = jest.fn().mockReturnValue('120');
            // Act
            instance.getMatchStage();

            // Assert
            expect(instance.state.stage).toEqual('120');
            expect(instance.state.className).toEqual('');
        });

        it('setState correctly when match status = Intermission', () => {
            // Arrange
            const props = {
                ...defaultProps,
                match: {status: 20}
            }
            const container = shallow(<MatchStage {...props} />);
            const instance = container.instance();
            instance.getMatchStageOfLiveMatch = jest.fn().mockReturnValue('Intermission');
            // Act
            instance.getMatchStage();

            // Assert
            expect(instance.state.stage).toEqual('Intermission');
            expect(instance.state.className).toEqual('');
        });

        it('setState correctly when match status = PenaltyShootout', () => {
            // Arrange
            const props = {
                ...defaultProps,
                match: {status: 41}
            }
            const container = shallow(<MatchStage {...props} />);
            const instance = container.instance();
            instance.getMatchStageOfLiveMatch = jest.fn().mockReturnValue('PenaltyShootout');
            // Act
            instance.getMatchStage();

            // Assert
            expect(instance.state.stage).toEqual('PenaltyShootout');
            expect(instance.state.className).toEqual('');
        });
    });

    describe('getFirstHalfTimeMinutes', () => {
        it('return correctly when minutes lower than 45', () => {
            // Arrange
            const props = {
                ...defaultProps,
                match: {status: 41}
            }
            const match = {startTime: '2022-06-02 12:00:00', footballStartTime:'2022-06-02 12:00:00'};
            const container = shallow(<MatchStage {...props} />);
            const instance = container.instance();
            DateTimeService.getCurrentClientDateTime = jest.fn().mockReturnValue('2022-06-02 19:20:00');
            // Act
            const result = instance.getFirstHalfTimeMinutes(match);

            // Assert
            expect(result).toEqual(`20'`);
        });

        it('return correctly when minutes more than 45', () => {
            // Arrange
            const props = {
                ...defaultProps,
                match: {status: 41}
            }
            const match = {startTime: '2022-06-02 12:00:00'};
            const container = shallow(<MatchStage {...props} />);
            const instance = container.instance();
            DateTimeService.getCurrentClientDateTime = jest.fn().mockReturnValue('2022-06-02 19:50:00');
            // Act
            const result = instance.getFirstHalfTimeMinutes(match);

            // Assert
            expect(result).toEqual(`45'+`);
        });

        it('return correctly when minutes lower than 0', () => {
            // Arrange
            const props = {
                ...defaultProps,
                match: {status: 41}
            }
            const match = {startTime: '2022-06-02 12:00:00'};
            const container = shallow(<MatchStage {...props} />);
            const instance = container.instance();
            DateTimeService.getCurrentClientDateTime = jest.fn().mockReturnValue('2022-06-02 18:50:00');
            // Act
            const result = instance.getFirstHalfTimeMinutes(match);

            // Assert
            expect(result).toEqual(`0'`);
        });
    });

    describe('getSecondHalfTimeMinutes', () => {
        it('return correctly when minutes lower than 90', () => {
            // Arrange
            const match = {startTime: '2022-06-02 12:00:00', footballNextHalfStartTime:'2022-06-02 12:00:00'};
            const container = shallow(<MatchStage {...defaultProps} />);
            const instance = container.instance();
            DateTimeService.getCurrentClientDateTime = jest.fn().mockReturnValue('2022-06-02 19:40:00');
            // Act
            const result = instance.getSecondHalfTimeMinutes(match);

            // Assert
            expect(result).toEqual(`85'`);
        });

        it('return correctly when minutes more than 90', () => {
            // Arrange
            const match = {startTime: '2022-06-02 12:00:00', footballNextHalfStartTime:'2022-06-02 12:00:00'};
            const container = shallow(<MatchStage {...defaultProps} />);
            const instance = container.instance();
            DateTimeService.getCurrentClientDateTime = jest.fn().mockReturnValue('2022-06-02 20:45:00');
            // Act
            const result = instance.getSecondHalfTimeMinutes(match);

            // Assert
            expect(result).toEqual(`90'+`);
        });

        it('return correctly when minutes lower than 0', () => {
            // Arrange
            const match = {startTime: '2022-06-02 12:00:00'};
            const container = shallow(<MatchStage {...defaultProps} />);
            const instance = container.instance();
            DateTimeService.getCurrentClientDateTime = jest.fn().mockReturnValue('2022-06-02 18:45:00');
            // Act
            const result = instance.getSecondHalfTimeMinutes(match);

            // Assert
            expect(result).toEqual(`45'`);
        });
    });

    describe('getExtraTimeMinutes', () => {
        it('return correctly when minutes lower than 90', () => {
            // Arrange
            const match = {startTime: '2022-06-02 12:00:00', footballAddStartTime:'2022-06-02 12:00:00'};
            const container = shallow(<MatchStage {...defaultProps} />);
            const instance = container.instance();
            DateTimeService.getCurrentClientDateTime = jest.fn().mockReturnValue('2022-06-02 19:20:00');
            // Act
            const result = instance.getExtraTimeMinutes(match);

            // Assert
            expect(result).toEqual(`110'`);
        });

        it('return correctly when minutes more than 90', () => {
            // Arrange
            const match = {startTime: '2022-06-02 12:00:00', footballAddStartTime:'2022-06-02 12:00:00'};
            const container = shallow(<MatchStage {...defaultProps} />);
            const instance = container.instance();
            DateTimeService.getCurrentClientDateTime = jest.fn().mockReturnValue('2022-06-02 19:40:00');
            // Act
            const result = instance.getExtraTimeMinutes(match);

            // Assert
            expect(result).toEqual(`120'+`);
        });

        it('return correctly when minutes lower than 0', () => {
            // Arrange
            const match = {startTime: '2022-06-02 12:00:00'};
            const container = shallow(<MatchStage {...defaultProps} />);
            const instance = container.instance();
            instance.getMatchStageOfLiveMatch = jest.fn().mockReturnValue('PenaltyShootout');
            DateTimeService.getCurrentClientDateTime = jest.fn().mockReturnValue('2022-06-02 20:45:00');
            // Act
            const result = instance.getExtraTimeMinutes(match);

            // Assert
            expect(result).toEqual(`75'`);
        });
    });
})