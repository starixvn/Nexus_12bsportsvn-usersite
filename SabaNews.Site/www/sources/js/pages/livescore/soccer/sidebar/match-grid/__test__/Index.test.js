import React from 'react';
import { shallow } from 'enzyme';
import MatchGrid from '../Index';
import CommonFunctions from '@jsroot/common/common-functions';
import DateTimeService from '@jsroot/common/dateTimeService';
import dayjs from 'dayjs';

describe('MatchGrid', () => {
    const defaultProps = {
        league: null,
        matches: [],
        isFinished: false
    };


    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('handleSelectedTab', () => {
        it('setState correctly when call function', () => {
            // Arrange
            const container = shallow(<MatchGrid {...defaultProps} />);
            const instance = container.instance();
            instance.setState = jest.fn();
            // Act
            instance.handleSelectedTab('fixture');

            // Assert
            expect(instance.setState).toHaveBeenCalled();
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

    describe('filterFixture', () => {
        it('return correctly matches when  call function', () => {
            //Arrange
            const matches = [
                {
                    matchId: 1,
                    status:50,
                    startTime: '2023-09-01',
                },
                {
                    matchId: 2,
                    status:0,
                    startTime: '2023-11-01',
                }
            ]
            DateTimeService.getCurrentClientDateTime = jest.fn().mockReturnValue('2023-10-01');
            const instance = shallow(<MatchGrid {...defaultProps} />).instance();
            // Act
            const result = instance.filterFixture(matches);

            // Assert
            expect(result).toEqual([{
                matchId: 2,
                status:0,
                startTime: '2023-11-01',
            }]);
        })
    });

    describe('getCurrentMatches', () => {
        it('return correctly match list when selectedTab = fixture', () =>{
            //Arrange
            const matches = [
                {
                    matchId: 1,
                    status:50,
                    endTime: '2023-09-01',
                },
                {
                    matchId: 2,
                    status:0,
                    endTime: '2023-11-01',
                }
            ]
            const props = {
                ...defaultProps,
                matches: matches,
                league: {leagueId: 1, leagueNameVN: 'league name'}
            }
            const instance = shallow(<MatchGrid {...props} />).instance();
            instance.state.selectedTab = 'fixture';
            instance.filterFixture  = jest.fn().mockReturnValue(matches);
            // Act
            const result = instance.getCurrentMatches(matches);

            // Assert
            expect(instance.filterFixture).toHaveBeenCalled();
            expect(result).toEqual(matches);
        });

        it('return correctly match list when selectedTab = result', () =>{
            //Arrange
            const expectedResult =  [
                {
                    matchId: 2,
                    status: 50,
                    endTime: '2023-09-01',
                }
            ];
            const matches = [
                {
                    matchId: 1,
                    status:0,
                    endTime: '2023-11-01',
                },
                {
                    matchId: 2,
                    status: 50,
                    endTime: '2023-09-01',
                }
            ]
            const props = {
                ...defaultProps,
                matches: matches,
                league: {leagueId: 1, leagueNameVN: 'league name'}
            }
            const instance = shallow(<MatchGrid {...props} />).instance();
            instance.state.selectedTab = 'result';
            // Act
            const result = instance.getCurrentMatches(matches);

            // Assert
            expect(result).toEqual(expectedResult);
        });

        it('return correctly match list when selectedTab is others', () =>{
            //Arrange
            const expectedResult =  [
                {
                    matchId: 2,
                    status: 50,
                    endTime: '2023-09-01',
                }
            ];
            const matches = [
                {
                    matchId: 1,
                    status:0,
                    endTime: '2023-11-01',
                },
                {
                    matchId: 2,
                    status: 50,
                    endTime: '2023-09-01',
                }
            ]
            const props = {
                ...defaultProps,
                matches: matches,
                league: {leagueId: 1, leagueNameVN: 'league name'}
            }
            const instance = shallow(<MatchGrid {...props} />).instance();
            instance.state.selectedTab = 'standing';
            // Act
            const result = instance.getCurrentMatches(matches);

            // Assert
            expect(result).toEqual([]);
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


        it('redirect correctly when ctrlKey = false', () => {
            // Arrange
            const event = {
                target: { className: '' },
                ctrlKey: false
            };

            window.open = jest.fn();
            const league = { leagueId: 12036, leagueNameVN: 'Euro', season: null};
            const container = shallow(<MatchGrid {...defaultProps} />);
            const instance = container.instance();
            CommonFunctions.getLeaguePageUrl = jest.fn().mockReturnValue('/lich-thi-dau/bong-da');
            // Act
            instance.handleClickLeague(event, league);

            // Assert
            expect(window.open).toHaveBeenCalledTimes(0);
            expect(window.location).toEqual('/lich-thi-dau/bong-da');
        });

        it('calls correctly when ctrlKey = true', () => {
           // Arrange
           const event = {
                target: { className: '' },
                ctrlKey: true
            };
            window.open = jest.fn();
            const league = { leagueId: 12036, leagueNameVN: 'Euro', season: {seasonId: 123} };
            const container = shallow(<MatchGrid {...defaultProps} />);
            const instance = container.instance();
            CommonFunctions.getLeaguePageUrl = jest.fn().mockReturnValue('/lich-thi-dau/bong-da');

            // Act
            instance.handleClickLeague(event, league);

            // Assert
            expect(window.open).toHaveBeenCalledWith('/lich-thi-dau/bong-da', '_blank');
        });
    });

    describe('renders', () => {
        it('return null when matches is empty', () => {
            // Arrange
            const container = shallow(<MatchGrid {...defaultProps} />);
            const instance = container.instance();

            // Act
            const result = instance.render();

            // Assert
            expect(result).toEqual(null);
        });

        it('render correctly when current matches is empty', () => {
            // Arrange
            const matches = [
                {
                    matchId: 1,
                    status:50,
                    endTime: '2023-09-01',
                    startTime: '2023-09-01',
                    league: {leagueNameVN: 'league'}
                },
                {
                    matchId: 2,
                    status:50,
                    endTime: '2023-11-01',
                    startTime: '2023-11-01',
                    league: {leagueNameVN: 'league'}
                }
            ]
            const props = {
                ...defaultProps,
                matches: matches,
                league: {leagueNameVN: 'league'}
            }
            DateTimeService.getCurrentClientDateTime = jest.fn().mockReturnValue('2023-10-01');

            // Act
            const container = shallow(<MatchGrid {...props} />);

            // Assert
            expect(container).toEqual({});
        });

        it('render correctly when matches have data', () => {
            // Arrange
            const matches = [
                {
                    matchId: 1,
                    status:50,
                    endTime: '2023-09-01',
                    startTime: '2023-09-01',
                    league: {leagueNameVN: 'league'}
                },
                {
                    matchId: 2,
                    status:0,
                    endTime: '2023-11-01',
                    startTime: '2023-11-01',
                    league: {leagueNameVN: 'league'}
                }
            ]
            const props = {
                ...defaultProps,
                matches: matches,
                league: {leagueNameVN: 'league'}
            }
            DateTimeService.getCurrentClientDateTime = jest.fn().mockReturnValue('2023-10-01');

            // Act
            const container = shallow(<MatchGrid {...props} />);

            // Assert
            container.find('.round-name').simulate('click', {ctrlKey: true});
            container.find('.live-score-nav li').at(0).simulate('click', 'fixture');
            container.find('.live-score-nav li').at(1).simulate('click', 'standing');
            expect(container).toMatchSnapshot();
        });

        it('render correctly when selectedTab = result', () => {
            // Arrange
            const matches = [
                {
                    matchId: 1,
                    status:50,
                    endTime: '2023-09-01',
                    startTime: '2023-09-01',
                    league: {leagueNameVN: 'league'}
                },
                {
                    matchId: 2,
                    status:0,
                    endTime: '2023-11-01',
                    startTime: '2023-11-01',
                    league: {leagueNameVN: 'league'}
                }
            ]
            const props = {
                ...defaultProps,
                matches: matches,
                league: {leagueNameVN: 'league'}
            }
            DateTimeService.getCurrentClientDateTime = jest.fn().mockReturnValue('2023-10-01');
            const container = shallow(<MatchGrid {...props} />);
            const instance = container.instance();
            instance.selectedTab = 'result';
            instance.getCurrentMatches = jest.fn().mockReturnValue(matches);
            // Act
            const result = instance.render();

            // Assert
            expect(result).toMatchSnapshot();
        });
    });

});