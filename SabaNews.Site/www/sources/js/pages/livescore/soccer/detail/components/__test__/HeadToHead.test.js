import React , { Fragment } from 'react';
import { shallow } from 'enzyme';
import dayjs from 'dayjs';
import toJson from 'enzyme-to-json';
import { HeadToHead } from '../HeadToHead';
import DateTimeService from '@jsroot/common/dateTimeService';
import CommonFunctions from '@jsroot/common/common-functions';


describe('HeadToHead', () => {
    const defaultProps = {
        match: {
            headTohead: {
                common: [],
                home: [],
                away: []
            }
        }
    }
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('getTeamStatus', () => {
        it('return correctly when match status != finished', () => {
            // Arrange
            const container = shallow(<HeadToHead {...defaultProps}/>);
            const instance = container.instance();
            const match = {
                homeTeamPenaltyScore: 3,
                awayTeamPenaltyScore: 2,
                status: 0
            }
            // Act
            const result = instance.getTeamStatus(true, match);

            // Assert
            expect(result).toEqual(<Fragment />);
        });

        it('return correctly when check home team has penalty score', () => {
            // Arrange
            const container = shallow(<HeadToHead {...defaultProps}/>);
            const instance = container.instance();
            const match = {
                homeTeamPenaltyScore: 3,
                awayTeamPenaltyScore: 2,
                status: 50
            }
            // Act
            const result = instance.getTeamStatus(true, match);

            // Assert
            expect(result).toEqual(<li>PEN</li>);
        });

        it('return correctly when check away team has penalty score', () => {
            // Arrange
            const container = shallow(<HeadToHead {...defaultProps}/>);
            const instance = container.instance();
            const match = {
                homeTeamPenaltyScore: 3,
                awayTeamPenaltyScore: 2,
                status: 50
            }
            // Act
            const result = instance.getTeamStatus(false, match);

            // Assert
            expect(result).toEqual(<Fragment />);
        });

        it('return correctly when has agg score', () => {
            // Arrange
            const container = shallow(<HeadToHead {...defaultProps}/>);
            const instance = container.instance();
            const match = {
                homeTeamAggregateScore: 3,
                awayTeamAggregateScore: 2,
                status: 50,
                isSecondLeg: true
            }
            // Act
            const result = instance.getTeamStatus(true, match);

            // Assert
            expect(result).toEqual(<li>AGG</li>);
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

        it('redirect correctly when league has no season', () => {
            // Arrange
            const event = {
                target: { className: 'icon-livescore' },
                ctrlKey: false
            };
            const league = { leagueId: 12036, leagueNameVN: 'Euro'};
            window.open = jest.fn();
            const container = shallow(<HeadToHead {...defaultProps} />);
            const instance = container.instance();
            DateTimeService.formatDateTime = jest.fn().mockReturnValue('2022-06-01');

            // Act
            instance.handleClickLeague(event, league);

            // Assert
            expect(window.open).toHaveBeenCalledTimes(0);
            expect(window.location).toEqual('/lich-thi-dau/bong-da/euro/12036/tong-hop');
        });

        it('redirect correctly when league has season', () => {
            // Arrange
            const event = {
                target: { className: 'livescore' }
            };
            window.open = jest.fn();
            const league = { leagueId: 12036, leagueNameVN: 'Euro', currentSeasonId: 123};
            DateTimeService.formatDateTime = jest.fn().mockReturnValue('2022-06-01');
            const container = shallow(<HeadToHead {...defaultProps} />);
            const instance = container.instance();
            // Act
            instance.handleClickLeague(event, league);

            // Assert
            expect(window.open).toHaveBeenCalledTimes(0);
            expect(window.location).toEqual('/lich-thi-dau/bong-da/euro/12036/tong-hop');
        });

        it('calls correctly when ctrlKey = true', () => {
            // Arrange
            const event = {
                target: { className: 'livescore' },
                ctrlKey: true
            };
            window.open = jest.fn();
            const league = { leagueId: 12036, leagueNameVN: 'Euro'};
            DateTimeService.formatDateTime = jest.fn().mockReturnValue('2022-06-01');
            const container = shallow(<HeadToHead {...defaultProps} />);
            const instance = container.instance();
            // Act
            instance.handleClickLeague(event, league);

            // Assert
            expect(window.open).toHaveBeenCalledWith('/lich-thi-dau/bong-da/euro/12036/tong-hop', '_blank');
        });

        it('calls correctly when ctrlKey = false', () => {
            // Arrange
            const event = {
                target: { className: 'livescore' },
                ctrlKey: false
            };
            window.open = jest.fn();
            const league = { leagueId: 12036, leagueNameVN: 'Euro', currentSeasonId: 123};
            DateTimeService.formatDateTime = jest.fn().mockReturnValue('2022-06-01');
            const container = shallow(<HeadToHead {...defaultProps} />);
            const instance = container.instance();

            // Act
            instance.handleClickLeague(event, league);

            // Assert
            expect(window.open).toHaveBeenCalledTimes(0);
            expect(window.location).toEqual('/lich-thi-dau/bong-da/euro/12036/tong-hop');
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
        it('calls correctly when ctrlKey = true', () => {
             // Arrange
             const event = {
                ctrlKey: true
            };
            window.open = jest.fn();
            const match = {
                matchId: 1,
                league: { leagueId: 12036, leagueNameVN: 'Euro', season: 123},
                homeTeam:  { teamNameEN: 'team1' },
                awayTeam: { teamNameEN: 'team2' }
            }
            const container = shallow(<HeadToHead {...defaultProps} />);
            const instance = container.instance();
            CommonFunctions.getLeagueName = jest.fn().mockReturnValue('league');
            CommonFunctions.getTeamName = jest.fn().mockReturnValue('team');
            // Act
            instance.handleClick(event, match);

            // Assert
            expect(window.open).toHaveBeenCalledWith('/lich-thi-dau/bong-da/league/team-vs-team/1', '_blank');
        });

        it('calls correctly when ctrlKey = false', () => {
            // Arrange
            const event = {
               ctrlKey: false
           };
           window.open = jest.fn();
           const match = {
               matchId: 1,
               league: { leagueId: 12036, leagueNameVN: 'Euro', season: 123},
               homeTeam:  { teamNameEN: 'team1' },
               awayTeam: { teamNameEN: 'team2' }
           }
           const container = shallow(<HeadToHead {...defaultProps} />);
           const instance = container.instance();
           CommonFunctions.getLeagueName = jest.fn().mockReturnValue('league');
           CommonFunctions.getTeamName = jest.fn().mockReturnValue('team');
           // Act
           instance.handleClick(event, match);

           // Assert
           expect(window.open).toHaveBeenCalledTimes(0);
           expect(window.location).toEqual('/lich-thi-dau/bong-da/league/team-vs-team/1');
       });
    });

    describe('getMatchStatus', () => {
        it('return correctly when check win & home team win ', () => {
            // Arrange
            const teamId = null;
            const match = {
                matchId: 1,
                homeTeam:  { teamId: 1 },
                awayTeam: { teamId: 2 }
            };
            const props = {
                ...defaultProps,
                match: {
                    generalInfo: {
                        matchId: 1,
                        homeTeam:  { teamId: 1 },
                        awayTeam: { teamId: 2 }
                    }
                }
            };
            const container = shallow(<HeadToHead {...props} />);
            const instance = container.instance();
            instance.getTeamResult = jest.fn().mockReturnValue(1)

           // Act
           const result = instance.getMatchStatus(teamId, match);

           // Assert
           expect(result.result).toEqual(-1);
           expect(result.homeWinclass).toEqual('win');
           expect(result.awayWinClass).toEqual('');
        });

        it('return correctly when check win & away team win', () => {
            // Arrange
            const teamId = 2;
            const match = {
                matchId: 1,
                homeTeam:  { teamId: 1 },
                awayTeam: { teamId: 2 }
            };
            const props = {
                ...defaultProps,
                match: {
                    generalInfo: {
                        matchId: 1,
                        homeTeam:  { teamId: 1 },
                        awayTeam: { teamId: 2 }
                    }
                }
            };
            const container = shallow(<HeadToHead {...props} />);
            const instance = container.instance();
            instance.getTeamResult = jest.fn().mockReturnValue(1)

           // Act
           const result = instance.getMatchStatus(teamId, match);

           // Assert
           expect(result.result).toEqual(1);
           expect(result.homeWinclass).toEqual('');
           expect(result.awayWinClass).toEqual('win');
        });

        it('return correctly when check win & no team win', () => {
            // Arrange
            const teamId = 2;
            const match = {
                matchId: 1,
                homeTeam:  { teamId: 1 },
                awayTeam: { teamId: 3 }
            };
            const props = {
                ...defaultProps,
                match: {
                    generalInfo: {
                        matchId: 1,
                        homeTeam:  { teamId: 1 },
                        awayTeam: { teamId: 2 }
                    }
                }
            };
            const container = shallow(<HeadToHead {...props} />);
            const instance = container.instance();
            instance.getTeamResult = jest.fn().mockReturnValue(1)

           // Act
           const result = instance.getMatchStatus(teamId, match);

           // Assert
           expect(result.result).toEqual(1);
           expect(result.homeWinclass).toEqual('');
           expect(result.awayWinClass).toEqual('');
        });

        it('return correctly when check lose & home team lose', () => {
            // Arrange
            const teamId = 1;
            const match = {
                matchId: 1,
                homeTeam:  { teamId: 1 },
                awayTeam: { teamId: 2 }
            };
            const props = {
                ...defaultProps,
                match: {
                    generalInfo: {
                        matchId: 1,
                        homeTeam:  { teamId: 1 },
                        awayTeam: { teamId: 2 }
                    }
                }
            };
            const container = shallow(<HeadToHead {...props} />);
            const instance = container.instance();
            instance.getTeamResult = jest.fn().mockReturnValue(2)

           // Act
           const result = instance.getMatchStatus(teamId, match);

           // Assert
           expect(result.result).toEqual(2);
           expect(result.homeWinclass).toEqual('');
           expect(result.awayWinClass).toEqual('win');
        });

        it('return correctly when check lose & away team lose', () => {
            // Arrange
            const teamId = 2;
            const match = {
                matchId: 1,
                homeTeam:  { teamId: 1 },
                awayTeam: { teamId: 2 }
            };
            const props = {
                ...defaultProps,
                match: {
                    generalInfo: {
                        matchId: 1,
                        homeTeam:  { teamId: 1 },
                        awayTeam: { teamId: 2 }
                    }
                }
            };
            const container = shallow(<HeadToHead {...props} />);
            const instance = container.instance();
            instance.getTeamResult = jest.fn().mockReturnValue(2)

           // Act
           const result = instance.getMatchStatus(teamId, match);

           // Assert
           expect(result.result).toEqual(2);
           expect(result.homeWinclass).toEqual('win');
           expect(result.awayWinClass).toEqual('');
        });

        it('return correctly when check lose & no team lose', () => {
            // Arrange
            const teamId = 2;
            const match = {
                matchId: 1,
                homeTeam:  { teamId: 1 },
                awayTeam: { teamId: 3 }
            };
            const props = {
                ...defaultProps,
                match: {
                    generalInfo: {
                        matchId: 1,
                        homeTeam:  { teamId: 1 },
                        awayTeam: { teamId: 2 }
                    }
                }
            };
            const container = shallow(<HeadToHead {...props} />);
            const instance = container.instance();
            instance.getTeamResult = jest.fn().mockReturnValue(2)

           // Act
           const result = instance.getMatchStatus(teamId, match);

           // Assert
           expect(result.result).toEqual(2);
           expect(result.homeWinclass).toEqual('');
           expect(result.awayWinClass).toEqual('');
        });
    });

    describe('renderBody', () => {
        it('return empty when matchs.length = 0', () => {
            // Arrange
            const matches = [];
            const teamId = 1;
            const container = shallow(<HeadToHead {...defaultProps} />);
            const instance = container.instance();

            // Act
            const result  = instance.renderBody(matches, teamId);

            // Assert
            expect(result).toEqual(null);
        });

        it('return correctly when teamId is null', () => {
            // Arrange
            const props = {
                ...defaultProps,
                match: {
                    generalInfo: {
                        matchId: 1,
                        homeTeam:  { teamId: 1 },
                        awayTeam: { teamId: 2 }
                    }
                }
            };
            const matches = [
                {
                    matchId: 1,
                    homeTeamTotalScore: 1,
                    awayTeamTotalScore: 2,
                    homeTeam: {teamId: 1},
                    awayTeam: {teamId: 2},
                    league: {icon:"icon", leagueNameEn: "league"},
                    startTime: '2019-10-05 11:30:00'
                },
                {
                    matchId: 1,
                    homeTeamTotalScore: 1,
                    awayTeamTotalScore: 2,
                    homeTeamExtraScore: 1,
                    awayTeamExtraScore: 2,
                    homeTeam: {teamId: 1},
                    awayTeam: {teamId: 2},
                    league: {icon:"icon", leagueNameEn: "league"},
                    startTime: '2019-10-05 11:30:00'
                }
            ];
            const teamId = null;
            const container = shallow(<HeadToHead {...props} />);
            const instance = container.instance();
            instance.renderStatistic = jest.fn().mockReturnValue('statistic');
            CommonFunctions.getLeagueNameWithStage = jest.fn();
            instance.getMatchStatus = jest.fn().mockReturnValue({result: 1, homeWinclass:'win', awayWinClass:''});
            instance.handleClickLeague = jest.fn();
            instance.handleClick = jest.fn();
            instance.getTeamStatus = jest.fn();
            // Act
            const result  = shallow(instance.renderBody(matches, teamId));
            result.find('.name-league').first().simulate('click');
            result.find('.group-match-item').first().simulate('click');

            // Assert
            expect(toJson(result)).toMatchSnapshot();
        });

        it('return correctly when has teamId', () => {
            // Arrange
            const props = {
                ...defaultProps,
                match: {
                    generalInfo: {
                        matchId: 1,
                        homeTeam:  { teamId: 1 },
                        awayTeam: { teamId: 2 }
                    }
                }
            };
            const matches = [
                {
                    matchId: 1,
                    homeTeamTotalScore: 1,
                    awayTeamTotalScore: 2,
                    homeTeam: {teamId: 1},
                    awayTeam: {teamId: 2},
                    league: {icon:"icon", leagueNameEn: "league"},
                    startTime: '2019-10-05 11:30:00'
                },
                {
                    matchId: 1,
                    homeTeamTotalScore: 3,
                    awayTeamTotalScore: 2,
                    homeTeamExtraScore: 3,
                    awayTeamExtraScore: 2,
                    homeTeam: {teamId: 1},
                    awayTeam: {teamId: 2},
                    league: {icon:"icon", leagueNameEn: "league"},
                    startTime: '2019-10-05 11:30:00'
                }
            ];
            const teamId = 1;
            const container = shallow(<HeadToHead {...props} />);
            const instance = container.instance();
            instance.renderStatistic = jest.fn().mockReturnValue('statistic');
            CommonFunctions.getLeagueNameWithStage = jest.fn();
            instance.getMatchStatus = jest.fn()
            .mockReturnValueOnce({result: 1, homeWinclass:'win', awayWinClass:''})
            .mockReturnValueOnce({result: 2, homeWinclass:'', awayWinClass:'win'})
            .mockReturnValueOnce({result: 3, homeWinclass:'win', awayWinClass:'win'})
            instance.handleClickLeague = jest.fn();
            instance.handleClick = jest.fn();
            instance.getTeamStatus = jest.fn();
            // Act
            const result  = shallow(instance.renderBody(matches, teamId));
            result.find('.name-league').first().simulate('click');
            result.find('.group-match-item').first().simulate('click');

            // Assert
            expect(toJson(result)).toMatchSnapshot();
        });
    });

    describe('getTeamResult', () => {
        it('return correctly when team is home team & win', () => {
            // Arrange
            const teamId = 1;
            const match = {
                matchId: 1,
                homeTeamTotalScore: 2,
                awayTeamTotalScore: 1,
                homeTeam: {teamId: 1},
                awayTeam: {teamId: 2},
                league: {icon:"icon", leagueNameEn: "league"}
            };
            const container = shallow(<HeadToHead {...defaultProps} />);
            const instance = container.instance();
            instance.getSubScoreResult = jest.fn().mockReturnValue(0);

            // Act
            const result = instance.getTeamResult(teamId, match);

            // Assert
            expect(result).toEqual(1);

        });
        it('return correctly when team is home team & lose', () => {
            // Arrange
            const teamId = 1;
            const match = {
                matchId: 1,
                homeTeamTotalScore: 1,
                awayTeamTotalScore: 2,
                homeTeam: {teamId: 1},
                awayTeam: {teamId: 2},
                league: {icon:"icon", leagueNameEn: "league"}
            };
            const container = shallow(<HeadToHead {...defaultProps} />);
            const instance = container.instance();
            instance.getSubScoreResult = jest.fn().mockReturnValue(0);

            // Act
            const result = instance.getTeamResult(teamId, match);

            // Assert
            expect(result).toEqual(2);

        });

        it('return correctly when team is home team, has extrascore', () => {
            // Arrange
            const teamId = 1;
            const match = {
                matchId: 1,
                homeTeamTotalScore: 1,
                awayTeamTotalScore: 2,
                homeTeam: {teamId: 1},
                awayTeam: {teamId: 2},
                league: {icon:"icon", leagueNameEn: "league"}
            };
            const container = shallow(<HeadToHead {...defaultProps} />);
            const instance = container.instance();
            instance.getSubScoreResult = jest.fn().mockReturnValue(0);

            // Act
            const result = instance.getTeamResult(teamId, match);

            // Assert
            expect(result).toEqual(2);

        });

        it('return correctly when team is away team & win', () => {
            // Arrange
            const teamId = 1;
            const match = {
                matchId: 1,
                homeTeamTotalScore: 1,
                awayTeamTotalScore: 2,
                homeTeam: {teamId: 2},
                awayTeam: {teamId: 1},
                league: {icon:"icon", leagueNameEn: "league"}
            };
            const container = shallow(<HeadToHead {...defaultProps} />);
            const instance = container.instance();
            instance.getSubScoreResult = jest.fn().mockReturnValue(0);

            // Act
            const result = instance.getTeamResult(teamId, match);

            // Assert
            expect(result).toEqual(1);

        });

        it('return correctly when team is away team & lose', () => {
            // Arrange
            const teamId = 1;
            const match = {
                matchId: 1,
                homeTeamTotalScore: 2,
                awayTeamTotalScore: 1,
                homeTeam: {teamId: 2},
                awayTeam: {teamId: 1},
                league: {icon:"icon", leagueNameEn: "league"}
            };
            const container = shallow(<HeadToHead {...defaultProps} />);
            const instance = container.instance();
            instance.getSubScoreResult = jest.fn().mockReturnValue(0);

            // Act
            const result = instance.getTeamResult(teamId, match);

            // Assert
            expect(result).toEqual(2);

        });

        it('return correctly when team is away team, has extra score', () => {
            // Arrange
            const teamId = 1;
            const match = {
                matchId: 1,
                homeTeamTotalScore: 2,
                awayTeamTotalScore: 1,
                homeTeamExtraScore: 3,
                awayTeamExtraScore: 4,
                homeTeam: {teamId: 2},
                awayTeam: {teamId: 1},
                league: {icon:"icon", leagueNameEn: "league"}
            };
            const container = shallow(<HeadToHead {...defaultProps} />);
            const instance = container.instance();
            instance.getSubScoreResult = jest.fn().mockReturnValue(0);

            // Act
            const result = instance.getTeamResult(teamId, match);

            // Assert
            expect(result).toEqual(1);

        });

        it('return correctly when score is draw', () => {
            // Arrange
            const teamId = 1;
            const match = {
                matchId: 1,
                homeTeamTotalScore: 2,
                awayTeamTotalScore: 2,
                homeTeam: {teamId: 2},
                awayTeam: {teamId: 1},
                league: {icon:"icon", leagueNameEn: "league"}
            };
            const container = shallow(<HeadToHead {...defaultProps} />);
            const instance = container.instance();
            instance.getSubScoreResult = jest.fn().mockReturnValue(0);

            // Act
            const result = instance.getTeamResult(teamId, match);

            // Assert
            expect(result).toEqual(0);

        });

        it('return correctly when has sub score', () => {
            // Arrange
            const teamId = 1;
            const match = {
                matchId: 1,
                homeTeamTotalScore: 2,
                awayTeamTotalScore: 2,
                homeTeam: {teamId: 2},
                awayTeam: {teamId: 1},
                league: {icon:"icon", leagueNameEn: "league"}
            };
            const container = shallow(<HeadToHead {...defaultProps} />);
            const instance = container.instance();
            instance.getSubScoreResult = jest.fn().mockReturnValue(1);

            // Act
            const result = instance.getTeamResult(teamId, match);

            // Assert
            expect(result).toEqual(1);

        });
    });

    describe('getSubScoreResult', () => {
        it('return correctly when hometeam win with penalty score', () => {
            // Arrange
            const match = {
                matchId: 1,
                homeTeamPenaltyScore: 3,
                awayTeamPenaltyScore: 2,
                homeTeam: {teamId: 2},
                awayTeam: {teamId: 1},
                league: {icon:"icon", leagueNameEn: "league"}
            };
            const homefieldName = 'homeTeam';
            const awayfieldName = 'awayTeam';
            const container = shallow(<HeadToHead {...defaultProps} />);
            const instance = container.instance();

            // Act
            const result = instance.getSubScoreResult(match, homefieldName, awayfieldName);

            // Assert
            expect(result).toEqual(1);
        });

        it('return correctly when hometeam lose with penalty score', () => {
            // Arrange
            const match = {
                matchId: 1,
                homeTeamPenaltyScore: 2,
                awayTeamPenaltyScore: 3,
                homeTeam: {teamId: 2},
                awayTeam: {teamId: 1},
                league: {icon:"icon", leagueNameEn: "league"}
            };
            const homefieldName = 'homeTeam';
            const awayfieldName = 'awayTeam';
            const container = shallow(<HeadToHead {...defaultProps} />);
            const instance = container.instance();

            // Act
            const result = instance.getSubScoreResult(match, homefieldName, awayfieldName);

            // Assert
            expect(result).toEqual(2);
        });

        it('return correctly when hometeam draw with penalty score', () => {
            // Arrange
            const match = {
                matchId: 1,
                homeTeamPenaltyScore: 3,
                awayTeamPenaltyScore: 3,
                homeTeam: {teamId: 2},
                awayTeam: {teamId: 1},
                league: {icon:"icon", leagueNameEn: "league"}
            };
            const homefieldName = 'homeTeam';
            const awayfieldName = 'awayTeam';
            const container = shallow(<HeadToHead {...defaultProps} />);
            const instance = container.instance();

            // Act
            const result = instance.getSubScoreResult(match, homefieldName, awayfieldName);

            // Assert
            expect(result).toEqual(0);
        });

        it('return correctly when hometeam win with agg score', () => {
            // Arrange
            const match = {
                matchId: 1,
                homeTeamAggregateScore: 4,
                awayTeamAggregateScore: 3,
                homeTeam: {teamId: 2},
                awayTeam: {teamId: 1},
                league: {icon:"icon", leagueNameEn: "league"},
                isSecondLeg: true
            };
            const homefieldName = 'homeTeam';
            const awayfieldName = 'awayTeam';
            const container = shallow(<HeadToHead {...defaultProps} />);
            const instance = container.instance();

            // Act
            const result = instance.getSubScoreResult(match, homefieldName, awayfieldName);

            // Assert
            expect(result).toEqual(1);
        });

        it('return correctly when hometeam lose with agg score', () => {
            // Arrange
            const match = {
                matchId: 1,
                homeTeamAggregateScore: 2,
                awayTeamAggregateScore: 3,
                homeTeam: {teamId: 2},
                awayTeam: {teamId: 1},
                league: {icon:"icon", leagueNameEn: "league"},
                isSecondLeg: true
            };
            const homefieldName = 'homeTeam';
            const awayfieldName = 'awayTeam';
            const container = shallow(<HeadToHead {...defaultProps} />);
            const instance = container.instance();

            // Act
            const result = instance.getSubScoreResult(match, homefieldName, awayfieldName);

            // Assert
            expect(result).toEqual(2);
        });

        it('return correctly when hometeam draw with agg score', () => {
            // Arrange
            const match = {
                matchId: 1,
                homeTeamAggregateScore: 3,
                awayTeamAggregateScore: 3,
                homeTeam: {teamId: 2},
                awayTeam: {teamId: 1},
                league: {icon:"icon", leagueNameEn: "league"},
                isSecondLeg: true
            };
            const homefieldName = 'homeTeam';
            const awayfieldName = 'awayTeam';
            const container = shallow(<HeadToHead {...defaultProps} />);
            const instance = container.instance();

            // Act
            const result = instance.getSubScoreResult(match, homefieldName, awayfieldName);

            // Assert
            expect(result).toEqual(0);
        });

        it('return correctly when has no sub score', () => {
            // Arrange
            const match = {
                matchId: 1,
                homeTeam: {teamId: 2},
                awayTeam: {teamId: 1},
                league: {icon:"icon", leagueNameEn: "league"},
                isSecondLeg: false,
            };
            const homefieldName = 'homeTeam';
            const awayfieldName = 'awayTeam';
            const container = shallow(<HeadToHead {...defaultProps} />);
            const instance = container.instance();

            // Act
            const result = instance.getSubScoreResult(match, homefieldName, awayfieldName);

            // Assert
            expect(result).toEqual(0);
        });
    });

    describe('renderStatistic', () => {
        it('', () => {
            // Arrange
            const props = {
                ...defaultProps,
                match: {
                    generalInfo: {
                        matchId: 1,
                        homeTeam:  { teamId: 1 },
                        awayTeam: { teamId: 2 }
                    }
                }
            };
            const matches = [
                { matchId: 1 },
                { matchId: 2 },
                { matchId: 3 }
            ];
            const container = shallow(<HeadToHead {...props} />);
            const instance = container.instance();
            instance.getTeamResult = jest.fn().mockReturnValueOnce(0).mockReturnValueOnce(1).mockReturnValueOnce(2);

            // Act
            const result = shallow(instance.renderStatistic(matches));

            // Assert
            expect(toJson(result)).toMatchSnapshot();
        });
    });

    describe('render', () => {
        it('return null when head to head common is null', () => {
            // Arrange
            const props =  {
                ...defaultProps,
                match: {
                    headTohead: {
                        common: [],
                        away: [{matchId: 2}],
                        home: [{matchId: 3}]
                    }
                }
            }
            const container = shallow(<HeadToHead {...props} />);

            // Assert
            expect(container.type()).toEqual(null);
        });
        it('return null when data is null', () => {
            // Arrange
            const props =  {
                ...defaultProps,
                match: {
                    headTohead: null
                }
            }
            const container = shallow(<HeadToHead {...props} />);

            // Assert
            expect(container.type()).toEqual(null);
        });
        it('render correctly when call functions', () => {
            // Arrange
            const match = {
                matchId: 1,
                homeTeam:  { teamId: 1 },
                awayTeam: {teamId: 2},
                league: {icon:'icon', leagueNameEN: 'league'}
            };
            const props =  {
                ...defaultProps,
                match: {
                    headToHead: {
                        common: [match],
                        away: [match],
                        home: [match]
                    },
                    generalInfo: {
                        matchId: 1,
                        homeTeam:  { teamId: 1 },
                        awayTeam: { teamId: 2 }
                    }
                }
            }
            const container = shallow(<HeadToHead {...props} />);
            const instance = container.instance();
            instance.renderBody = jest.fn();
            CommonFunctions.getTeamName = jest.fn()

            // Act
            const result = shallow(instance.render());

            // Assert
            expect(toJson(result)).toMatchSnapshot();
        });
    });
});