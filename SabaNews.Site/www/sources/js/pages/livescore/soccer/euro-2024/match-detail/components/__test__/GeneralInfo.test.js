import React , { Fragment } from 'react';
import { shallow } from 'enzyme';
import dayjs from 'dayjs';
import toJson from 'enzyme-to-json';
import GeneralInfo from '../GeneralInfo';
import DateTimeService from '@jsroot/common/dateTimeService';
import CommonFunctions from '@jsroot/common/common-functions';
import Site from '@jsroot/common/site';

describe('GeneralInfo', () => {
    let defaultProps = {
        match: {
            generalInfo: {
                matchId: 1,
                startTime: '2022-06-12',
                homeTeam: {icon:'icon'},
                awayTeam: {icon:'icon'},
                league: {icon: 'icon', leagueNameVN: 'league'}
            },
            incidents: [],
            lineup: null,
            statistic: {homeStatistic: [], awayStatistic: []}
        },
        setActiveTab: jest.fn(() => ''),
        onUpdateFavLeague: jest.fn()
    };
    beforeEach(() => {
        var meta = document.createElement('meta');
        meta.setAttribute('name', 'description');
        document.head.appendChild(meta);

        Site.resolveClientUrl = jest.fn(url => url);
        CommonFunctions.isLiveMatch = jest.fn(() => false);
        CommonFunctions.getLeagueName = jest.fn(() => 'World Cup');

        CommonFunctions.getLeagueNameWithStage = jest.fn(() => 'World Cup');

        CommonFunctions.getTeamName = jest.fn().mockReturnValueOnce('Belgium').mockReturnValueOnce('Croatia');
        CommonFunctions.getStageName = jest.fn().mockReturnValue('Stage');
        DateTimeService.convertFromUTC = jest.fn().mockReturnValue(dayjs(new Date("2022-06-01")));

        Site.toSlug = jest.fn();
        Site.toSlug.mockReturnValueOnce('world-cup').mockReturnValueOnce('belgium').mockReturnValueOnce('croatia');
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getMatchScores', () => {
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
            const container = shallow(<GeneralInfo {...props}/>);
            const instance = container.instance();

            // Act
            const result = instance.getMatchScores();

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('return correctly when status = Delay', () => {
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
                        status: 60,
                        league: {icon: 'icon'},
                        homeTeam: {icon:'icon'},
                        awayTeam: {icon:'icon'}
                    }
                }
            };
            const container = shallow(<GeneralInfo {...props}/>);
            const instance = container.instance();
            instance.getBallAndCardNumber = jest.fn().mockReturnValue('ball');

            // Act
            const result = instance.getMatchScores();

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('return correctly when status = Postpone', () => {
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
                        status: 63,
                        league: {icon: 'icon'},
                        homeTeam: {icon:'icon'},
                        awayTeam: {icon:'icon'}
                    }
                }
            };
            const container = shallow(<GeneralInfo {...props}/>);
            const instance = container.instance();
            instance.getBallAndCardNumber = jest.fn().mockReturnValue('ball');

            // Act
            const result = instance.getMatchScores();

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('return correctly when status = Cancel', () => {
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
                        status: 64,
                        league: {icon: 'icon'},
                        homeTeam: {icon:'icon'},
                        awayTeam: {icon:'icon'}
                    }
                }
            };
            const container = shallow(<GeneralInfo {...props}/>);
            const instance = container.instance();

            // Act
            const result = instance.getMatchScores();

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('return correctly when status = TBD', () => {
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
                        status: 99,
                        league: {icon: 'icon'},
                        homeTeam: {icon:'icon'},
                        awayTeam: {icon:'icon'}
                    }
                }
            };
            const container = shallow(<GeneralInfo {...props}/>);
            const instance = container.instance();

            // Act
            const result = instance.getMatchScores();

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('return correctly when status = finished', () => {
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
                        status: 50,
                        league: {icon: 'icon'},
                        homeTeam: {icon:'icon'},
                        awayTeam: {icon:'icon'}
                    }
                }
            };
            const container = shallow(<GeneralInfo {...props}/>);
            const instance = container.instance();

            // Act
            const result = instance.getMatchScores();

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('return correctly when match has extra score', () => {
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
                        homeTeamExtraScore: 1,
                        awayTeamExtraScore: 2,
                        status: 50,
                        league: {icon: 'icon'},
                        homeTeam: {icon:'icon'},
                        awayTeam: {icon:'icon'}
                    }
                }
            };
            const container = shallow(<GeneralInfo {...props}/>);
            const instance = container.instance();

            // Act
            const result = instance.getMatchScores();

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
            const container = shallow(<GeneralInfo {...defaultProps}/>);
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
            const container = shallow(<GeneralInfo {...defaultProps}/>);
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
            const container = shallow(<GeneralInfo {...defaultProps}/>);
            const instance = container.instance();

            // Act
            const result = instance.getAggregateScore(match);

            // Assert
            expect(result).toMatchSnapshot();
        });
    });

    describe('getPenaltyScore', () => {
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
            const container = shallow(<GeneralInfo {...defaultProps}/>);
            const instance = container.instance();

            // Act
            const result = instance.getPenaltyScore(match);

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
            const container = shallow(<GeneralInfo {...defaultProps}/>);
            const instance = container.instance();

            // Act
            const result = instance.getPenaltyScore(match);

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
            const container = shallow(<GeneralInfo {...defaultProps}/>);
            const instance = container.instance();

            // Act
            const result = instance.getPenaltyScore(match);

            // Assert
            expect(result).toMatchSnapshot();
        });
    });

    describe('getSubScore', () => {
        it('return correctly when is PreMatch', () => {
            const props = {
                ...defaultProps,
                match: {
                    ...defaultProps.match,
                    generalInfo: {
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
                }
            };
            const container = shallow(<GeneralInfo {...props}/>);
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
                    ...defaultProps.match,
                    generalInfo: {
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
                }
            };
            const container = shallow(<GeneralInfo {...props}/>);
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
                    ...defaultProps.match,
                    generalInfo: {
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
                    statistic: {
                        homeStatistic: null,
                        awayStatistic: null
                    }
                }
            };
            const container = shallow(<GeneralInfo {...props}/>);
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
                    ...defaultProps.match,
                    generalInfo: {
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
                    statistic: {
                        homeStatistic: null,
                        awayStatistic: null
                    }
                }
            };
            const container = shallow(<GeneralInfo {...props}/>);
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
                    ...defaultProps.match,
                    generalInfo: {
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
                    statistic: {
                        homeStatistic: {redCard: 1, yellowCard: 1},
                        awayStatistic: {redCard: 1, yellowCard: 1}
                    }
                }
            };
            const container = shallow(<GeneralInfo {...props}/>);
            const instance = container.instance();
            // Act
            const result = instance.getBallAndCardNumber(1);

            // Assert
            expect(result).toMatchSnapshot();
        });
    });

    describe('getTeamStatus', () => {
        it('return nothing when hometeam not have agg & pen ', () => {
            const props = {
                ...defaultProps,
                match: {
                    ...defaultProps.match,
                    generalInfo: {
                        matchId: 1,
                        startTime: '2022-06-12',
                        homeTeamTotalScore: 1,
                        awayTeamTotalScore: 1,
                        status: 50,
                        league: {icon: 'icon'},
                        homeTeam: {icon:'icon'},
                        awayTeam: {icon:'icon'}
                    }
                }
            };
            const container = shallow(<GeneralInfo {...props}/>);
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
                    ...defaultProps.match,
                    generalInfo: {
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
                }
            };
            const container = shallow(<GeneralInfo {...props}/>);
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
                    ...defaultProps.match,
                    generalInfo: {
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
                }
            };
            const container = shallow(<GeneralInfo {...props}/>);
            const instance = container.instance();
            // Act
            const result = instance.getTeamStatus(false);

            // Assert
            expect(result).toEqual(<li>AGG</li>);
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
            const container = shallow(<GeneralInfo {...defaultProps} />);
            const instance = container.instance();
            // Act
            instance.handleClick(event);

            // Assert
            expect(window.open).toHaveBeenCalledWith('lich-thi-dau/bong-da', '_blank');
        });
        it('calls correctly when ctrlKey = false', () => {
            // Arrange
            const event = {
               ctrlKey: false
           };
           window.open = jest.fn();
           const container = shallow(<GeneralInfo {...defaultProps} />);
           const instance = container.instance();
           // Act
           instance.handleClick(event);

           // Assert
           expect(window.open).toHaveBeenCalledTimes(0);
           expect(window.location).toEqual('lich-thi-dau/bong-da');
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
            const container = shallow(<GeneralInfo {...defaultProps} />);
            const instance = container.instance();
            DateTimeService.formatDateTime = jest.fn().mockReturnValue('2022-06-01');

            // Act
            instance.handleClickLeague(event, league);

            // Assert
            expect(window.open).toHaveBeenCalledTimes(0);
            expect(window.location).toEqual('lich-thi-dau/bong-da/world-cup/12036/tong-hop');
        });

        it('redirect correctly when league has season', () => {
            // Arrange
            const event = {
                target: { className: 'livescore' }
            };
            window.open = jest.fn();
            const league = { leagueId: 12036, leagueNameVN: 'Euro', currentSeasonId: 123};
            DateTimeService.formatDateTime = jest.fn().mockReturnValue('2022-06-01');
            const container = shallow(<GeneralInfo {...defaultProps} />);
            const instance = container.instance();
            // Act
            instance.handleClickLeague(event, league);

            // Assert
            expect(window.open).toHaveBeenCalledTimes(0);
            expect(window.location).toEqual('lich-thi-dau/bong-da/world-cup/12036/tong-hop');
        });

        it('calls correctly when ctrlKey = true', () => {
            // Arrange
            const event = {
                target: { className: 'livescore' },
                ctrlKey: true
            };
            window.open = jest.fn();
            const league = { leagueId: 12036, leagueNameVN: 'Euro', currentSeasonId: 123};
            DateTimeService.formatDateTime = jest.fn().mockReturnValue('2022-06-01');
            const container = shallow(<GeneralInfo {...defaultProps} />);
            const instance = container.instance();
            // Act
            instance.handleClickLeague(event, league);

            // Assert
            expect(window.open).toHaveBeenCalledWith('lich-thi-dau/bong-da/world-cup/12036/tong-hop', '_blank');
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
            const container = shallow(<GeneralInfo {...defaultProps} />);
            const instance = container.instance();

            // Act
            instance.handleClickLeague(event, league);

            // Assert
            expect(window.open).toHaveBeenCalledTimes(0);
            expect(window.location).toEqual('lich-thi-dau/bong-da/world-cup/12036/tong-hop');
        });
    });

    describe('renderBody', () => {
        it('render correctly when match is preMatch', () => {
            // Arrange
            const container = shallow(<GeneralInfo {...defaultProps} />);
            CommonFunctions.isPreMatch = jest.fn().mockReturnValue(true);
            CommonFunctions.isLiveMatch = jest.fn().mockReturnValue(true);
            // Act
            expect(container).toMatchSnapshot();

        });

        it('render correctly when match is not preMatch', () => {
            // Arrange
            const container = shallow(<GeneralInfo {...defaultProps} />);
            const instance = container.instance();
            CommonFunctions.isPreMatch = jest.fn().mockReturnValue(false);
            CommonFunctions.isLiveMatch = jest.fn().mockReturnValue(false);
            // Act
            const result = instance.renderBody();

            // Assert
            expect(result).toMatchSnapshot();

        });

        it('render correctly when match status is Intermission', () => {
            // Arrange
            const generalInfo = {
                matchId: 1,
                startTime: '2022-06-12',
                homeTeam: {icon:'icon'},
                awayTeam: {icon:'icon'},
                league: {icon: 'icon', leagueNameVN: 'league'},
                status: 20
            };
            defaultProps.match.generalInfo = generalInfo;
            const container = shallow(<GeneralInfo {...defaultProps} />);
            const instance = container.instance();
            CommonFunctions.isPreMatch = jest.fn().mockReturnValue(false);
            CommonFunctions.isLiveMatch = jest.fn().mockReturnValue(true);
            // Act
            const result = instance.renderBody();

            // Assert
            expect(result).toMatchSnapshot();

        });
    });

    describe('getLeagueName', () => {
        it('return currectly name when  match round is zero', () => {
            // Arrange
            const  generalInfo = {
                matchId: 1,
                round: 0,
                startTime: '2022-06-12',
                homeTeamTotalScore: 1,
                awayTeamTotalScore: 1,
                homeTeamAggregateScore: 2,
                awayTeamAggregateScore: 3,
                status: 0,
                league: {icon: 'icon'},
                homeTeam: {icon:'icon'},
                awayTeam: {icon:'icon'},
                isSecondLeg: true
            }
            CommonFunctions.getStageName = jest.fn().mockReturnValue('Stage');
            const container = shallow(<GeneralInfo {...defaultProps} />);
            const instance = container.instance();
            // Act
            const result = instance.getLeagueName(generalInfo, true);

            // Assert
            expect(result).toEqual("Stage ");
        })

        it('return currectly name when match round > 0', () => {
            // Arrange
            const  generalInfo = {
                matchId: 1,
                round: 1,
                startTime: '2022-06-12',
                homeTeamTotalScore: 1,
                awayTeamTotalScore: 1,
                homeTeamAggregateScore: 2,
                awayTeamAggregateScore: 3,
                status: 0,
                league: {icon: 'icon'},
                homeTeam: {icon:'icon'},
                awayTeam: {icon:'icon'},
                isSecondLeg: true
            }
            CommonFunctions.getStageName = jest.fn().mockReturnValue('Stage');
            const container = shallow(<GeneralInfo {...defaultProps} />);
            const instance = container.instance();
            // Act
            const result = instance.getLeagueName(generalInfo, true);

            // Assert
            expect(result).toEqual("Stage - Turn 1");
        })
    });

    describe('getMatchTitle', () => {
        it('return correctly title when match in pre-match', () => {
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
                        homeTeamAggregateScore: 2,
                        awayTeamAggregateScore: 3,
                        status: 0,
                        league: {icon: 'icon'},
                        homeTeam: {icon:'icon'},
                        awayTeam: {icon:'icon'},
                        isSecondLeg: true
                    }
                }
            };
            CommonFunctions.getTeamName = jest.fn().mockReturnValue('Team');
            CommonFunctions.isPreMatch = jest.fn().mockReturnValue(true);
            const container = shallow(<GeneralInfo {...props} />);
            const instance = container.instance();
            // Act
            const result = instance.getMatchTitle();

            // Assert
            expect(result).toEqual("Fixture Team vs Team - World Cup - 01/06/2022");
        });

        it('return correctly title when match in live and have agg score', () => {
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
                        homeTeamAggregateScore: 2,
                        awayTeamAggregateScore: 3,
                        status: 0,
                        league: {icon: 'icon'},
                        homeTeam: {icon:'icon'},
                        awayTeam: {icon:'icon'},
                        isSecondLeg: true
                    }
                }
            };
            CommonFunctions.getTeamName = jest.fn().mockReturnValue('Team');
            CommonFunctions.isPreMatch = jest.fn().mockReturnValue(false);
            CommonFunctions.isLiveMatch = jest.fn().mockReturnValue(true);
            const container = shallow(<GeneralInfo {...props} />);
            const instance = container.instance();
            // Act
            const result = instance.getMatchTitle();

            // Assert
            expect(result).toEqual("Live Team 1-1 (AGG: 2-3) Team - World Cup - 01/06/2022");
        })

        it('return correctly title when match in post-match and have penalty score', () => {
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
                        homeTeamExtraScore: 2,
                        awayTeamExtraScore: 3,
                        homeTeamPenaltyScore: 4,
                        awayTeamPenaltyScore: 5,
                        status: 0,
                        league: {icon: 'icon'},
                        homeTeam: {icon:'icon'},
                        awayTeam: {icon:'icon'},
                        isSecondLeg: false
                    }
                }
            };
            CommonFunctions.getTeamName = jest.fn().mockReturnValue('Team');
            CommonFunctions.isPreMatch = jest.fn().mockReturnValue(false);
            CommonFunctions.isLiveMatch = jest.fn().mockReturnValue(false);
            const container = shallow(<GeneralInfo {...props} />);
            const instance = container.instance();
            // Act
            const result = instance.getMatchTitle();

            // Assert
            expect(result).toEqual("Result Team 2-3 (PEN: 4-5) Team - World Cup - 01/06/2022");
        })
    });

    describe('render', () => {
        it('render correctly when call function', () => {
            // Arrange
            const container = shallow(<GeneralInfo {...defaultProps} />);
            const instance = container.instance();

            // Act
            const result = instance.render();

            // Assert
            expect(result).toMatchSnapshot();
        });
    });
});
