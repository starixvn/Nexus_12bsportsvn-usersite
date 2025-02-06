import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import MatchGrid from '../index';
import DateTimeService from '@jsroot/common/dateTimeService';
import CommonFunctions from '@jsroot/common/common-functions';
import LangHelper from '@jsroot/common/langHelper';

describe('index', () => {
    const defaultProps = {
        league: null,
        stages: [],
        sortAsc: '',
        matches: []
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
            const instance = shallow(<MatchGrid {...defaultProps} />).instance();

            // Assert
            expect(instance.state).toEqual({ searchKey: '' });
        });
    });

    describe('handleChangeSearchKey', () => {
        it('updates correctly state', () => {
            // Arrange
            const container = shallow(<MatchGrid {...defaultProps} />);
            const instance = container.instance();

            // Act
            instance.handleChangeSearchKey({ target: { value: 'key' } });

            // Assert
            expect(instance.state).toEqual({ searchKey: 'key' });
        });
    });

    describe('getRoundName', () => {
        it('return as expected when leagueType = League', () => {
            // Arrange
            const container = shallow(<MatchGrid {...defaultProps} />);
            const instance = container.instance();

            // Act
            const result = instance.getRoundName(1, 1);

            // Assert
            expect(result).toEqual('Round 1');
        });

        it('return as expected when leagueType = Cup', () => {
            // Arrange
            const container = shallow(<MatchGrid {...defaultProps} />);
            const instance = container.instance();

            // Act
            const result = instance.getRoundName(1, 2);

            // Assert
            expect(result).toEqual('Turn 1');
        });
    });

    describe('groupMatchesByDate', () => {
        it('return as expected', () => {
            // Arrange
            const matches = [
                { matchId: 1, startTime: '2022-05-25' },
                { matchId: 2, startTime: '2022-05-25' },
                { matchId: 3, startTime: '2022-05-26' }
            ];
            const container = shallow(<MatchGrid {...defaultProps} />);
            const instance = container.instance();

            // Act
            const result = instance.groupMatchesByDate(matches);

            // Assert
            expect(result).toEqual([
                {
                    key: '2022-05-25', text: '2022-05-25',
                    childs: [
                        { matchId: 1, startTime: '2022-05-25' },
                        { matchId: 2, startTime: '2022-05-25' }
                    ]
                },
                {
                    key: '2022-05-26', text: '2022-05-26',
                    childs: [
                        { matchId: 3, startTime: '2022-05-26' }
                    ]
                }
            ]);
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
            const container = shallow(<MatchGrid {...defaultProps} />);
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

    describe('checkGroupLeagueType', () =>  {
        it('return correctly when leagueType is league', () => {
            // Arrange
            const stages = [{stageId: 1}];
            const matches = [{matchId: 1, round: 0}];
            const league = {leagueId: 1, leagueType: 1};
            const container = shallow(<MatchGrid {...defaultProps} />);
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
            const container = shallow(<MatchGrid {...defaultProps} />);
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
            const container = shallow(<MatchGrid {...defaultProps} />);
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
            const container = shallow(<MatchGrid {...defaultProps} />);
            const instance = container.instance();

            // Act
            const result = instance.checkGroupLeagueType(stages, matches, league);

            // Assert
            expect(result).toEqual(false);
        });
    });

    describe('checkGroupMatches', () => {
        it('return correctly when stage.length = 0', () => {
             // Arrange
            const stages = [];
            const matches = [{matchId: 1, round: 0}];
            const league = {leagueId: 1, leagueType: 1};
            const container = shallow(<MatchGrid {...defaultProps} />);
            const instance = container.instance();
            instance.checkGroupLeagueType = jest.fn().mockReturnValue(false);

            // Act
            const result = instance.checkGroupMatches(stages, matches, league);

             // Assert
             expect(result).toEqual(true);
        });

        it('return correctly when stage.length = 0', () => {
            // Arrange
           const stages = [{stageId: 1}];
           const matches = [{matchId: 1, round: 0}];
           const league = {leagueId: 1, leagueType: 1};
           const container = shallow(<MatchGrid {...defaultProps} />);
           const instance = container.instance();
           instance.checkGroupLeagueType = jest.fn().mockReturnValue(false);

           // Act
           const result = instance.checkGroupMatches(stages, matches, league);

            // Assert
            expect(result).toEqual(false);
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
            const container = shallow(<MatchGrid {...defaultProps} />);
            const instance = container.instance();
            instance.groupMatchesByDate = jest.fn(() => [{ matchId: 1, round: 0 }]);
            instance.groupMatchesByStageAndRound = jest.fn();
            instance.checkGroupMatches = jest.fn().mockReturnValue(true);

            // Act
            const result = instance.groupMatches(stages, matches, league);

            // Assert
            expect(result).toEqual([{ matchId: 1, round: 0 }]);
            expect(instance.groupMatchesByStageAndRound).toHaveBeenCalledTimes(0);
        });


        it('return as expected when stages.length > 1 and leagueType = 1', () => {
            // Arrange
            const stages = [{ stageId: 1 }, { stageId: 2 }];
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
            const league = {leagueType: 1}
            const container = shallow(<MatchGrid {...defaultProps} />);
            const instance = container.instance();
            instance.checkGroupMatches = jest.fn().mockReturnValue(false);
            instance.groupMatchesByDate = jest.fn(() => []);
            instance.groupMatchesByStageAndRound = jest.fn(() => groupMatches);

            // Act
            const result = instance.groupMatches(stages, matches, league);

            // Assert
            expect(instance.groupMatchesByDate).toHaveBeenCalledTimes(3);
            expect(instance.groupMatchesByDate.mock.calls[0][0]).toEqual([{ matchId: 1, stage: { stageId: 1 } }]);
            expect(instance.groupMatchesByDate.mock.calls[1][0]).toEqual([{ matchId: 2, stage: { stageId: 1 } }]);
            expect(instance.groupMatchesByDate.mock.calls[2][0]).toEqual([{ matchId: 3, stage: { stageId: 1 } }]);

            expect(result).toEqual([
                { key: 0, text: '1/4 Finals', childs: [] },
                { key: 1, text: '', childs: [] },
                { key: 2, text: 'Round 1', childs: [] }
            ]);
        });

        it('return as expected when stages.length > 1 and leagueType = 2', () => {
            // Arrange
            const stages = [{ stageId: 1 }, { stageId: 2 }];
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
            const league = {leagueType: 2}
            const container = shallow(<MatchGrid {...defaultProps} />);
            const instance = container.instance();
            instance.groupMatchesByDate = jest.fn(() => []);
            instance.groupMatchesByStageAndRound = jest.fn(() => groupMatches);

            // Act
            const result = instance.groupMatches(stages, matches, league);

            // Assert
            expect(instance.groupMatchesByDate).toHaveBeenCalledTimes(1);
            expect(instance.groupMatchesByDate.mock.calls[0][0]).toEqual([{ matchId: 2, stage: { stageId: 1 } }]);

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
            const container = shallow(<MatchGrid {...defaultProps} />);
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
            const container = shallow(<MatchGrid {...defaultProps} />);
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

            const container = shallow(<MatchGrid {...defaultProps} />);
            const instance = container.instance();

            // Act
            const result = instance.filterMatches(props.matches, 'lgium');

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

            const container = shallow(<MatchGrid {...defaultProps} />);
            const instance = container.instance();

            // Act
            const result = instance.filterMatches(props.matches, 'iverpool');

            // Assert
            expect(result).toEqual([{
                matchId: 2,
                homeTeam: { teamId: 3, nameEN: 'Liverpool' },
                awayTeam: { teamId: 4, nameEN: 'Real Madrid' }
            }]);
        });
    });

    describe('render', () => {
        it('renders correctly when matches.length = 0', () => {
            // Act
            const container = shallow(<MatchGrid {...defaultProps} />);

            // Assert
            expect(toJson(container)).toMatchSnapshot();
        });

        it('renders correctly when matches.length > 0 and searchKey.length = 0', () => {
            // Arrange
            const props = {
                ...defaultProps,
                matches: [
                    { matchId: 1, startTime: '2022-05-25' },
                    { matchId: 2, startTime: '2022-05-25' },
                    { matchId: 3, startTime: '2022-05-26' }
                ],
                league: {leagueId: 1, leagueType: 1}
            };

            // Act
            const container = shallow(<MatchGrid {...props} />);

            // Assert
            expect(toJson(container)).toMatchSnapshot();
        });

        it('renders correctly when matches.length > 0 and searchKey not match home, away team', () => {
            // Arrange
            const props = {
                ...defaultProps,
                matches: [
                    {
                        matchId: 1, startTime: '2022-05-25',
                        homeTeam: { teamId: 1, nameEN: 'Belgium' },
                        awayTeam: { teamId: 2, nameEN: 'Croatia' }
                    },
                    {
                        matchId: 2, startTime: '2022-05-26',
                        homeTeam: { teamId: 3, nameEN: 'Liverpool' },
                        awayTeam: { teamId: 4, nameEN: 'Real Madrid' }
                    }
                ],
                league: {leagueId: 1, leagueType: 1}
            };
            CommonFunctions.getTeamName = jest.fn();
            CommonFunctions.getTeamName.mockReturnValueOnce('Belgium').mockReturnValueOnce('Croatia')
                .mockReturnValueOnce('Liverpool').mockReturnValueOnce('Real Madrid');

            // Act
            const container = shallow(<MatchGrid {...props} />);
            container.setState({ searchKey: 'abc' });

            // Assert
            expect(toJson(container)).toMatchSnapshot();
        });
    });
});