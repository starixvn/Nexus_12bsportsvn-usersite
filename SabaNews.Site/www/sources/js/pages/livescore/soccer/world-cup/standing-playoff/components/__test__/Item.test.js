import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import Item from '../Item';
import CommonFunctions from '@jsroot/common/common-functions';
import DateTimeService from '@jsroot/common/dateTimeService';
import Site from '@jsroot/common/site';

describe('Item', () => {
    const defaultProps = {
        match: {},
        positionClass: '',
        index: 0
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getScore', () => {
        it('return correctly when match finished', () => {
            // Arrange
            const container = shallow(<Item {...defaultProps} />);
            const match = { matchId: 1, status: 50, secondLeg: { matchId: 1 } }
            const instance = container.instance(match, true);

            // Act
            const result = instance.getScore(match);

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('return correctly when match not started', () => {
            // Arrange
            const container = shallow(<Item {...defaultProps} />);
            const match = { matchId: 1, status: 0, secondLeg: { matchId: 1 } }
            const instance = container.instance(match, false);

            // Act
            const result = instance.getScore(match);

            // Assert
            expect(result).toMatchSnapshot();
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
            const match = {
                matchId: 1,
                startTime: '2022-10-10',
                homeTeamTotalScore: 1,
                awayTeamTotalScore: 2,
                status: 0,
                homeTeam: {teamId: 1, teamNameEN: 'team name'},
                awayTeam: {teamId: 2, teamNameEN: 'team name'},
                secondLeg: {
                    matchId: 1,
                    homeTeam: {teamId: 1, teamNameEN: 'team name'},
                    awayTeam: {teamId: 2, teamNameEN: 'team name'}
                }
            }
            const props = {
                ...defaultProps,
                match: match
            }
            window.open = jest.fn();
            CommonFunctions.getMatchDetailPageUrl = jest.fn().mockReturnValue('url');
            const container = shallow(<Item {...props} />);

            // Act
            container.find('.bracket').simulate('click', event, match);

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
            const match = {
                matchId: 1,
                startTime: '2022-10-10',
                homeTeamTotalScore: 1,
                awayTeamTotalScore: 2,
                status: 0,
                homeTeam: {teamId: 1, teamNameEN: 'team name'},
                awayTeam: {teamId: 2, teamNameEN: 'team name'},
                secondLeg: {
                    matchId: 1,
                    homeTeam: {teamId: 1, teamNameEN: 'team name'},
                    awayTeam: {teamId: 2, teamNameEN: 'team name'}
                }
            }
            const props = {
                ...defaultProps,
                match: match
            }
            CommonFunctions.getMatchDetailPageUrl = jest.fn().mockReturnValue('url');
            window.open = jest.fn();
            const container = shallow(<Item {...props} />);

            // Act
            container.find('.bracket').simulate('click', event, match);

            // Assert
            expect(window.open).toHaveBeenCalledWith('url', '_blank');
        });
    });

    describe('getTeamName', () => {
        it('return correctly when dont have team data', () => {
            // Arrange
            const container = shallow(<Item {...defaultProps} />);
            const instance = container.instance();

            // Act
            const result = instance.getTeamName(null)
            // Assert
            expect(result).toEqual('');
        });

        it('return correctly when have team data', () => {
            // Arrange
            const container = shallow(<Item {...defaultProps} />);
            const instance = container.instance();

            // Act
            const result = instance.getTeamName({ teamNameEN: 'EN' })
            // Assert
            expect(result).toEqual('EN');
        });
    });


    

    describe('getResultClass', () => {
        it('return correctly class when isHome = true, and homeTeam win', () => {
            // Arrange
            const matchResult = 1;
            const props = {
                ...defaultProps,
                match: {status: 50}
            };
            const container = shallow(<Item {...props} />);
            const instance = container.instance();

            // Act
            const result = instance.getResultClass(matchResult, true)
            // Assert
            expect(result).toEqual('win');
        });

        it('return correctly class when isHome = false, and homeTeam lose', () => {
            // Arrange
            const matchResult = 2;
            const props = {
                ...defaultProps,
                match: {status: 50}
            };
            const container = shallow(<Item {...props} />);
            const instance = container.instance();

            // Act
            const result = instance.getResultClass(matchResult, false)
            // Assert
            expect(result).toEqual('win');
        });

        it('return correctly class when isHome = false, and homeTeam draw', () => {
            // Arrange
            const matchResult = 0;
            const container = shallow(<Item {...defaultProps} />);
            const instance = container.instance();

            // Act
            const result = instance.getResultClass(matchResult, false)
            // Assert
            expect(result).toEqual('');
        });
    });

    describe('renderBody', () => {
        it('render correctly when match has secondLeg', () => {
            // Arrange
            const match = {
                matchId: 1,
                startTime: '2022-10-10',
                homeTeamTotalScore: 1,
                awayTeamTotalScore: 2,
                status: 0,
                homeTeam: {teamId: 1, teamNameEN: 'team name'},
                awayTeam: {teamId: 2, teamNameEN: 'team name'},
                secondLeg: {matchId: 1}
            }
            CommonFunctions.getMatchResult = jest.fn().mockReturnValue(1);
            const container = shallow(<Item {...defaultProps} />);
            const instance = container.instance();
            instance.setState({isHighLight: true});

            // Act
            const result = instance.renderBody(match);
            // Assert
            expect(result).toMatchSnapshot();
        });

        it('render correctly when match is not have id', () => {
            // Arrange
            const match = {
                startTime: '2022-10-10',
                homeTeamTotalScore: 1,
                awayTeamTotalScore: 2,
                status: 0,
                homeTeam: {teamNameEN: 'team name'},
                awayTeam: {teamNameEN: 'team name'},
                secondLeg: {matchId: 1}
            }
            CommonFunctions.getMatchResult = jest.fn().mockReturnValue(1);
            const container = shallow(<Item {...defaultProps} />);
            const instance = container.instance();
            instance.setState({isHighLight: false});

            // Act
            const result = instance.renderBody(match);
            // Assert
            expect(result).toMatchSnapshot();
        });
    });

    describe('renders', () => {
        it('render correctly when isHighLight is false', () => {
            // Arrange
            const match = {
                startTime: '2022-10-10',
                homeTeamTotalScore: 1,
                awayTeamTotalScore: 2,
                status: 0,
                homeTeam: {teamNameEN: 'team name'},
                awayTeam: {teamNameEN: 'team name'},
                secondLeg: {matchId: 1},
                isDraw: false
            }
            const props = {
                ...defaultProps,
                match: match
            };
            const container = shallow(<Item {...props} />);
            const instance = container.instance();
            instance.renderBody = jest.fn().mockReturnValue('render body');
            instance.setState({isHighLight: false})

            // Act
            const result = instance.render();
            // Assert
            expect(result).toMatchSnapshot();
        });

        it('render correctly when isHighLight is true', () => {
            // Arrange
            const match = {
                matchId: 1,
                startTime: '2022-10-10',
                homeTeamTotalScore: 1,
                awayTeamTotalScore: 2,
                status: 0,
                homeTeam: {teamId: 1,teamNameEN: 'team name'},
                awayTeam: {teamId: 1,teamNameEN: 'team name'},
            }
            const props = {
                ...defaultProps,
                match: match
            };
            const event = {
                target: { className: '' },
                ctrlKey: false
            };
            CommonFunctions.getMatchResult = jest.fn().mockReturnValue(1);
            const container = shallow(<Item {...props} />);
            const instance = container.instance();
            instance.renderBody = jest.fn().mockReturnValue('render body');
            instance.setState({isHighLight: true})

            // Act
            const result = shallow(instance.render());
            // Assert
            expect(result).toMatchSnapshot();
        });
    });
});