import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import Grid from '../Grid';

describe('Grid', () => {
    const defaultProps = {
        searchKey: 'searchKey',
        league: { leagueId: 1 },
        matches: []
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
                matches: []
            });
        });
    });

    describe('componentDidUpdate', () => {
        it('updates correctly state', () => {
            // Arrange
            const matches = [
                { key: '1', childs: [{ matchId: 1 }, { matchId: 2 }] },
                { key: '2', childs: [{ matchId: 3 }, { matchId: 4 }] }
            ];
            const container = shallow(<Grid {...defaultProps} />);
            container.setProps({ matches });
            const instance = container.instance();
            instance.getGroupIndex = jest.fn(() => 0);

            // Act
            instance.componentDidUpdate({ matches: [] });

            // Assert
            expect(instance.state).toEqual({
                groupIndex: 1,
                pageIndex: 0,
                hasMore: true,
                matches: [{ key: '1', childs: [{ matchId: 1 }, { matchId: 2 }] }]
            });
        });
    });

    describe('getGroupIndex', () => {
        it('return as expected when child has key', () => {
            // Arrange
            const matches = [
                {
                    key: '1',
                    childs: [
                        { key: '1', childs: [{ matchId: 1 }, { matchId: 2 }] },
                        { key: '2', childs: [{ matchId: 3 }, { matchId: 4 }] }
                    ]
                },
                {
                    key: '2',
                    childs: [
                        { key: '1', childs: [{ matchId: 5 }, { matchId: 6 }] },
                        { key: '2', childs: [{ matchId: 7 }, { matchId: 8 }] }
                    ]
                }
            ];
            const container = shallow(<Grid {...defaultProps} />);
            const instance = container.instance();
            instance.batchSize = 3;

            // Act
            const result = instance.getGroupIndex(matches, 0);

            // Assert
            expect(result).toEqual(0);
        });

        it('return as expected when child do not have key', () => {
            // Arrange
            const matches = [
                { key: '1', childs: [{ matchId: 1 }, { matchId: 2 }] },
                { key: '2', childs: [{ matchId: 3 }, { matchId: 4 }] }
                
            ];
            const container = shallow(<Grid {...defaultProps} />);
            const instance = container.instance();
            instance.batchSize = 3;

            // Act
            const result = instance.getGroupIndex(matches, 0);

            // Assert
            expect(result).toEqual(1);
        });
    });

    describe('loadMore', () => {
        it('updates correctly state', () => {
            // Arrange
            const props = {
                ...defaultProps,
                matches: [
                    { key: '1', childs: [{ matchId: 1 }, { matchId: 2 }] },
                    { key: '2', childs: [{ matchId: 3 }, { matchId: 4 }] },
                    { key: '3', childs: [{ matchId: 5 }, { matchId: 6 }, { matchId: 7 }] }
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
                matches: [
                    { key: '1', childs: [{ matchId: 1 }, { matchId: 2 }] },
                    { key: '2', childs: [{ matchId: 3 }, { matchId: 4 }] }
                ]
            });
        });
    });

    it('renders correctly', () => {
        // Arrange
        const props = {
            ...defaultProps,
            matches: [
                { key: '1', childs: [{ matchId: 1 }, { matchId: 2 }] },
                { key: '2', childs: [{ matchId: 3 }, { matchId: 4 }] }
            ]
        };

        // Act
        const container = shallow(<Grid {...props} />);

        // Assert
        expect(toJson(container)).toMatchSnapshot();
    });
});