import React, { Fragment } from 'react';
import { shallow } from 'enzyme';
import Match from '../Match';
import CommonFunctions from '@jsroot/common/common-functions';
import LangHelper from '@jsroot/common/langHelper';
import { MatchStatus } from '@jsroot/common/constants';

describe('Match', () => {
    const defaultProps = {
        match: {
            matchId: 1,
            status: 0,
            homeTeam: {teamId: 1, icon: 'icon', teamNameVN: 'name'},
            awayTeam: {teamId: 1, icon: 'icon', teamNameVN: 'namenamename'}
        },
    };


    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getMatchStage', () => {
        it('return as expected when match status = Finished', () => {
            // Arrange
            const props = {
                ...defaultProps,
                match: {
                    ...defaultProps.match,
                    status: MatchStatus.Finished
                }
            }
            const container = shallow(<Match {...props} />);
            const instance = container.instance();

            // Act
            const result = instance.getMatchStage();

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('return as expected when match status = live', () => {
            // Arrange
            const props = {
                ...defaultProps,
                match: {
                    ...defaultProps.match,
                    status: MatchStatus.FirstHalf
                }
            }
            const container = shallow(<Match {...props} />);
            const instance = container.instance();

            // Act
            const result = instance.getMatchStage();

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('return as expected when match status = NotStarted', () => {
            // Arrange
            const props = {
                ...defaultProps,
                match: {
                    ...defaultProps.match,
                    status: MatchStatus.NotStarted,
                    startTime: '2020-10-10 10:00'
                }
            }
            const container = shallow(<Match {...props} />);
            const instance = container.instance();

            // Act
            const result = instance.getMatchStage();

            // Assert
            expect(result).toEqual('17:00');
        });

        it('return as expected when match status = Delay', () => {
            // Arrange
            const props = {
                ...defaultProps,
                match: {
                    ...defaultProps.match,
                    status: MatchStatus.Delay
                }
            }
            const container = shallow(<Match {...props} />);
            const instance = container.instance();

            // Act
            const result = instance.getMatchStage();

            // Assert
            expect(result).toEqual(LangHelper.getResource('Delay'));
        });

        it('return as expected when match status = Interrupt', () => {
            // Arrange
            const props = {
                ...defaultProps,
                match: {
                    ...defaultProps.match,
                    status: MatchStatus.Interrupt
                }
            }
            const container = shallow(<Match {...props} />);
            const instance = container.instance();

            // Act
            const result = instance.getMatchStage();

            // Assert
            expect(result).toEqual(LangHelper.getResource('Interrupt'));
        });

        it('return as expected when match status = Postpone', () => {
            // Arrange
            const props = {
                ...defaultProps,
                match: {
                    ...defaultProps.match,
                    status: MatchStatus.Postpone
                }
            }
            const container = shallow(<Match {...props} />);
            const instance = container.instance();

            // Act
            const result = instance.getMatchStage();

            // Assert
            expect(result).toEqual(LangHelper.getResource('Postponed'));
        });

        it('return as expected when match status = Cancel', () => {
            // Arrange
            const props = {
                ...defaultProps,
                match: {
                    ...defaultProps.match,
                    status: MatchStatus.Cancel
                }
            }
            const container = shallow(<Match {...props} />);
            const instance = container.instance();

            // Act
            const result = instance.getMatchStage();

            // Assert
            expect(result).toEqual(LangHelper.getResource('Cancel'));
        });

        it('return as expected when match status = TBD', () => {
            // Arrange
            const props = {
                ...defaultProps,
                match: {
                    ...defaultProps.match,
                    status: MatchStatus.TBD
                }
            }
            const container = shallow(<Match {...props} />);
            const instance = container.instance();

            // Act
            const result = instance.getMatchStage();

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('return as expected when match status is undefine', () => {
            // Arrange
            const props = {
                ...defaultProps,
                match: {
                    ...defaultProps.match,
                    status: 123
                }
            }
            const container = shallow(<Match {...props} />);
            const instance = container.instance();

            // Act
            const result = instance.getMatchStage();

            // Assert
            expect(result).toEqual(LangHelper.getResource('Finish'));
        });
    });

    describe('renderTeamStatus', () => {
        it('return as expected when match status != Finished', () => {
            // Arrange
            CommonFunctions.getTeamName = jest.fn().mockReturnValue('name');
            const container = shallow(<Match {...defaultProps} />);
            const instance = container.instance();

            // Act
            const result = instance.renderTeamStatus(defaultProps.match, true);

            // Assert
            expect(result).toEqual(<Fragment />);
        });

        it('return as expected when match status = Finished and PenaltyScore > 0', () => {
            // Arrange
            const props = {
                ...defaultProps,
                match: {
                    ...defaultProps.match,
                    status: 50,
                    homeTeamPenaltyScore: 0,
                    awayTeamPenaltyScore: 1
                }
            };
            CommonFunctions.getTeamName = jest.fn().mockReturnValue('name');
            const container = shallow(<Match {...props} />);
            const instance = container.instance();

            // Act
            const result = instance.renderTeamStatus(props.match, false);

            // Assert
            expect(result).toEqual(<li>PEN</li>);
        });

        it('return as expected when match status = Finished and isSecondLeg = true and AggregateScore > 0', () => {
            // Arrange
            const props = {
                ...defaultProps,
                match: {
                    ...defaultProps.match,
                    status: 50,
                    homeTeamAggregateScore: 1,
                    awayTeamAggregateScore: 0,
                    isSecondLeg: true
                }
            };
            CommonFunctions.getTeamName = jest.fn().mockReturnValue('name');
            const container = shallow(<Match {...props} />);
            const instance = container.instance();

            // Act
            const result = instance.renderTeamStatus(props.match, true);

            // Assert
            expect(result).toEqual(<li>AGG</li>);
        });

        it('return as expected when match status = Finished and isSecondLeg = false and PenaltyScore = 0', () => {
            // Arrange
            const props = {
                ...defaultProps,
                match: {
                    ...defaultProps.match,
                    status: 50,
                    isSecondLeg: false
                }
            };
            CommonFunctions.getTeamName = jest.fn().mockReturnValue('name');
            const container = shallow(<Match {...props} />);
            const instance = container.instance();

            // Act
            const result = instance.renderTeamStatus(props.match, true);

            // Assert
            expect(result).toEqual(<Fragment />);
        });
    });

    describe('onClick', () => {
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
            CommonFunctions.getTeamName = jest.fn().mockReturnValue('test team name vn');
            CommonFunctions.getMatchDetailPageUrl = jest.fn().mockReturnValue('url');
            const container = shallow(<Match {...defaultProps} />);

            // Act
            container.find('.duel-participant').simulate('click', event);

            // Assert
            expect(window.open).toHaveBeenCalledTimes(0);
            expect(window.location).toEqual('url');
        });

        it('calls correctly functions when ctrlKey = true', () => {
            // Arrange
            const event = {
                target: { className: '' },
                ctrlKey: true
            };
            CommonFunctions.getTeamName = jest.fn().mockReturnValue('name');
            CommonFunctions.getMatchDetailPageUrl = jest.fn().mockReturnValue('url');
            window.open = jest.fn();
            const container = shallow(<Match {...defaultProps} />);

            // Act
            container.find('.duel-participant').simulate('click', event);

            // Assert
            expect(window.open).toHaveBeenCalledWith('url', '_blank');
        });
    });

    describe('renderTeamName', () => {
        it('render correctly when team name length > 11', () => {
            // Arrange
            const name = "champions league";
            const container = shallow(<Match {...defaultProps} />);
            const instance = container.instance();

            // Act
            const result = instance.renderTeamName(name);

            // Assert
            expect(result).toMatchSnapshot();
        })
    });

    describe('getFinalScore', () => {
        it('render correctly when match have extra score', () => {
            // Arrange
            const match = {
                homeTeamExtraScore: 1,
                awayTeamExtraScore: 2
            };
            const container = shallow(<Match {...defaultProps} />);
            const instance = container.instance();

            // Act
            const result = instance.getFinalScore(match);

            // Assert
            expect(result).toMatchSnapshot();
        })

        it('render correctly when match have not extra score', () => {
            // Arrange
            const match = {
                homeTeamTotalScore: 1,
                awayTeamTotalScore: 2
            };
            const container = shallow(<Match {...defaultProps} />);
            const instance = container.instance();

            // Act
            const result = instance.getFinalScore(match);

            // Assert
            expect(result).toMatchSnapshot();
        })
    });

    describe('renders', () => {
        it('render correctly when homeTeam win', () => {
            // Arrange
            const props = {
                ...defaultProps,
                match: {startTime: '2022-10-10', status: 20, homeTeam: {teamId: 1, icon: 'icon'}, awayTeam: {teamId: 1, icon: 'icon'}}
            }
            CommonFunctions.isLiveMatch = jest.fn().mockReturnValue(true);
            CommonFunctions.getMatchResult = jest.fn().mockReturnValue(1);
            const container = shallow(<Match {...props} />);
            const instance = container.instance();

            // Act
            const result = instance.render();

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('render correctly when awayTeam win', () => {
            // Arrange
            const props = {
                ...defaultProps,
                match: {startTime: '2022-10-10', status: 20, homeTeam: {teamId: 1, icon: 'icon'}, awayTeam: {teamId: 1, icon: 'icon'}}
            }
            CommonFunctions.isLiveMatch = jest.fn().mockReturnValue(false);
            CommonFunctions.getMatchResult = jest.fn().mockReturnValue(2);
            CommonFunctions.getTeamName = jest.fn().mockReturnValue('name');
            const container = shallow(<Match {...props} />);
            const instance = container.instance();

            // Act
            const result = instance.render();

            // Assert
            expect(result).toMatchSnapshot();
        });
    });
});