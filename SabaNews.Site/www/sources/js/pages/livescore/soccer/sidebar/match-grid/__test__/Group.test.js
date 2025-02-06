import React from 'react';
import { shallow } from 'enzyme';
import Group from '../Group';

describe('GroupMatch', () => {
    const defaultProps = {
        league: null,
        matches: []
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('groupMatches', () => {
        it('return as expected when isShowMoreGroup is true', () => {
            // Arrange
            const matches = [
                { matchId: 1, startTime: '2022-05-25' },
                { matchId: 2, startTime: '2022-05-25' },
                { matchId: 3, startTime: '2022-05-26' }
            ];
            const reponse = [
                {
                    key: '2022-05-25', text: '25/05',
                    childs: [
                        { matchId: 1, startTime: '2022-05-25' },
                        { matchId: 2, startTime: '2022-05-25' }
                    ]
                },
                {
                    key: '2022-05-26', text: '26/05',
                    childs: [
                        { matchId: 3, startTime: '2022-05-26' }
                    ]
                }
            ]
            const container = shallow(<Group {...defaultProps} />);
            const instance = container.instance();
            instance.isShowMoreGroup = jest.fn().mockReturnValue(true);

            // Act
            const result = instance.groupMatches(matches);

            // Assert
            expect(result).toEqual(reponse);
        });

        it('return as expected when isShowMoreGroup is false', () => {
            // Arrange
            const matches = [
                { matchId: 1, startTime: '2022-05-25' },
                { matchId: 2, startTime: '2022-05-25' },
                { matchId: 3, startTime: '2022-05-26' }
            ];
            const reponse = [
                {
                    key: '2022-05-25', text: '25/05',
                    childs: [
                        { matchId: 1, startTime: '2022-05-25' },
                        { matchId: 2, startTime: '2022-05-25' }
                    ]
                }
            ]
            const container = shallow(<Group {...defaultProps} />);
            const instance = container.instance();
            instance.isShowMoreGroup = jest.fn().mockReturnValue(false);

            // Act
            const result = instance.groupMatches(matches);

            // Assert
            expect(result).toEqual(reponse);
        });
    });

    describe('isShowMoreGroup', () => {
        it('return correctly when isFixture = false', () => {
            // Arrange
            const container = shallow(<Group {...defaultProps} />);
            const instance = container.instance();

            // Act
            const result = instance.isShowMoreGroup(false, []);

            // Assert
            expect(result).toEqual(false);
        });

        it('return correctly when isFixture = true & isShowMore = true', () => {
            // Arrange
            const matches = [
                {
                    key: '2022-05-25', text: '25/05',
                    childs: [
                        { matchId: 1, status: 10, startTime: '2022-05-25' },
                        { matchId: 2, status: 20, startTime: '2022-05-25' }
                    ]
                }
            ]
            const container = shallow(<Group {...defaultProps} />);
            const instance = container.instance();

            // Act
            const result = instance.isShowMoreGroup(true, matches);

            // Assert
            expect(result).toEqual(true);
        });


        it('return correctly when isFixture = true & isShowMore = false, last match is livematch', () => {
            // Arrange
            const matches = [
                {key: 'key 1'}, {key: 'key 2'},
                {
                    key: '2022-05-25', text: '25/05',
                    childs: [
                        { matchId: 1, status: 10, startTime: '2022-05-25' },
                        { matchId: 2, status: 10, startTime: '2022-05-25' }
                    ]
                }
            ]
            const container = shallow(<Group {...defaultProps} />);
            const instance = container.instance();

            // Act
            const result = instance.isShowMoreGroup(true, matches);

            // Assert
            expect(result).toEqual(false);
        });

    it('return correctly when isFixture = true & isShowMore = false, last match is pre match', () => {
            // Arrange
            const matches = [
                {
                    key: '2022-05-25', text: '25/05',
                    childs: [
                        { matchId: 1, status: 10, startTime: '2022-05-25' },
                        { matchId: 2, status: 0, startTime: '2022-05-25' }
                    ]
                }
            ]
            const container = shallow(<Group {...defaultProps} />);
            const instance = container.instance();

            // Act
            const result = instance.isShowMoreGroup(true, matches);

            // Assert
            expect(result).toEqual(false);
        });
    });

    describe('renders', () => {
        it('render correctly', () => {
            // Arrange
            const matches = [
                { matchId: 1, startTime: '2022-05-25' },
                { matchId: 2, startTime: '2022-05-25' },
                { matchId: 3, startTime: '2022-05-26' }
            ];
            const props = {
                ...defaultProps,
                matches: matches
            }
            const container = shallow(<Group {...props} />);
            const instance = container.instance();

            // Act
            const result = instance.render();

            // Assert
            expect(result).toMatchSnapshot();
        })
    })
})