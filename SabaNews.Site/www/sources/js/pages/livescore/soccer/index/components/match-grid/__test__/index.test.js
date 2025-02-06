import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { MatchGrid } from '../index';
import CommonFunctions from '@jsroot/common/common-functions';

describe('index', () => {
    const defaultProps = {
        matches: [],
        today: '2022-05-25',
        selectedDate: '2022-05-25',
        searchKey: ''
    };

    afterEach(() => {
        jest.clearAllMocks();
        window.isLivePage = false;
    });

    describe('filterMatches', () => {
        it('return as expected when searchKey.length = 0', () => {
            // Arrange
            const props = {
                ...defaultProps,
                matches: [{ matchId: 1, homeTeam: { teamId: 1, nameEN: 'Belgium' }, awayTeam: { teamId: 2, nameEN: 'Croatia' } }]
            };
            const container = shallow(<MatchGrid {...defaultProps} />);
            const instance = container.instance();

            // Act
            const result = instance.filterMatches(props.matches, '');

            // Assert
            expect(result).toEqual(props.matches);
        });

        it('return as expected when searchKey.length > 0 and searchKey match league name', () => {
            // Arrange
            const props = {
                ...defaultProps,
                matches: [
                    {
                        matchId: 1,
                        league: { leagueId: 1, nameEN: 'World Cup' },
                        homeTeam: { teamId: 1, nameEN: 'Belgium' },
                        awayTeam: { teamId: 2, nameEN: 'Croatia' }
                    },
                    {
                        matchId: 2,
                        league: { leagueId: 2, nameEN: 'Champions League' },
                        homeTeam: { teamId: 3, nameEN: 'Liverpool' },
                        awayTeam: { teamId: 4, nameEN: 'Real Madrid' }
                    }]
            };
            CommonFunctions.getLeagueName = jest.fn();
            CommonFunctions.getLeagueName.mockReturnValueOnce('World Cup').mockReturnValueOnce('Champions League');

            CommonFunctions.getTeamName = jest.fn();
            CommonFunctions.getTeamName.mockReturnValueOnce('Belgium').mockReturnValueOnce('Croatia');

            const container = shallow(<MatchGrid {...defaultProps} />);
            const instance = container.instance();

            // Act
            const result = instance.filterMatches(props.matches, 'orld');

            // Assert
            expect(result).toEqual([{
                matchId: 1,
                league: { leagueId: 1, nameEN: 'World Cup' },
                homeTeam: { teamId: 1, nameEN: 'Belgium' },
                awayTeam: { teamId: 2, nameEN: 'Croatia' }
            }]);
        });

        it('return as expected when searchKey.length > 0 and searchKey match home team name', () => {
            // Arrange
            const props = {
                ...defaultProps,
                matches: [
                    {
                        matchId: 1,
                        league: { leagueId: 1, nameEN: 'World Cup' },
                        homeTeam: { teamId: 1, nameEN: 'Belgium' },
                        awayTeam: { teamId: 2, nameEN: 'Croatia' }
                    },
                    {
                        matchId: 2,
                        league: { leagueId: 2, nameEN: 'Champions League' },
                        homeTeam: { teamId: 3, nameEN: 'Liverpool' },
                        awayTeam: { teamId: 4, nameEN: 'Real Madrid' }
                    }]
            };
            CommonFunctions.getLeagueName = jest.fn();
            CommonFunctions.getLeagueName.mockReturnValueOnce('World Cup').mockReturnValueOnce('Champions League');

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
                league: { leagueId: 1, nameEN: 'World Cup' },
                homeTeam: { teamId: 1, nameEN: 'Belgium' },
                awayTeam: { teamId: 2, nameEN: 'Croatia' }
            }]);
        });

        it('return as expected when searchKey.length > 0 and searchKey match away team name', () => {
            // Arrange
            const props = {
                ...defaultProps,
                matches: [
                    {
                        matchId: 1,
                        league: { leagueId: 1, nameEN: 'World Cup' },
                        homeTeam: { teamId: 1, nameEN: 'Belgium' },
                        awayTeam: { teamId: 2, nameEN: 'Croatia' }
                    },
                    {
                        matchId: 2,
                        league: { leagueId: 2, nameEN: 'Champions League' },
                        homeTeam: { teamId: 3, nameEN: 'Liverpool' },
                        awayTeam: { teamId: 4, nameEN: 'Real Madrid' }
                    }]
            };
            CommonFunctions.getLeagueName = jest.fn();
            CommonFunctions.getLeagueName.mockReturnValueOnce('World Cup').mockReturnValueOnce('Champions League');

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
                league: { leagueId: 2, nameEN: 'Champions League' },
                homeTeam: { teamId: 3, nameEN: 'Liverpool' },
                awayTeam: { teamId: 4, nameEN: 'Real Madrid' }
            }]);
        });
    });

    describe('groupMatchesByStage', () => {
        it('return as expected when season = null and stage = null', () => {
            // Arrange
            const matches = [
                {
                    matchId: 1,
                    league: { leagueId: 1, nameEN: 'World Cup', leagueType: 2 },
                    homeTeam: { teamId: 1, nameEN: 'Belgium' },
                    awayTeam: { teamId: 2, nameEN: 'Croatia' }
                },
                {
                    matchId: 2,
                    league: { leagueId: 2, nameEN: 'Champions League', leagueType: 1 },
                    homeTeam: { teamId: 3, nameEN: 'Liverpool' },
                    awayTeam: { teamId: 4, nameEN: 'Real Madrid' }
                },
                {
                    matchId: 3,
                    league: { leagueId: 2, nameEN: 'Champions League', leagueType: 1 },
                    homeTeam: { teamId: 4, nameEN: 'Real Madrid' },
                    awayTeam: { teamId: 5, nameEN: 'Manchester City' }
                }
            ];

            const container = shallow(<MatchGrid {...defaultProps} />);
            const instance = container.instance();

            // Act
            const result = instance.groupMatchesByStage(matches);

            // Assert
            expect(result).toEqual([
                {
                    key: '1-0-0', leagueId: 1, nameEN: 'World Cup', leagueType: 2,
                    matches: [
                        {
                            matchId: 1,
                            league: {
                                leagueId: 1, nameEN: 'World Cup', leagueType: 2
                            },
                            homeTeam: { teamId: 1, nameEN: 'Belgium' },
                            awayTeam: { teamId: 2, nameEN: 'Croatia' }
                        }
                    ]
                },
                {
                    key: '2-0-0', leagueId: 2, nameEN: 'Champions League', leagueType: 1,
                    matches: [
                        {
                            matchId: 2,
                            league: {
                                leagueId: 2, nameEN: 'Champions League', leagueType: 1
                            },
                            homeTeam: { teamId: 3, nameEN: 'Liverpool' },
                            awayTeam: { teamId: 4, nameEN: 'Real Madrid' }
                        },
                        {
                            matchId: 3,
                            league: { leagueId: 2, nameEN: 'Champions League', leagueType: 1 },
                            homeTeam: { teamId: 4, nameEN: 'Real Madrid' },
                            awayTeam: { teamId: 5, nameEN: 'Manchester City' }
                        }
                    ]
                }
            ]);
        });

        it('return as expected when season != null and stage != null', () => {
            // Arrange
            const matches = [
                {
                    matchId: 1,
                    league: {
                        leagueId: 1, nameEN: 'World Cup', leagueType: 2,
                        season: { seasonId: 1 }, stage: { stageId: 1 }
                    },
                    homeTeam: { teamId: 1, nameEN: 'Belgium' },
                    awayTeam: { teamId: 2, nameEN: 'Croatia' }
                },
                {
                    matchId: 2,
                    league: {
                        leagueId: 2, nameEN: 'Champions League', leagueType: 1,
                        season: { seasonId: 2 }, stage: { stageId: 2 }
                    },
                    homeTeam: { teamId: 3, nameEN: 'Liverpool' },
                    awayTeam: { teamId: 4, nameEN: 'Real Madrid' }
                },
                {
                    matchId: 3,
                    league: {
                        leagueId: 2, nameEN: 'Champions League', leagueType: 1,
                        season: { seasonId: 2 }, stage: { stageId: 2 }
                    },
                    homeTeam: { teamId: 4, nameEN: 'Real Madrid' },
                    awayTeam: { teamId: 5, nameEN: 'Manchester City' }
                }
            ];

            const container = shallow(<MatchGrid {...defaultProps} />);
            const instance = container.instance();

            // Act
            const result = instance.groupMatchesByStage(matches);

            // Assert
            expect(result).toEqual([
                {
                    key: '1-1-1', leagueId: 1, nameEN: 'World Cup', leagueType: 2,
                    season: { seasonId: 1 }, stage: { stageId: 1 },
                    matches: [
                        {
                            matchId: 1,
                            league: {
                                leagueId: 1, nameEN: 'World Cup', leagueType: 2,
                                season: { seasonId: 1 }, stage: { stageId: 1 }
                            },
                            homeTeam: { teamId: 1, nameEN: 'Belgium' },
                            awayTeam: { teamId: 2, nameEN: 'Croatia' }
                        }
                    ]
                },
                {
                    key: '2-0-0', leagueId: 2, nameEN: 'Champions League', leagueType: 1,
                    season: { seasonId: 2 }, stage: { stageId: 2 },
                    matches: [
                        {
                            matchId: 2,
                            league: {
                                leagueId: 2, nameEN: 'Champions League', leagueType: 1,
                                season: { seasonId: 2 }, stage: { stageId: 2 }
                            },
                            homeTeam: { teamId: 3, nameEN: 'Liverpool' },
                            awayTeam: { teamId: 4, nameEN: 'Real Madrid' }
                        },
                        {
                            matchId: 3,
                            league: {
                                leagueId: 2, nameEN: 'Champions League', leagueType: 1,
                                season: { seasonId: 2 }, stage: { stageId: 2 }
                            },
                            homeTeam: { teamId: 4, nameEN: 'Real Madrid' },
                            awayTeam: { teamId: 5, nameEN: 'Manchester City' }
                        }
                    ]
                }
            ]);
        });
    });

    describe('render', () => {
        it('renders correctly when matches.length = 0 and isLivePage = false', () => {
            // Act
            const container = shallow(<MatchGrid {...defaultProps} />);

            // Assert
            expect(toJson(container)).toMatchSnapshot();
        });

        it('renders correctly when matches.length = 0 and isLivePage = true', () => {
            // Arrange
            window.isLivePage = true;

            // Act
            const container = shallow(<MatchGrid {...defaultProps} />);

            // Assert
            expect(toJson(container)).toMatchSnapshot();
        });

        it('renders correctly when selectedDate < today and isLivePage = false', () => {
            // Arrange
            const props = {
                ...defaultProps,
                today: '2022-05-25',
                selectedDate: '2022-05-24',
                matches: [
                    { matchId: 1, status: 0, league: { leagueId: 1 } },
                    { matchId: 2, status: 10, league: { leagueId: 1 } },
                    { matchId: 3, status: 50, league: { leagueId: 2 } },
                    { matchId: 4, status: 63, league: { leagueId: 3 } },
                    { matchId: 5, status: 64, league: { leagueId: 4 } },
                    { matchId: 6, status: 99, league: { leagueId: 5 } }
                ]
            };

            // Act
            const container = shallow(<MatchGrid {...props} />);

            // Assert
            expect(toJson(container)).toMatchSnapshot();
        });

        it('renders correctly when matches.length > 0 and isLivePage = false', () => {
            // Arrange
            const props = {
                ...defaultProps,
                matches: [
                    {
                        matchId: 1,
                        league: { leagueId: 1, nameEN: 'World Cup' },
                        homeTeam: { teamId: 1, nameEN: 'Belgium' },
                        awayTeam: { teamId: 2, nameEN: 'Croatia' }
                    },
                    {
                        matchId: 2,
                        league: { leagueId: 2, nameEN: 'Champions League' },
                        homeTeam: { teamId: 3, nameEN: 'Liverpool' },
                        awayTeam: { teamId: 4, nameEN: 'Real Madrid' }
                    }]
            };
            CommonFunctions.getLeagueName = jest.fn(() => 'league');
            CommonFunctions.getTeamName = jest.fn(() => 'team');

            // Act
            const container = shallow(<MatchGrid {...props} />);

            // Assert
            expect(toJson(container)).toMatchSnapshot();
        });

        it('renders correctly when searchKey not match with league and team', () => {
            // Arrange
            const props = {
                ...defaultProps,
                searchKey: 'searchKey',
                matches: [
                    {
                        matchId: 1,
                        league: { leagueId: 1, nameEN: 'World Cup' },
                        homeTeam: { teamId: 1, nameEN: 'Belgium' },
                        awayTeam: { teamId: 2, nameEN: 'Croatia' }
                    },
                    {
                        matchId: 2,
                        league: { leagueId: 2, nameEN: 'Champions League' },
                        homeTeam: { teamId: 3, nameEN: 'Liverpool' },
                        awayTeam: { teamId: 4, nameEN: 'Real Madrid' }
                    }]
            };
            CommonFunctions.getLeagueName = jest.fn(() => 'league');
            CommonFunctions.getTeamName = jest.fn(() => 'team');

            // Act
            const container = shallow(<MatchGrid {...props} />);

            // Assert
            expect(toJson(container)).toMatchSnapshot();
        });
    });
});