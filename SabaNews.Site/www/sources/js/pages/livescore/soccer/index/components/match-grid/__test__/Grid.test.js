import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import Grid from '../Grid';

describe('Grid', () => {
    const defaultProps = {
        selectedDate: '2022-05-25',
        searchKey: '',
        leagues: []
    };

    afterAll(() => {
        jest.clearAllMocks();
    });

    describe('constructor', () => {
        it('inital correctly state', () => {
            // Arrange
            const container = shallow(<Grid {...defaultProps} />);

            // Act
            const instance = container.instance();

            // Assert
            expect(instance.state).toEqual({
                groupIndex: 1,
                pageIndex: 0,
                hasMore: false,
                leagues: []
            });
        });
    });

    describe('componentDidUpdate', () => {
        it('updates correctly state', () => {
            // Arrange
            const leagues = [
                { leagueId: 1, matches: [{ matchId: 1 }, { matchId: 2 }] },
                { leagueId: 2, matches: [{ matchId: 3 }, { matchId: 4 }] }
            ];
            const container = shallow(<Grid {...defaultProps} />);
            container.setProps({ leagues });
            const instance = container.instance();
            instance.getGroupIndex = jest.fn(() => 0);

            // Act
            instance.componentDidUpdate({ leagues: [] });

            // Assert
            expect(instance.state).toEqual({
                groupIndex: 1,
                pageIndex: 0,
                hasMore: true,
                leagues: [
                    { leagueId: 1, matches: [{ matchId: 1 }, { matchId: 2 }] }
                ]
            });
        });
    });

    describe('getGroupIndex', () => {
        it('return as expected', () => {
            // Arrange
            const leagues = [
                { leagueId: 1, matches: [{ matchId: 1 }, { matchId: 2 }] },
                { leagueId: 2, matches: [{ matchId: 3 }, { matchId: 4 }] }
            ];
            const container = shallow(<Grid {...defaultProps} />);
            const instance = container.instance();
            instance.batchSize = 3;

            // Act
            const result = instance.getGroupIndex(leagues, 0);

            // Assert
            expect(result).toEqual(1);
        });
    });

    describe('loadMore', () => {
        it('updates correctly state', () => {
            // Arrange
            const props = {
                ...defaultProps,
                leagues: [
                    { leagueId: 1, matches: [{ matchId: 1 }, { matchId: 2 }] },
                    { leagueId: 2, matches: [{ matchId: 3 }, { matchId: 4 }] },
                    { leagueId: 3, matches: [{ matchId: 5 }, { matchId: 6 }, { matchId: 7 }] }
                ]
            };
            const container = shallow(<Grid {...props} />);
            const instance = container.instance();
            instance.getGroupIndex = jest.fn(() => 1);

            // Act
            instance.loadMore(1);

            // Assert
            expect(instance.state).toEqual({
                groupIndex: 2,
                pageIndex: 1,
                hasMore: true,
                leagues: [
                    { leagueId: 1, matches: [{ matchId: 1 }, { matchId: 2 }] },
                    { leagueId: 2, matches: [{ matchId: 3 }, { matchId: 4 }] }
                ]
            });
        });
    });

    it('renders correctly', () => {
        // Arrange
        const props = {
            ...defaultProps,
            leagues: [
                { leagueId: 1, matches: [{ matchId: 1 }, { matchId: 2 }] },
                { leagueId: 2, matches: [{ matchId: 3 }, { matchId: 4 }] },
                { leagueId: 3, matches: [{ matchId: 5 }, { matchId: 6 }, { matchId: 7 }] }
            ]
        };

        // Act
        const container = shallow(<Grid {...props} />);

        // Assert
        expect(toJson(container)).toMatchSnapshot();
    });
});