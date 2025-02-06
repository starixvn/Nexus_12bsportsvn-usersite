import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import MatchGrid  from '../MatchGrid';
import CommonFunctions from '@jsroot/common/common-functions';
import dayjs from 'dayjs';
import DateTimeService from '@jsroot/common/dateTimeService';

describe('MatchGrid', () => {
    const defaultProps = {
        matches: [],
        isAllMatches: false,
        sortAsc: false,
        onUpdateFavouriteMatch: jest.fn(),
        onToggleIcon:  jest.fn(),
        onUpdateFavLeague: jest.fn()
    };
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('handleChangeSearchKey', () => {
        it('setState correctly when call function', () => {
            // Arrange
            const event = {
                target: {
                    value: 'search'
                }
            };
            const instance = shallow(<MatchGrid {...defaultProps} />).instance();
            // Act
            instance.handleChangeSearchKey(event);

            // Assert
            expect(instance.state.searchKey).toEqual('search');
        });
    });

    describe('filterMatches', () => {

        it('return correctly when result is empty', () => {
            // Arrange
            const matches = [
                {homeTeam: {teamNameEN: 'home team name 1'}, awayTeam: {teamNameEN: 'away team name 1'}},
                {homeTeam: {teamNameEN: 'home team name 2'}, awayTeam: {teamNameEN: 'away team name 2'}}
            ];
            const searchKey = 'tea1';
            const instance = shallow(<MatchGrid {...defaultProps} />).instance();
            // Act
            const result = instance.filterMatches(matches, searchKey);

            // Assert
            expect(result).toEqual([]);
        });

        it('return correctly when result is not empty', () => {
            // Arrange
            const matches = [
                {homeTeam: {teamNameEN: 'home team name 1'}, awayTeam: {teamNameEN: 'away team name 1'}},
                {homeTeam: {teamNameEN: 'home team name 2'}, awayTeam: {teamNameEN: 'away team name 2'}}
            ];
            const searchKey = 'tea';
            const instance = shallow(<MatchGrid {...defaultProps} />).instance();
            // Act
            const result = instance.filterMatches(matches, searchKey);

            // Assert
            expect(result).toEqual(matches);
        });
    });

    describe('groupMatchesByLeague', () => {
        it('return correctly when match is empty',  () => {
            // Arrange
            const matches = [];
            const instance = shallow(<MatchGrid {...defaultProps} />).instance();
            // Act
            const result = instance.groupMatchesByLeague(matches);

            // Assert
            expect(result).toEqual([]);
        });

        it('return correctly when call function',  () => {
            // Arrange
            const matches = [
                {matchId: 1, league: {leagueId: 1}},
                {matchId: 2, league: {leagueId: 1}},
                {matchId: 3, league: {leagueId: 2}},
                {matchId: 4, league: {leagueId: 2}}
            ];
            const response = [
                {
                    key: 1,
                    league: {leagueId: 1},
                    childs: [{matchId: 1, league: {leagueId: 1}}, {matchId: 2, league: {leagueId: 1}}]
                },
                {
                    key: 2,
                    league: {leagueId: 2},
                    childs: [{matchId: 3, league: {leagueId: 2}}, {matchId: 4, league: {leagueId: 2}}]
                }
            ]
            const instance = shallow(<MatchGrid {...defaultProps} />).instance();

            // Act
            const result = instance.groupMatchesByLeague(matches);

            // Assert
            expect(result).toEqual(response);
        });
    });

    describe('groupMatchesByDate', () => {
        it('return correctly when call functions', () => {
            //Arrange
            const matches = [
                {matchId: 1, startTime:'2020-06-01', league: {leagueId: 1}},
                {matchId: 2, startTime:'2020-06-02', league: {leagueId: 1}},
                {matchId: 3, startTime:'2020-06-01', league: {leagueId: 2}},
                {matchId: 4, startTime:'2020-06-02', league: {leagueId: 2}}
            ];
            const response = [
                {
                    key: '2020-06-01',
                    text: dayjs('2020-06-01').format('dddd - DD/MM/YYYY'),
                    childs: []
                },
                {
                    key: '2020-06-02',
                    text:  dayjs('2020-06-02').format('dddd - DD/MM/YYYY'),
                    childs: []
                }
            ]
            const instance = shallow(<MatchGrid {...defaultProps} />).instance();
            instance.groupMatchesByLeague = jest.fn().mockReturnValue([]);
            // Act
            const result = instance.groupMatchesByDate(matches);

            // Assert
            expect(result).toEqual(response);
        });
    });

    describe('sortMatches', () => {
        it('return correctly when sort asc',() => {
            //Arrange
            const matches = [
                {
                    key: '2020-06-01',
                    text: dayjs('2020-06-01').format('dddd, DD/MM/YYYY'),
                    childs: []
                },
                {
                    key: '2020-06-02',
                    text:  dayjs('2020-06-02').format('dddd, DD/MM/YYYY'),
                    childs: []
                }
            ]
            const instance = shallow(<MatchGrid {...defaultProps} />).instance();
            // Act
            const result = instance.sortMatches(matches, true);

            // Assert
            expect(result).toEqual(matches);
        });

        it('return correctly when sort desc',() => {
            //Arrange
            const matches = [
                {
                    key: '2020-06-01',
                    text: dayjs('2020-06-01').format('dddd, DD/MM/YYYY'),
                    childs: []
                },
                {
                    key: '2020-06-02',
                    text:  dayjs('2020-06-02').format('dddd, DD/MM/YYYY'),
                    childs: []
                }
            ]
            const instance = shallow(<MatchGrid {...defaultProps} />).instance();
            // Act
            const result = instance.sortMatches(matches, false);

            // Assert
            expect(result).toEqual(matches.reverse());
        });
    });

    describe('onToggleIcon call correctly function', () => {
        // Arrange
        const instance = shallow(<MatchGrid {...defaultProps} />).instance();

        // Act
        instance.onToggleIcon();

        // Assert
        expect(defaultProps.onToggleIcon).toHaveBeenCalled();
    });

    describe('onUpdateFavLeague call correctly function', () => {
        // Arrange
        const instance = shallow(<MatchGrid {...defaultProps} />).instance();

        // Act
        instance.onUpdateFavLeague();

        // Assert
        expect(defaultProps.onUpdateFavLeague).toHaveBeenCalled();
    });


    describe('render', () => {
        it('render correctly with default props', () => {
            //Arrange
            window.open = jest.fn();
            const container = shallow(<MatchGrid {...defaultProps} />);

            // Act
            const result = container.render();

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('render correctly when match is empty & is tat-ca tab', () => {
            //Arrange
            const props = {
                ...defaultProps,
                isAllMatches: true
            }
            window.open = jest.fn();
            const container = shallow(<MatchGrid {...props} />);

            // Act
            const result = container.render();

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('render correctly when match searchKey is empty', () => {
            //Arrange
            const props = {
                ...defaultProps,
                matches: [
                    {matchId: 1, homeTeam:{icon: 'icon'}, awayTeam: {icon: 'icon'}, startTime:'2020-06-01', league: {leagueId: 1}},
                    {matchId: 2, homeTeam:{icon: 'icon'}, awayTeam: {icon: 'icon'}, startTime:'2020-06-02', league: {leagueId: 1}},
                    {matchId: 3, homeTeam:{icon: 'icon'}, awayTeam: {icon: 'icon'}, startTime:'2020-06-01', league: {leagueId: 2}},
                    {matchId: 4, homeTeam:{icon: 'icon'}, awayTeam: {icon: 'icon'}, startTime:'2020-06-02', league: {leagueId: 2}}
                ],
                isAllMatches: true
            }
            window.open = jest.fn();
            const container = shallow(<MatchGrid {...props} />);
            const instance = container.instance();
            instance.setState({
                searchKey: ''
            });

            // Act
            const result = container.render();

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('render correctly when filter matches is empty', () => {
            //Arrange
            const props = {
                ...defaultProps,
                matches: [
                    {matchId: 1, homeTeam:{icon: 'icon'}, awayTeam: {icon: 'icon'}, startTime:'2020-06-01', league: {leagueId: 1}},
                    {matchId: 2, homeTeam:{icon: 'icon'}, awayTeam: {icon: 'icon'}, startTime:'2020-06-02', league: {leagueId: 1}},
                    {matchId: 3, homeTeam:{icon: 'icon'}, awayTeam: {icon: 'icon'}, startTime:'2020-06-01', league: {leagueId: 2}},
                    {matchId: 4, homeTeam:{icon: 'icon'}, awayTeam: {icon: 'icon'}, startTime:'2020-06-02', league: {leagueId: 2}}
                ],
            }
            window.open = jest.fn();
            const container = shallow(<MatchGrid {...props} />);
            const instance = container.instance();
            instance.filterMatches = jest.fn().mockReturnValue([]);
            instance.setState({
                searchKey: '123'
            });

            // Act
            const result = container.render();

            // Assert
            expect(result).toMatchSnapshot();
        });

        it('render correctly when match group by league', () => {
            //Arrange
            const props = {
                ...defaultProps,
                matches: [
                    {matchId: 1, homeTeam:{icon: 'icon'}, awayTeam: {icon: 'icon'}, startTime:'2020-06-01', league: {leagueId: 1}},
                    {matchId: 2, homeTeam:{icon: 'icon'}, awayTeam: {icon: 'icon'}, startTime:'2020-06-02', league: {leagueId: 1}},
                    {matchId: 3, homeTeam:{icon: 'icon'}, awayTeam: {icon: 'icon'}, startTime:'2020-06-01', league: {leagueId: 2}},
                    {matchId: 4, homeTeam:{icon: 'icon'}, awayTeam: {icon: 'icon'}, startTime:'2020-06-02', league: {leagueId: 2}}
                ],
            };
            const matches = [
                {
                    key: 1,
                    league: {leagueId: 1},
                    childs: [{matchId: 1, league: {leagueId: 1}}, {matchId: 2, league: {leagueId: 1}}]
                },
                {
                    key: 2,
                    league: {leagueId: 2},
                    childs: [{matchId: 3, league: {leagueId: 2}}, {matchId: 4, league: {leagueId: 2}}]
                }
            ]
            const event = {
                target: { className: 'icon-livescore' },
                ctrlKey: false
            };
            window.open = jest.fn();
            const container = shallow(<MatchGrid {...props} />);

            // Act
            const result = container.render();

            // Assert
            expect(result).toMatchSnapshot();
        });
    });
});