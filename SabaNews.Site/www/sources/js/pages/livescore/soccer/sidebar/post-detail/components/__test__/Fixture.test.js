import React from 'react';
import { shallow } from 'enzyme';
import Fixture from '../Fixture';
import toJson from 'enzyme-to-json';
import CommonFunctions from '@jsroot/common/common-functions';

describe('Fixture', () => {
    const defaultProps = {
        data: [],
        today: '2023-08-21',
        url: 'lich-thi-dau/bong-da'
    };
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('handleClickFixture', () => {
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
            const container = shallow(<Fixture {...defaultProps} />);
            // Act
            container.find('.block__title a').simulate('click', event);

            // Assert
            expect(window.open).toHaveBeenCalledWith('lich-thi-dau/bong-da', '_blank');
        });

        it('calls correctly when ctrlKey = false', () => {
            // Arrange
            const event = {
                ctrlKey: false
            };
            window.open = jest.fn();
            const container = shallow(<Fixture {...defaultProps} />);
            // Act
            container.find('.block__title a').simulate('click', event);

            // Assert
            expect(window.open).toHaveBeenCalledTimes(0);
            expect(window.location).toEqual('lich-thi-dau/bong-da');
        });
    });

    describe('groupMatches', () => {
        it('return correctly when match is null', () => {
            // Arrange
            const matches = null;
            const instance = shallow(<Fixture {...defaultProps} />).instance();
            // Act
            const result = instance.groupMatches(matches);

            // Assert
            expect(result).toEqual([]);
        });
        it('return correctly when match is empty', () => {
            // Arrange
            const matches = [];
            const instance = shallow(<Fixture {...defaultProps} />).instance();
            // Act
            const result = instance.groupMatches(matches);

            // Assert
            expect(result).toEqual([]);
        });

        it('return correctly when call function', () => {
            // Arrange
            const matches = [
                { matchId: 1, league: { leagueId: 1 } },
                { matchId: 2, league: { leagueId: 1 } },
                { matchId: 3, league: { leagueId: 2 } },
                { matchId: 4, league: { leagueId: 2 } }
            ];
            const response = [
                {
                    key: 1,
                    league: { leagueId: 1 },
                    matches: [{ matchId: 1, league: { leagueId: 1 } }, { matchId: 2, league: { leagueId: 1 } }]
                },
                {
                    key: 2,
                    league: { leagueId: 2 },
                    matches: [{ matchId: 3, league: { leagueId: 2 } }, { matchId: 4, league: { leagueId: 2 } }]
                }
            ]
            const instance = shallow(<Fixture {...defaultProps} />).instance();

            // Act
            const result = instance.groupMatches(matches);

            // Assert
            expect(result).toEqual(response);
        });
    });
    describe('render', () => {
        it('renders correctly when group.length = 0', () => {
            // Arrange
            const props = {
                ...defaultProps,
                data: null
            };
            // Act
            const container = shallow(<Fixture {...props} />);

            // Assert
            expect(toJson(container)).toMatchSnapshot();
        });
        it('renders correctly when data have data', () => {
            const props = {
                ...defaultProps,
                data: [
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
            const container = shallow(<Fixture {...props} />);

            // Assert
            expect(toJson(container)).toMatchSnapshot();
        });
    });
});