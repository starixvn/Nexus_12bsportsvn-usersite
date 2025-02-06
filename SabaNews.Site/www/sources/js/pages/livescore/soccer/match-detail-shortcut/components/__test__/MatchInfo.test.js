import React, {Fragment} from 'react';
import { shallow } from 'enzyme';
import  MatchInfo  from '../MatchInfo';
import DateTimeService from '@jsroot/common/dateTimeService';
import CommonFunctions from '@jsroot/common/common-functions';


describe('AppContainer', () => {
    const defaultProps = {
        match: {
            matchId: 1,
            startTime: '2022-06-12',
            homeTeam: {icon:'icon'},
            awayTeam: {icon:'icon'},
            league: {icon: 'icon', leagueNameVN: 'league'}
        },
        incidents: [],
        getMatchDetail: jest.fn()
    };


    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getMainScore', () => {
        it('return correctly when status = NotStarted', () => {
            // Arrange
            const props = {
                ...defaultProps,
                match: {
                    ...defaultProps.match,
                    generalInfo: {
                        matchId: 1,
                        startTime: '2022-06-12',
                        homeTeamTotalScore: 1,
                        awayTeamTotalScore: 1,
                        status: 0,
                        league: {icon: 'icon'},
                        homeTeam: {icon:'icon'},
                        awayTeam: {icon:'icon'}
                    }
                }
            };
            const container = shallow(<MatchInfo {...props}/>);
            const instance = container.instance();

            // Act
            const result = instance.getMainScore();

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('return correctly when status = Delay', () => {
            // Arrange
            const props = {
                ...defaultProps,
                match: {
                    matchId: 1,
                    startTime: '2022-06-12',
                    homeTeamTotalScore: 1,
                    awayTeamTotalScore: 1,
                    status: 60,
                    league: {icon: 'icon'},
                    homeTeam: {icon:'icon'},
                    awayTeam: {icon:'icon'}
                }
            };
            const container = shallow(<MatchInfo {...props}/>);
            const instance = container.instance();
            instance.getBallAndCardNumber = jest.fn().mockReturnValue('ball');

            // Act
            const result = instance.getMainScore();

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('return correctly when status = Postpone', () => {
            // Arrange
            const props = {
                ...defaultProps,
                match:  {
                    matchId: 1,
                    startTime: '2022-06-12',
                    homeTeamTotalScore: 1,
                    awayTeamTotalScore: 1,
                    status: 63,
                    league: {icon: 'icon'},
                    homeTeam: {icon:'icon'},
                    awayTeam: {icon:'icon'}
                }
            };
            const container = shallow(<MatchInfo {...props}/>);
            const instance = container.instance();
            instance.getBallAndCardNumber = jest.fn().mockReturnValue('ball');

            // Act
            const result = instance.getMainScore();

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('return correctly when status = Cancel', () => {
            // Arrange
            const props = {
                ...defaultProps,
                match: {
                    matchId: 1,
                    startTime: '2022-06-12',
                    homeTeamTotalScore: 1,
                    awayTeamTotalScore: 1,
                    status: 64,
                    league: {icon: 'icon'},
                    homeTeam: {icon:'icon'},
                    awayTeam: {icon:'icon'}
                }
            };
            const container = shallow(<MatchInfo {...props}/>);
            const instance = container.instance();

            // Act
            const result = instance.getMainScore();

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('return correctly when status = TBD', () => {
            // Arrange
            const props = {
                ...defaultProps,
                match: {
                    matchId: 1,
                    startTime: '2022-06-12',
                    homeTeamTotalScore: 1,
                    awayTeamTotalScore: 1,
                    status: 99,
                    league: {icon: 'icon'},
                    homeTeam: {icon:'icon'},
                    awayTeam: {icon:'icon'}
                }
            };
            const container = shallow(<MatchInfo {...props}/>);
            const instance = container.instance();

            // Act
            const result = instance.getMainScore();

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('return correctly when status = finished', () => {
            // Arrange
            const props = {
                ...defaultProps,
                match: {
                    matchId: 1,
                    startTime: '2022-06-12',
                    homeTeamTotalScore: 1,
                    awayTeamTotalScore: 1,
                    status: 50,
                    league: {icon: 'icon'},
                    homeTeam: {icon:'icon'},
                    awayTeam: {icon:'icon'}
                }
            };
            const container = shallow(<MatchInfo {...props}/>);
            const instance = container.instance();

            // Act
            const result = instance.getMainScore();

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('return correctly when match has extra score', () => {
            // Arrange
            const props = {
                ...defaultProps,
                match: {
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
                }
            };
            const container = shallow(<MatchInfo {...props}/>);
            const instance = container.instance();

            // Act
            const result = instance.getMainScore();

            // Assert
            expect(result).toMatchSnapshot();
        });

    });

    describe('getAggregateScore', () => {
        it('return null when dont have aggscore', () => {
            const match = {
                matchId: 1,
                startTime: '2022-06-12',
                homeTeamTotalScore: 1,
                awayTeamTotalScore: 1,
                homeTeamPenaltyScore: 1,
                awayTeamPenaltyScore: 2,
                status: 0,
                league: {icon: 'icon'},
                homeTeam: {icon:'icon'},
                awayTeam: {icon:'icon'},
                isSecondLeg: false
            };
            const container = shallow(<MatchInfo {...defaultProps}/>);
            const instance = container.instance();

            // Act
            const result = instance.getAggregateScore(match);

            // Assert
            expect(result).toEqual(null);
        });

        it('return correctly when isSecondLeg = true and not have agg data ', () => {
            const match = {
                matchId: 1,
                startTime: '2022-06-12',
                homeTeamTotalScore: 1,
                awayTeamTotalScore: 1,
                homeTeamPenaltyScore: 1,
                awayTeamPenaltyScore: 2,
                status: 50,
                league: {icon: 'icon'},
                homeTeam: {icon:'icon'},
                awayTeam: {icon:'icon'},
                isSecondLeg: true
            };
            const container = shallow(<MatchInfo {...defaultProps}/>);
            const instance = container.instance();

            // Act
            const result = instance.getAggregateScore(match);

            // Assert
            expect(result).toEqual(null);
        });

        it('return correctly when have aggscore', () => {
            const match = {
                matchId: 1,
                startTime: '2022-06-12',
                homeTeamTotalScore: 1,
                awayTeamTotalScore: 1,
                homeTeamPenaltyScore: 1,
                awayTeamPenaltyScore: 2,
                homeTeamAggregateScore: 2,
                awayTeamAggregateScore: 3,
                status: 50,
                league: {icon: 'icon'},
                homeTeam: {icon:'icon'},
                awayTeam: {icon:'icon'},
                isSecondLeg: true
            };
            const container = shallow(<MatchInfo {...defaultProps}/>);
            const instance = container.instance();

            // Act
            const result = instance.getAggregateScore(match);

            // Assert
            expect(result).toMatchSnapshot();
        });
    });
    describe('getTeamStatus', () => {
        it('return nothing when hometeam not have agg & pen ', () => {
            const props = {
                ...defaultProps,
                match:  {
                    matchId: 1,
                    startTime: '2022-06-12',
                    homeTeamTotalScore: 1,
                    awayTeamTotalScore: 1,
                    status: 50,
                    league: {icon: 'icon'},
                    homeTeam: {icon:'icon'},
                    awayTeam: {icon:'icon'}
                }
            };
            const container = shallow(<MatchInfo {...props}/>);
            const instance = container.instance();
            // Act
            const result = instance.getTeamStatus(true);

            // Assert
            expect(result).toEqual(<Fragment />);
        });

        it('return correctly when hometeam has pen ', () => {
            const props = {
                ...defaultProps,
                match: {
                    matchId: 1,
                    startTime: '2022-06-12',
                    homeTeamTotalScore: 1,
                    awayTeamTotalScore: 1,
                    homeTeamPenaltyScore: 3,
                    awayTeamPenaltyScore: 2,
                    status: 50,
                    league: {icon: 'icon'},
                    homeTeam: {icon:'icon'},
                    awayTeam: {icon:'icon'}
                }
            };
            const container = shallow(<MatchInfo {...props}/>);
            const instance = container.instance();
            // Act
            const result = instance.getTeamStatus(true);

            // Assert
            expect(result).toEqual(<li>PEN</li>);
        });

        it('return correctly when awayteam has agg ', () => {
            const props = {
                ...defaultProps,
                match: {
                    matchId: 1,
                    startTime: '2022-06-12',
                    homeTeamTotalScore: 1,
                    awayTeamTotalScore: 1,
                    homeTeamAggregateScore: 2,
                    awayTeamAggregateScore: 3,
                    status: 50,
                    league: {icon: 'icon'},
                    homeTeam: {icon:'icon'},
                    awayTeam: {icon:'icon'},
                    isSecondLeg: true
                }
            };
            const container = shallow(<MatchInfo {...props}/>);
            const instance = container.instance();
            // Act
            const result = instance.getTeamStatus(false);

            // Assert
            expect(result).toEqual(<li>AGG</li>);
        });
    });

    describe('getPenScore', () => {
        it('return correctly when have penalty score', () => {
            const match = {
                matchId: 1,
                startTime: '2022-06-12',
                homeTeamTotalScore: 1,
                awayTeamTotalScore: 1,
                homeTeamPenaltyScore: 1,
                awayTeamPenaltyScore: 2,
                status: 50,
                league: {icon: 'icon'},
                homeTeam: {icon:'icon'},
                awayTeam: {icon:'icon'}
            };
            const container = shallow(<MatchInfo {...defaultProps}/>);
            const instance = container.instance();

            // Act
            const result = instance.getPenScore(match);

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('return null when dont have penalty score', () => {
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
            const container = shallow(<MatchInfo {...defaultProps}/>);
            const instance = container.instance();

            // Act
            const result = instance.getPenScore(match);

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('return null when match not finished', () => {
            const match = {
                matchId: 1,
                startTime: '2022-06-12',
                homeTeamTotalScore: 1,
                awayTeamTotalScore: 1,
                status: 50,
                league: {icon: 'icon'},
                homeTeam: {icon:'icon'},
                awayTeam: {icon:'icon'}
            }
            const container = shallow(<MatchInfo {...defaultProps}/>);
            const instance = container.instance();

            // Act
            const result = instance.getPenScore(match);

            // Assert
            expect(result).toMatchSnapshot();
        });
    });

    describe('getSubScore', () => {
        it('return correctly when is PreMatch', () => {
            const props = {
                ...defaultProps,
                match:{
                    matchId: 1,
                    startTime: '2022-06-12',
                    homeTeamHalfScore: 0,
                    awayTeamHalfScore: 1,
                    homeTeamTotalScore: 1,
                    awayTeamTotalScore: 1,
                    status: 0,
                    league: {icon: 'icon'},
                    homeTeam: {icon:'icon'},
                    awayTeam: {icon:'icon'}
                }
            };
            const container = shallow(<MatchInfo {...props}/>);
            const instance = container.instance();
            instance.getAggregateScore = jest.fn().mockReturnValue('AGG');
            instance.getPenaltyScore = jest.fn().mockReturnValue('pen');
            CommonFunctions.isPreMatch = jest.fn().mockReturnValue(true);
            // Act
            const result = instance.getSubScore();

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('return correctly when match finished', () => {
            const props = {
                ...defaultProps,
                match: {
                    matchId: 1,
                    startTime: '2022-06-12',
                    homeTeamHalfScore: 0,
                    awayTeamHalfScore: 1,
                    homeTeamTotalScore: 1,
                    awayTeamTotalScore: 1,
                    status: 50,
                    league: {icon: 'icon'},
                    homeTeam: {icon:'icon'},
                    awayTeam: {icon:'icon'}
                }
            };
            const container = shallow(<MatchInfo {...props}/>);
            const instance = container.instance();
            instance.getAggregateScore = jest.fn().mockReturnValue('AGG');
            instance.getPenaltyScore = jest.fn().mockReturnValue('pen');
            CommonFunctions.isPreMatch = jest.fn().mockReturnValue(true);
            // Act
            const result = instance.getSubScore();

            // Assert
            expect(result).toMatchSnapshot();
        });
    });

    describe('getBallAndCardNumber', () => {
        it('return correctly when home team dont have any goals & card', () => {
            const props = {
                ...defaultProps,
                match: {
                    matchId: 1,
                    startTime: '2022-06-12',
                    homeTeamHalfScore: 0,
                    awayTeamHalfScore: 1,
                    homeTeamTotalScore: 1,
                    awayTeamTotalScore: 1,
                    status: 50,
                    league: {icon: 'icon'},
                    homeTeam: {icon:'icon'},
                    awayTeam: {icon:'icon'}
                },
                incidents: [],
            };
            const container = shallow(<MatchInfo {...props}/>);
            const instance = container.instance();
            // Act
            const result = instance.getBallAndCardNumber(1);

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('return correctly when away team dont have any goals & card', () => {
            const props = {
                ...defaultProps,
            match: {
                    matchId: 1,
                    startTime: '2022-06-12',
                    homeTeamHalfScore: 0,
                    awayTeamHalfScore: 1,
                    homeTeamTotalScore: 1,
                    awayTeamTotalScore: 1,
                    status: 50,
                    league: {icon: 'icon'},
                    homeTeam: {icon:'icon'},
                    awayTeam: {icon:'icon'}
                }
            };
            const container = shallow(<MatchInfo {...props}/>);
            const instance = container.instance();
            // Act
            const result = instance.getBallAndCardNumber(2);

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('return correctly when team have goals & card', () => {
            const incidents = [
                { matchId: 1, type: 1, position: 1, time: 1, timeShow: 1, homeScore: 1, awayScore: 2 },
                { matchId: 1, type: 8, position: 2, time: -1, timeShow: 2, homeScore: 2, awayScore: 2 },
                { matchId: 1, type: 17, position: 1, time: -2, timeShow: 3, homeScore: 3, awayScore: 2},
                { matchId: 1, type: 8, position: 1, time: 0, timeShow: 3, homeScore: 0, awayScore: 0}
            ];
            const props = {
                ...defaultProps,
                match: {
                    matchId: 1,
                    startTime: '2022-06-12',
                    homeTeamHalfScore: 0,
                    awayTeamHalfScore: 1,
                    homeTeamTotalScore: 1,
                    awayTeamTotalScore: 1,
                    status: 50,
                    league: {icon: 'icon'},
                    homeTeam: {icon:'icon'},
                    awayTeam: {icon:'icon'}
                },
                incidents: incidents,
            };
            const container = shallow(<MatchInfo {...props}/>);
            const instance = container.instance();
            // Act
            const result = instance.getBallAndCardNumber(1);

            // Assert
            expect(result).toMatchSnapshot();
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


        it('calls correctly when ctrlKey = true', () => {
            // Arrange
            const event = {
                target: { className: 'livescore' },
                ctrlKey: true
            };
            window.open = jest.fn();
            const league = { leagueId: 12036, leagueNameVN: 'Euro', currentSeasonId: 123};
            CommonFunctions.getLeaguePageUrl = jest.fn().mockReturnValue('url');
            const container = shallow(<MatchInfo {...defaultProps} />);
            const instance = container.instance();
            // Act
            instance.handleClickLeague(event, league);

            // Assert
            expect(window.open).toHaveBeenCalledWith('url', '_blank');
        });

        it('calls correctly when ctrlKey = false', () => {
            // Arrange
            const event = {
                target: { className: 'livescore' },
                ctrlKey: false
            };
            window.open = jest.fn();
            const league = { leagueId: 12036, leagueNameVN: 'Euro', currentSeasonId: 123};
            CommonFunctions.getLeaguePageUrl = jest.fn().mockReturnValue('url');
            const container = shallow(<MatchInfo {...defaultProps} />);
            const instance = container.instance();

            // Act
            instance.handleClickLeague(event, league);

            // Assert
            expect(window.open).toHaveBeenCalledTimes(0);
            expect(window.location).toEqual('url');
        });
    });

    describe('handleClickDetail', () => {
        const { location } = window;

        beforeAll(() => {
            delete window.location;
            window.location = { href: '' };
        });

        afterAll(() => {
            window.location = location;
        });


        it('calls correctly when ctrlKey = true', () => {
            // Arrange
            const event = {
                target: { className: 'livescore' },
                ctrlKey: true
            };
            window.open = jest.fn();
            const league = { leagueId: 12036, leagueNameVN: 'Euro', currentSeasonId: 123};
            CommonFunctions.getMatchDetailPageUrl = jest.fn().mockReturnValue('url');
            const container = shallow(<MatchInfo {...defaultProps} />);
            const instance = container.instance();
            // Act
            instance.handleClickDetail(event, league);

            // Assert
            expect(window.open).toHaveBeenCalledWith('url', '_blank');
        });

        it('calls correctly when ctrlKey = false', () => {
            // Arrange
            const event = {
                target: { className: 'livescore' },
                ctrlKey: false
            };
            window.open = jest.fn();
            const league = { leagueId: 12036, leagueNameVN: 'Euro', currentSeasonId: 123};
            CommonFunctions.getMatchDetailPageUrl = jest.fn().mockReturnValue('url');
            const container = shallow(<MatchInfo {...defaultProps} />);
            const instance = container.instance();

            // Act
            instance.handleClickDetail(event, league);

            // Assert
            expect(window.open).toHaveBeenCalledTimes(0);
            expect(window.location).toEqual('url');
        });
    });


    describe('render', () => {
        it('render correctly when call function', () => {
            // Arrange
            const incidents = [
                { matchId: 1, type: 1, position: 1, time: 1, timeShow: 1, homeScore: 1, awayScore: 2 },
                { matchId: 1, type: 8, position: 2, time: -1, timeShow: 2, homeScore: 2, awayScore: 2 },
                { matchId: 1, type: 17, position: 1, time: -2, timeShow: 3, homeScore: 3, awayScore: 2},
                { matchId: 1, type: 8, position: 1, time: 0, timeShow: 3, homeScore: 0, awayScore: 0}
            ];
            const props = {
                ...defaultProps,
                match: {
                    matchId: 1,
                    startTime: '2022-06-12',
                    homeTeamHalfScore: 0,
                    awayTeamHalfScore: 1,
                    homeTeamTotalScore: 1,
                    awayTeamTotalScore: 1,
                    status: 50,
                    league: {icon: 'icon'},
                    homeTeam: {icon:'icon'},
                    awayTeam: {icon:'icon'}
                },
                incidents: incidents,
            };

            // Act
            const container = shallow(<MatchInfo {...props} />);

            // Assert
            container.find('.league').at(0).simulate('click',{ctrlKey: false} )
            container.find('.view-detail').at(0).simulate('click',{ctrlKey: false} )
            expect(container).toMatchSnapshot();
        });
    });



})