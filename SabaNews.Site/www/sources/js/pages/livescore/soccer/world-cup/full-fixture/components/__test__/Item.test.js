import React, { Fragment } from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import Item from '../Item';
import CommonFunctions from '@jsroot/common/common-functions';
import DateTimeService from '@jsroot/common/dateTimeService';
import Site from '@jsroot/common/site';

describe('Item', () => {
    const defaultProps = {
        match: {matchId: 1, status: 0, homeTeam: {teamId: 1, icon: 'icon'}, awayTeam: {teamId: 1, icon: 'icon'}},
    };


    afterEach(() => {
        jest.clearAllMocks();
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
            CommonFunctions.getMatchDetailPageUrl = jest.fn().mockReturnValue('url');
            const container = shallow(<Item {...defaultProps} />);

            // Act
            container.find('.group-match-item').simulate('click', event);

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
            CommonFunctions.getMatchDetailPageUrl = jest.fn().mockReturnValue('url');
            window.open = jest.fn();
            const container = shallow(<Item {...defaultProps} />);

            // Act
            container.find('div.group-match-item').simulate('click', event);

            // Assert
            expect(window.open).toHaveBeenCalledWith('url', '_blank');
        });
    });

    describe('getTeamStatus', () => {
        it('return as expected when match status != Finished', () => {
            // Arrange
            const container = shallow(<Item {...defaultProps} />);
            const instance = container.instance();

            // Act
            const result = instance.getTeamStatus(defaultProps.match, true);

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
                    homeTeamPenaltyScore: 1,
                    awayTeamPenaltyScore: 0
                }
            };
            const container = shallow(<Item {...props} />);
            const instance = container.instance();

            // Act
            const result = instance.getTeamStatus(props.match, true);

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
            const container = shallow(<Item {...props} />);
            const instance = container.instance();

            // Act
            const result = instance.getTeamStatus(props.match, true);

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
            const container = shallow(<Item {...props} />);
            const instance = container.instance();

            // Act
            const result = instance.getTeamStatus(props.match, true);

            // Assert
            expect(result).toEqual(<Fragment />);
        });
    });

    describe('getScores', () => {
        it('return correctly when status = NotStarted', () => {
            // Arrange
            const match =  { matchId: 1,
                    startTime: '2022-06-12',
                    homeTeamTotalScore: 1,
                    awayTeamTotalScore: 1,
                    status: 0,
                    league: {icon: 'icon'},
                    homeTeam: {icon:'icon'},
                    awayTeam: {icon:'icon'}
            }
            const container = shallow(<Item {...defaultProps}/>);
            const instance = container.instance();

            // Act
            const result = instance.getScores(match);

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('return correctly when status = Delay', () => {
            // Arrange
            const match= {
                matchId: 1,
                startTime: '2022-06-12',
                homeTeamTotalScore: 1,
                awayTeamTotalScore: 1,
                status: 60,
                league: {icon: 'icon'},
                homeTeam: {icon:'icon'},
                awayTeam: {icon:'icon'}
            }
            const container = shallow(<Item {...defaultProps}/>);
            const instance = container.instance();

            // Act
            const result = instance.getScores(match);

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('return correctly when status = Postpone', () => {
            // Arrange
            const match = {
                matchId: 1,
                startTime: '2022-06-12',
                homeTeamTotalScore: 1,
                awayTeamTotalScore: 1,
                status: 63,
                league: {icon: 'icon'},
                homeTeam: {icon:'icon'},
                awayTeam: {icon:'icon'}
            };
            const container = shallow(<Item {...defaultProps}/>);
            const instance = container.instance();

            // Act
            const result = instance.getScores(match);

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('return correctly when status = Cancel', () => {
            // Arrange
            const match = {
                matchId: 1,
                startTime: '2022-06-12',
                homeTeamTotalScore: 1,
                awayTeamTotalScore: 1,
                status: 64,
                league: {icon: 'icon'},
                homeTeam: {icon:'icon'},
                awayTeam: {icon:'icon'}
            }
            const container = shallow(<Item {...defaultProps}/>);
            const instance = container.instance();

            // Act
            const result = instance.getScores(match);

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('return correctly when status = TBD', () => {
            // Arrange
            const match = {
                matchId: 1,
                startTime: '2022-06-12',
                homeTeamTotalScore: 1,
                awayTeamTotalScore: 1,
                status: 99,
                league: {icon: 'icon'},
                homeTeam: {icon:'icon'},
                awayTeam: {icon:'icon'}
            };
            const container = shallow(<Item {...defaultProps}/>);
            const instance = container.instance();

            // Act
            const result = instance.getScores(match);

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('return correctly when status = finished', () => {
            // Arrange
            const match = {
                matchId: 1,
                startTime: '2022-06-12',
                homeTeamTotalScore: 1,
                awayTeamTotalScore: 1,
                status: 50,
                league: {icon: 'icon'},
                homeTeam: {icon:'icon'},
                awayTeam: {icon:'icon'}
            };
            const container = shallow(<Item {...defaultProps}/>);
            const instance = container.instance();

            // Act
            const result = instance.getScores(match);

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('return correctly when match has extra score', () => {
            // Arrange
            const match = {
                matchId: 1,
                startTime: '2022-06-12',
                homeTeamTotalScore: 1,
                awayTeamTotalScore: 1,
                homeTeamExtraScore: 1,
                awayTeamExtraScore: 2,
                status: 50,
                league: {icon: 'icon'},
                homeTeam: {icon:'icon'},
                awayTeam: {icon:'icon'}
            };
            const container = shallow(<Item {...defaultProps}/>);
            const instance = container.instance();

            // Act
            const result = instance.getScores(match);

            // Assert
            expect(result).toMatchSnapshot();
        });
    });

    describe('renders', () => {
        it('render correctly when is Live match', () => {
            // Arrange
            const props = {
                ...defaultProps,
                match: {startTime: '2022-10-10', status: 20, homeTeam: {teamId: 1, icon: 'icon'}, awayTeam: {teamId: 1, icon: 'icon'}}
            }
            CommonFunctions.getMatchResult = jest.fn().mockReturnValue(1);
            CommonFunctions.isLiveMatch = jest.fn().mockReturnValue(true);
            const container = shallow(<Item {...props} />);
            const instance = container.instance();
            

            // Act
            const result = instance.render();

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('render correctly when is pre match', () => {
            // Arrange
            const props = {
                ...defaultProps,
                match: {startTime: '2022-10-10', status: 20, homeTeam: {teamId: 1, icon: 'icon'}, awayTeam: {teamId: 1, icon: 'icon'}}
            }
            CommonFunctions.getMatchResult = jest.fn().mockReturnValue(2);
            CommonFunctions.isLiveMatch = jest.fn().mockReturnValue(false);
            const container = shallow(<Item {...props} />);
            const instance = container.instance();

            // Act
            const result = instance.render();

            // Assert
            expect(result).toMatchSnapshot();
        });
    });
})