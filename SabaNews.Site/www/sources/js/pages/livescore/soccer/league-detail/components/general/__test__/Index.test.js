import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import General from '../Index';
import DateTimeService from '@jsroot/common/dateTimeService';
import CommonFunctions from '@jsroot/common/common-functions';
import LangHelper from '@jsroot/common/langHelper';


describe('Index', () => {
    const defaultProps = {
        league: null,
        stages: [],
        preMatches: [],
        postMatches: [],
        handleSelectTab: jest.fn()
    };
    beforeAll(() => {
        DateTimeService.convertFromUTC = jest.fn(date => date);
        DateTimeService.formatDateTime = jest.fn((date, format) => date);
        LangHelper.getResource = jest.fn(key => key);

        CommonFunctions.getStageName = jest.fn();
        CommonFunctions.getStageName.mockReturnValueOnce('1/4 Finals')
            .mockReturnValueOnce('Semi-finals')
            .mockReturnValueOnce('Finals');
    });

    afterAll(() => {
        jest.clearAllMocks();
    });

    describe('constructor', () => {
        it('inital correctly state', () => {
            // Act
            const instance = shallow(<General {...defaultProps} />).instance();

            // Assert
            expect(instance.state).toEqual({ searchKey: '' });
        });
    });

    describe('checkGroupLeagueType', () =>  {
        it('return correctly when leagueType is league', () => {
            // Arrange
            const stages = [{stageId: 1}];
            const matches = [{matchId: 1, round: 0}];
            const league = {leagueId: 1, leagueType: 1};
            const container = shallow(<General {...defaultProps} />);
            const instance = container.instance();

            // Act
            const result = instance.checkGroupLeagueType(stages, matches, league);

            // Assert
            expect(result).toEqual(true);
        });

        it('return false when stage > 1', () => {
            // Arrange
            const stages = [{stageId: 1}, {stageId: 2}];
            const matches = [{matchId: 1, round: 1}];
            const league = {leagueId: 1, leagueType: 2};
            const container = shallow(<General {...defaultProps} />);
            const instance = container.instance();

            // Act
            const result = instance.checkGroupLeagueType(stages, matches, league);

            // Assert
            expect(result).toEqual(false);
        });

        it('return false when not have any match round > 0', () => {
            // Arrange
            const stages = [{stageId: 1}, {stageId: 2}];
            const matches = [{matchId: 1, round: 0}];
            const league = {leagueId: 1, leagueType: 2};
            const container = shallow(<General {...defaultProps} />);
            const instance = container.instance();

            // Act
            const result = instance.checkGroupLeagueType(stages, matches, league);

            // Assert
            expect(result).toEqual(false);
        });

        it('return false when league type is cup', () => {
            // Arrange
            const stages = [{stageId: 1}, {stageId: 2}];
            const matches = [{matchId: 1, round: 0}];
            const league = {leagueId: 1, leagueType: 1};
            const container = shallow(<General {...defaultProps} />);
            const instance = container.instance();

            // Act
            const result = instance.checkGroupLeagueType(stages, matches, league);

            // Assert
            expect(result).toEqual(false);
        });
    });

    describe('isGroupByDate', () => {
        it('return correctly when stage.length = 0', () => {
             // Arrange
            const stages = [];
            const matches = [{matchId: 1, round: 0}];
            const league = {leagueId: 1, leagueType: 1};
            const container = shallow(<General {...defaultProps} />);
            const instance = container.instance();
            instance.checkGroupLeagueType = jest.fn().mockReturnValue(false);

            // Act
            const result = instance.isGroupByDate(stages, matches, league);

             // Assert
             expect(result).toEqual(true);
        });

        it('return correctly when stage.length = 0', () => {
            // Arrange
           const stages = [{stageId: 1}];
           const matches = [{matchId: 1, round: 0}];
           const league = {leagueId: 1, leagueType: 1};
           const container = shallow(<General {...defaultProps} />);
           const instance = container.instance();
           instance.checkGroupLeagueType = jest.fn().mockReturnValue(false);

           // Act
           const result = instance.isGroupByDate(stages, matches, league);

            // Assert
            expect(result).toEqual(false);
       });
    });

    describe('getRoundName', () => {
        it('return as expected when leagueType = League', () => {
            // Arrange
            const container = shallow(<General {...defaultProps} />);
            const instance = container.instance();

            // Act
            const result = instance.getRoundName(1, 1);

            // Assert
            expect(result).toEqual('Round 1');
        });

        it('return as expected when leagueType = Cup', () => {
            // Arrange
            const container = shallow(<General {...defaultProps} />);
            const instance = container.instance();

            // Act
            const result = instance.getRoundName(1, 2);

            // Assert
            expect(result).toEqual('Turn 1');
        });
    });

    describe('handleChangeSearchKey', () => {
        it('updates correctly state', () => {
            // Arrange
            const container = shallow(<General {...defaultProps} />);
            const instance = container.instance();

            // Act
            instance.handleChangeSearchKey({ target: { value: 'key' } });

            // Assert
            expect(instance.state).toEqual({ searchKey: 'key' });
        });
    });

    describe('groupMatchesByStageAndRound', () => {
        it('return as expected', () => {
            // Arrange
            const matches = [
                { matchId: 1, stage: null, round: null },
                { matchId: 2, stage: { stageId: 1 }, round: 1 },
                { matchId: 3, stage: { stageId: 1 }, round: 1 },
                { matchId: 4, stage: { stageId: 1 }, round: 2 },
                { matchId: 5, stage: null, round: 1 },
                { matchId: 6, stage: { stageId: 1 }, round: 2 }
            ];
            const container = shallow(<General {...defaultProps} />);
            const instance = container.instance();

            // Act
            const result = instance.groupMatchesByStageAndRound(matches);

            // Assert
            expect(result).toEqual([
                {
                    stageId: 0, stage: null, round: 0,
                    matches: [
                        { matchId: 1, stage: null, round: null }
                    ]
                },
                {
                    stageId: 1, stage: { stageId: 1 }, round: 1,
                    matches: [
                        { matchId: 2, stage: { stageId: 1 }, round: 1 },
                        { matchId: 3, stage: { stageId: 1 }, round: 1 }
                    ]
                },
                {
                    stageId: 1, stage: { stageId: 1 }, round: 2,
                    matches: [
                        { matchId: 4, stage: { stageId: 1 }, round: 2 }
                    ]
                },
                {
                    stageId: 0, stage: null, round: 1,
                    matches: [
                        { matchId: 5, stage: null, round: 1 }
                    ]
                },
                {
                    stageId: 1, stage: { stageId: 1 }, round: 2,
                    matches: [
                        { matchId: 6, stage: { stageId: 1 }, round: 2 }
                    ]
                },
            ]);
        });
    });

    describe('groupMatches', () => {
        it('return as expected when groupMatchesByDate is true', () => {
            // Arrange
            const stages = [];
            const matches = [
                { matchId: 1, round: 0 },
                { matchId: 2 }
            ];
            const league = {}
            const props = {
                ...defaultProps,
                stages,
                league
            }
            const container = shallow(<General {...props} />);
            const instance = container.instance();
            CommonFunctions.groupMatchesByDate = jest.fn(() => [{ matchId: 1, round: 0 }]);
            instance.groupMatchesByStageAndRound = jest.fn();
            instance.isGroupByDate = jest.fn().mockReturnValue(true);

            // Act
            const result = instance.groupMatches(matches);

            // Assert
            expect(result).toEqual([{ matchId: 1, round: 0 }]);
            expect(instance.groupMatchesByStageAndRound).toHaveBeenCalledTimes(0);
        });


        it('return as expected when stages.length > 1 and leagueType = 1', () => {
            // Arrange
            const stages = [{ stageId: 1 }, { stageId: 2 }];
            const league = {leagueType: 1}
            const matches = [
                { matchId: 1, stage: { stageId: 1 } },
                { matchId: 2, stage: { stageId: 1 } }
            ];
            const groupMatches = [
                {
                    stage: { stageId: 1 }, round: 0,
                    matches: [{ matchId: 1, stage: { stageId: 1 } }]
                },
                {
                    matches: [{ matchId: 2, stage: { stageId: 1 } }]
                },
                {
                    stage: { stageId: 1, roundCount: 2 }, round: 1,
                    matches: [{ matchId: 3, stage: { stageId: 1 } }]
                }
            ];

            const props = {
                ...defaultProps,
                stages,
                league
            }
            const container = shallow(<General {...props} />);
            const instance = container.instance();
            instance.isGroupByDate = jest.fn().mockReturnValue(false);
            CommonFunctions.groupMatchesByDate = jest.fn(() => []);
            instance.groupMatchesByStageAndRound = jest.fn(() => groupMatches);

            // Act
            const result = instance.groupMatches(matches);

            // Assert
            expect(CommonFunctions.groupMatchesByDate).toHaveBeenCalledTimes(3);
            expect(CommonFunctions.groupMatchesByDate.mock.calls[0][0]).toEqual([{ matchId: 1, stage: { stageId: 1 } }]);
            expect(CommonFunctions.groupMatchesByDate.mock.calls[1][0]).toEqual([{ matchId: 2, stage: { stageId: 1 } }]);
            expect(CommonFunctions.groupMatchesByDate.mock.calls[2][0]).toEqual([{ matchId: 3, stage: { stageId: 1 } }]);

            expect(result).toEqual([
                { key: 0, text: '1/4 Finals', childs: [] },
                { key: 1, text: '', childs: [] },
                { key: 2, text: 'Round 1', childs: [] }
            ]);
        });

        it('return as expected when stages.length > 1 and leagueType = 2', () => {
            // Arrange
            const stages = [{ stageId: 1 }, { stageId: 2 }];
            const league = {leagueType: 2}
            const matches = [
                { matchId: 1, stage: { stageId: 1 } },
                { matchId: 2, stage: { stageId: 1 } }
            ];
            const groupMatches = [
                {
                    stage: { stageId: 1, roundCount: 2 }, round: 1,
                    matches: [{ matchId: 2, stage: { stageId: 1 } }]
                }
            ];
            const props = {
                ...defaultProps,
                stages,
                league
            }
            const container = shallow(<General {...props} />);
            const instance = container.instance();
            CommonFunctions.groupMatchesByDate = jest.fn(() => []);
            instance.groupMatchesByStageAndRound = jest.fn(() => groupMatches);

            // Act
            const result = instance.groupMatches(matches);

            // Assert
            expect(CommonFunctions.groupMatchesByDate).toHaveBeenCalledTimes(1);

            expect(result).toEqual([
                { key: 0, text: 'Semi-finals - Turn 1', childs: [] }
            ]);
        });
    });

    describe('sortMatches', () => {
        it('return as expected when sortAsc = true', () => {
            // Arrange
            const matches = [
                { matchId: 1, startTime: '2022-05-25 02:00' },
                { matchId: 3, startTime: '2022-05-26 12:00' },
                { matchId: 2, startTime: '2022-05-25 04:00' }
            ];
            const container = shallow(<General {...defaultProps} />);
            const instance = container.instance();

            // Act
            const result = instance.sortMatches(matches, true);

            // Assert
            expect(result).toEqual([
                { matchId: 1, startTime: '2022-05-25 02:00' },
                { matchId: 2, startTime: '2022-05-25 04:00' },
                { matchId: 3, startTime: '2022-05-26 12:00' }
            ]);
        });

        it('return as expected when sortAsc = false', () => {
            // Arrange
            const matches = [
                { matchId: 1, startTime: '2022-05-25 02:00' },
                { matchId: 3, startTime: '2022-05-26 12:00' },
                { matchId: 2, startTime: '2022-05-25 04:00' }
            ];
            const container = shallow(<General {...defaultProps} />);
            const instance = container.instance();

            // Act
            const result = instance.sortMatches(matches, false);

            // Assert
            expect(result).toEqual([
                { matchId: 3, startTime: '2022-05-26 12:00' },
                { matchId: 2, startTime: '2022-05-25 04:00' },
                { matchId: 1, startTime: '2022-05-25 02:00' }
            ]);
        });
    });

    describe('filterMatches', () => {
        it('return as expected when searchKey match home team name', () => {
            // Arrange
            const props = {
                ...defaultProps,
                matches: [
                    {
                        matchId: 1,
                        homeTeam: { teamId: 1, nameEN: 'Belgium' },
                        awayTeam: { teamId: 2, nameEN: 'Croatia' }
                    },
                    {
                        matchId: 2,
                        homeTeam: { teamId: 3, nameEN: 'Liverpool' },
                        awayTeam: { teamId: 4, nameEN: 'Real Madrid' }
                    }]
            };
            CommonFunctions.getTeamName = jest.fn();
            CommonFunctions.getTeamName.mockReturnValueOnce('Belgium').mockReturnValueOnce('Croatia')
                .mockReturnValueOnce('Liverpool').mockReturnValueOnce('Real Madrid');

            const container = shallow(<General {...defaultProps} />);
            const instance = container.instance();

            // Act
            const result = instance.searchMatches(props.matches, 'lgium');

            // Assert
            expect(result).toEqual([{
                matchId: 1,
                homeTeam: { teamId: 1, nameEN: 'Belgium' },
                awayTeam: { teamId: 2, nameEN: 'Croatia' }
            }]);
        });

        it('return as expected when searchKey match away team name', () => {
            // Arrange
            const props = {
                ...defaultProps,
                matches: [
                    {
                        matchId: 1,
                        homeTeam: { teamId: 1, nameEN: 'Belgium' },
                        awayTeam: { teamId: 2, nameEN: 'Croatia' }
                    },
                    {
                        matchId: 2,
                        homeTeam: { teamId: 3, nameEN: 'Liverpool' },
                        awayTeam: { teamId: 4, nameEN: 'Real Madrid' }
                    }]
            };
            CommonFunctions.getTeamName = jest.fn();
            CommonFunctions.getTeamName.mockReturnValueOnce('Belgium').mockReturnValueOnce('Croatia')
                .mockReturnValueOnce('Liverpool').mockReturnValueOnce('Real Madrid');

            const container = shallow(<General {...defaultProps} />);
            const instance = container.instance();

            // Act
            const result = instance.searchMatches(props.matches, 'iverpool');

            // Assert
            expect(result).toEqual([{
                matchId: 2,
                homeTeam: { teamId: 3, nameEN: 'Liverpool' },
                awayTeam: { teamId: 4, nameEN: 'Real Madrid' }
            }]);
        });
    });
    describe('filterRoundAndStage', () => {
        it('return correctly matches when call function', () => {
            // Arrange
            const  matches = [
                {
                    matchId: 1,
                    round: 2,
                    stage: {stageId: 1}
                },
                {
                    matchId: 2,
                    round: 1,
                    stage: {stageId: 2}
                },
                {
                    matchId: 3
                }];
            const stage = 1;
            const round = 2;
            CommonFunctions.getTeamName = jest.fn();
            CommonFunctions.getTeamName.mockReturnValueOnce('Belgium').mockReturnValueOnce('Croatia')
                .mockReturnValueOnce('Liverpool').mockReturnValueOnce('Real Madrid');

            const container = shallow(<General {...defaultProps} />);
            const instance = container.instance();

            // Act
            const result = instance.filterRoundAndStage(matches, stage, round);

            // Assert
            expect(result).toEqual([{
                matchId: 1,
                round: 2,
                stage: {stageId: 1}
            }]);
        });
    });

    describe('filterPostMatches', () => {

        it('return correctly when matches is emtpy', () => {
            // Arrange
            const matches = [];
            const props = {
                ...defaultProps,
                stage: [{stageId: 1}]
            };
            const container = shallow(<General {...props} />);
            const instance = container.instance();

            // Act
            const result = instance.filterPostMatches(matches);

            // Assert
            expect(result).toEqual([]);
        });
        it('return correctly when isGroupByDate = true', () => {
            // Arrange
            const matches = [
                {
                    matchId: 1,
                    status: 50,
                    startTime: '2022-10-10 7:00:00'
                },
                {
                    matchId: 2,
                    status: 50,
                    startTime: '2022-09-10 7:00:00'
                }
            ];
            const props = {
                ...defaultProps,
                stage: [{stageId: 1}]
            };
            DateTimeService.getCurrentClientDateTime = jest.fn().mockReturnValue('2022-10-16 00:00:00')
            const container = shallow(<General {...props} />);
            const instance = container.instance();
            instance.isGroupByDate = jest.fn().mockReturnValue(true);
            instance.groupMatches = jest.fn().mockReturnValue([{
                matchId: 1,
                status: 50,
                startTime: '2022-10-10 7:00:00'
            }])

            // Act
            const result = instance.filterPostMatches(matches);

            // Assert
            expect(instance.groupMatches).toHaveBeenCalledWith([]);
            expect(result).toEqual([{
                matchId: 1,
                status: 50,
                startTime: '2022-10-10 7:00:00'
            }]);
        });

        it('return correctly when isGroupByDate = false and have round, stage', () => {
            // Arrange
            const matches = [
                {
                    matchId: 1,
                    status: 50,
                    round: 2,
                    stage: {stageId: 1},
                    startTime: '2022-10-10 7:00:00'
                },
                {
                    matchId: 2,
                    status: 50,
                    round: 2,
                    stage: {stageId: 1},
                    startTime: '2022-09-10 7:00:00'
                }
            ];
            const props = {
                ...defaultProps,
                stage: [{stageId: 1}]
            };
            DateTimeService.getCurrentClientDateTime = jest.fn().mockReturnValue('2022-10-16 00:00:00')
            const container = shallow(<General {...props} />);
            const instance = container.instance();
            instance.isGroupByDate = jest.fn().mockReturnValue(false);
            instance.groupMatches = jest.fn().mockReturnValue([{
                matchId: 1,
                status: 50,
                startTime: '2022-10-10 7:00:00'
            }])

            // Act
            const result = instance.filterPostMatches(matches);

            // Assert
            expect(instance.groupMatches).toHaveBeenCalledWith(matches);
            expect(result).toEqual([{
                matchId: 1,
                status: 50,
                startTime: '2022-10-10 7:00:00'
            }]);
        });

        it('return correctly when isGroupByDate = false and dont have round, stage', () => {
            // Arrange
            const matches = [
                {
                    matchId: 1,
                    status: 50,
                    startTime: '2022-10-10 7:00:00'
                },
                {
                    matchId: 2,
                    status: 50,
                    round: 2,
                    stage: {stageId: 1},
                    startTime: '2022-09-10 7:00:00'
                }
            ];
            const props = {
                ...defaultProps,
                stage: [{stageId: 1}]
            };
            DateTimeService.getCurrentClientDateTime = jest.fn().mockReturnValue('2022-10-16 00:00:00')
            const container = shallow(<General {...props} />);
            const instance = container.instance();
            instance.isGroupByDate = jest.fn().mockReturnValue(false);
            instance.groupMatches = jest.fn().mockReturnValue([{
                matchId: 1,
                status: 50,
                startTime: '2022-10-10 7:00:00'
            }])

            // Act
            const result = instance.filterPostMatches(matches);

            // Assert
            expect(instance.groupMatches).toHaveBeenCalledWith([{
                matchId: 1,
                status: 50,
                startTime: '2022-10-10 7:00:00'
            }]);
            expect(result).toEqual([{
                matchId: 1,
                status: 50,
                startTime: '2022-10-10 7:00:00'
            }]);
        });
    });

    describe('filterPreMatches', () => {
        it('return correctly when matches is emtpy', () => {
            // Arrange
            const matches = [];
            const props = {
                ...defaultProps,
                stage: [{stageId: 1}]
            };
            const container = shallow(<General {...props} />);
            const instance = container.instance();

            // Act
            const result = instance.filterPreMatches(matches);

            // Assert
            expect(result).toEqual([]);
        });
        it('return correctly when matches is emtpy', () => {
            // Arrange
            const matches = [];
            const props = {
                ...defaultProps,
                stage: [{stageId: 1}]
            };
            const container = shallow(<General {...props} />);
            const instance = container.instance();

            // Act
            const result = instance.filterPreMatches(matches);

            // Assert
            expect(result).toEqual([]);
        });
        it('return correctly when isGroupByDate = true', () => {
            // Arrange
            const matches = [
                {
                    matchId: 1,
                    status: 0,
                    startTime: '2022-10-11 7:00:00'
                },
                {
                    matchId: 2,
                    status: 0,
                    startTime: '2022-09-10 7:00:00'
                }
            ];
            const props = {
                ...defaultProps,
                stage: [{stageId: 1}]
            };
            DateTimeService.getCurrentClientDateTime = jest.fn().mockReturnValue('2022-10-10 00:00:00')
            const container = shallow(<General {...props} />);
            const instance = container.instance();
            instance.isGroupByDate = jest.fn().mockReturnValue(true);
            instance.groupMatches = jest.fn().mockReturnValue([{
                matchId: 1,
                status: 0,
                startTime: '2022-10-11 7:00:00'
            }])

            // Act
            const result = instance.filterPreMatches(matches);

            // Assert
            expect(instance.groupMatches).toHaveBeenCalledWith([{
                matchId: 1,
                status: 0,
                startTime: '2022-10-11 7:00:00'
            }]);
            expect(result).toEqual([{
                matchId: 1,
                status: 0,
                startTime: '2022-10-11 7:00:00'
            }]);
        });

        it('return correctly when isGroupByDate = false and have round, stage', () => {
            // Arrange
            const matches = [
                {
                    matchId: 1,
                    status: 0,
                    round: 2,
                    stage: {stageId: 1},
                    startTime: '2022-10-11 7:00:00'
                },
                {
                    matchId: 2,
                    status: 0,
                    round: 2,
                    stage: {stageId: 1},
                    startTime: '2022-10-12 7:00:00'
                }
            ];
            const props = {
                ...defaultProps,
                stage: [{stageId: 1}]
            };
            DateTimeService.getCurrentClientDateTime = jest.fn().mockReturnValue('2022-10-10 00:00:00')
            const container = shallow(<General {...props} />);
            const instance = container.instance();
            instance.isGroupByDate = jest.fn().mockReturnValue(false);
            instance.groupMatches = jest.fn().mockReturnValue([{
                matchId: 1,
                status: 50,
                startTime: '2022-10-10 7:00:00'
            }])

            // Act
            const result = instance.filterPreMatches(matches);

            // Assert
            expect(instance.groupMatches).toHaveBeenCalledWith(matches);
            expect(result).toEqual([{
                matchId: 1,
                status: 50,
                startTime: '2022-10-10 7:00:00'
            }]);
        });

        it('return correctly when isGroupByDate = false and dont have round, stage', () => {
            // Arrange
            const matches = [
                {
                    matchId: 1,
                    status: 0,
                    startTime: '2022-10-11 7:00:00'
                },
                {
                    matchId: 2,
                    status: 0,
                    round: 2,
                    stage: {stageId: 1},
                    startTime: '2022-10-11 7:00:00'
                }
            ];
            const props = {
                ...defaultProps,
                stage: [{stageId: 1}]
            };
            DateTimeService.getCurrentClientDateTime = jest.fn().mockReturnValue('2022-10-10 00:00:00')
            const container = shallow(<General {...props} />);
            const instance = container.instance();
            instance.isGroupByDate = jest.fn().mockReturnValue(false);
            instance.groupMatches = jest.fn().mockReturnValue([{
                matchId: 1,
                status: 0,
                startTime: '2022-10-11 7:00:00'
            }])

            // Act
            const result = instance.filterPreMatches(matches);

            // Assert
            expect(instance.groupMatches).toHaveBeenCalledWith([{
                matchId: 1,
                status: 0,
                startTime: '2022-10-11 7:00:00'
            }]);
            expect(result).toEqual([{
                matchId: 1,
                status: 0,
                startTime: '2022-10-11 7:00:00'
            }]);
        });
    });

    describe('filterTodayMatches', () => {
        it('return correctly when isGroupByDate = false and dont have round, stage', () => {
            // Arrange
            const preMatches = [
                {
                    matchId: 1,
                    status: 0,
                    startTime: '2022-10-10 8:00:00'
                },
                {
                    matchId: 2,
                    status: 0,
                    startTime: '2022-10-11 7:00:00'
                }
            ];

            const postMatches = [
                {
                    matchId: 3,
                    status: 50,
                    startTime: '2022-10-10 7:00:00'
                },
                {
                    matchId: 4,
                    status: 50,
                    startTime: '2022-10-11 7:00:00'
                }
            ];
            const props = {
                ...defaultProps,
                stage: [{stageId: 1}]
            };
            DateTimeService.getCurrentClientDateTime = jest.fn().mockReturnValue('2022-10-10 00:00:00')
            const container = shallow(<General {...props} />);
            const instance = container.instance();
            instance.isGroupByDate = jest.fn().mockReturnValue(false);
            instance.groupMatches = jest.fn().mockReturnValue([
                {
                    matchId: 3,
                    status: 50,
                    startTime: '2022-10-10 7:00:00'
                },
                {
                    matchId: 1,
                    status: 0,
                    startTime: '2022-10-10 8:00:00'
                }
            ])

            // Act
            const result = instance.filterTodayMatches(preMatches, postMatches);

            // Assert
            expect(instance.groupMatches).toHaveBeenCalledWith([{
                matchId: 3,
                status: 50,
                startTime: '2022-10-10 7:00:00'
            },
            {
                matchId: 1,
                status: 0,
                startTime: '2022-10-10 8:00:00'
            }]);
            expect(result).toEqual([{
                matchId: 3,
                status: 50,
                startTime: '2022-10-10 7:00:00'
            },
            {
                matchId: 1,
                status: 0,
                startTime: '2022-10-10 8:00:00'
            }]);
        });
    });

    describe('renders', () => {
        it('render correctly when preMatches & postMatches is empty', () => {
            // Arrange
            DateTimeService.getCurrentClientDateTime = jest.fn().mockReturnValue('2022-10-10 00:00:00')
            const container = shallow(<General {...defaultProps} />);
            const instance = container.instance();

            // Act
            const result = instance.render();

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('render correctly when preMatches & postMatches & standing is render', () => {
            // Arrange
            const preMatches = [
                {
                    matchId: 1,
                    status: 0,
                    startTime: '2022-10-11 8:00:00',
                    homeTeam: {teamNameVN: 'homeNameVN'}
                },
                {
                    matchId: 2,
                    status: 0,
                    startTime: '2022-10-12 7:00:00',
                    homeTeam: {teamNameVN: 'awayNameVN'}
                }
            ];

            const postMatches = [
                {
                    matchId: 3,
                    status: 50,
                    startTime: '2022-10-9 7:00:00',
                    homeTeam: {teamNameVN: 'homeNameVN'}
                },
                {
                    matchId: 4,
                    status: 50,
                    startTime: '2022-10-8 7:00:00',
                    homeTeam: {teamNameVN: 'awayNameVN'}
                },
                {
                    matchId: 5,
                    status: 50,
                    startTime: '2022-10-10 7:00:00',
                    homeTeam: {teamNameVN: 'awayNameVN'}
                },
            ];
            const props = {
                ...defaultProps,
                preMatches: preMatches,
                postMatches: postMatches,
                league: {hasSeasonStandings: true, leagueType: 3}

            }
            const expected = [
                {key: '2022-10-10', text:'2022-10-10', childs: preMatches}
            ]
            CommonFunctions.groupMatchesByDate = jest.fn().mockReturnValue(expected)
            window.scrollTo =  jest.fn();
            // Act
            const container = shallow(<General {...props} />);
            container.find('.post-match-grid .view-more-general-league').simulate('click', 'results');
            container.find('.pre-match-grid .view-more-general-league').simulate('click', 'fixtures');
            container.find('.standing-grid .view-more-general-league').simulate('click', 'standings');

            // Assert
            expect(container).toMatchSnapshot();
        });

        it('render correctly when preMatches  is render', () => {
            // Arrange
            const preMatches = [
                {
                    matchId: 1,
                    status: 0,
                    startTime: '2022-10-10 8:00:00',
                    homeTeam: {teamNameVN: 'homeNameVN'}
                },
                {
                    matchId: 2,
                    status: 0,
                    startTime: '2022-10-11 7:00:00',
                    homeTeam: {teamNameVN: 'awayNameVN'}
                }
            ];

            const postMatches = [];
            const props = {
                ...defaultProps,
                preMatches: preMatches,
                postMatches: postMatches,
                league: {hasSeasonStandings: false}

            }
            DateTimeService.getCurrentClientDateTime = jest.fn().mockReturnValue('2022-10-10 00:00:00')

            // Act
            const container = shallow(<General {...props} />);

            // Assert
            expect(container).toMatchSnapshot();
        });

        it('render correctly when postMatches & standing is render', () => {
            // Arrange
            const preMatches = [
            ];

            const postMatches = [ {
                matchId: 1,
                status: 0,
                startTime: '2022-10-10 8:00:00',
                homeTeam: {teamNameVN: 'homeNameVN'}
            },
            {
                matchId: 2,
                status: 0,
                startTime: '2022-10-11 7:00:00',
                homeTeam: {teamNameVN: 'awayNameVN'}
            }];
            const props = {
                ...defaultProps,
                preMatches: preMatches,
                postMatches: postMatches,
                league: {hasSeasonStandings: false}

            }
            DateTimeService.getCurrentClientDateTime = jest.fn().mockReturnValue('2022-10-10 00:00:00')

            // Act
            const container = shallow(<General {...props} />);

            // Assert
            expect(container).toMatchSnapshot();
        });

        it('render correctly when search key is not empty', () => {
            // Arrange
            const preMatches = [{
                matchId: 1,
                status: 0,
                startTime: '2022-10-10 8:00:00',
                homeTeam: {teamNameVN: 'homeNameVN'}
            },
            {
                matchId: 2,
                status: 0,
                startTime: '2022-10-11 7:00:00',
                homeTeam: {teamNameVN: 'awayNameVN'}
            }];

            const postMatches = [ {
                matchId: 1,
                status: 0,
                startTime: '2022-10-10 8:00:00',
                homeTeam: {teamNameVN: 'homeNameVN'}
            },
            {
                matchId: 2,
                status: 0,
                startTime: '2022-10-11 7:00:00',
                homeTeam: {teamNameVN: 'awayNameVN'}
            }];
            const props = {
                ...defaultProps,
                preMatches: preMatches,
                postMatches: postMatches,
                league: {hasSeasonStandings: false}

            }
            DateTimeService.getCurrentClientDateTime = jest.fn().mockReturnValue('2022-10-10 00:00:00')
            const instance = shallow(<General {...props} />).instance();
            instance.state.searchKey = 'name';
            instance.searchMatches = jest.fn().mockReturnValue(preMatches);
            // Act
            const result = instance.render();

            // Assert
            expect(instance.searchMatches).toHaveBeenCalledTimes(2);
            expect(result).toMatchSnapshot();
        });
    });
});