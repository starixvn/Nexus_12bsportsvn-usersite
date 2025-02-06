import React from 'react';
import { shallow } from 'enzyme';
import Grid from '../Grid';

describe('Grid', () => {
    const defaultProps = {
        matches: [],
        votes: []
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getVotesByStage', () => {
        it('return correctly when call function', () => {
            // Arrange
            const props = {
            ...defaultProps,
            votes: [{matchId: 1, stage: 1}, {matchId: 2, stage: 2}]
            }
            const container = shallow(<Grid {...props} />);
            const instance = container.instance();

            // Act
            const result = instance.getVotesByStage(1);

            // Assert
            expect(result).toEqual([{matchId: 1, stage: 1}]);
        });
    });

    describe('getMatchByStage', () => {
        it('return correctly when event stage = 1', () => {
            // Arrange
            const props = {
                ...defaultProps,
                matches: [{stage:{stageId: 30537}}, {stage:{stageId: 30540}}]
            };
            const container = shallow(<Grid {...props} />);
            const instance = container.instance();

            // Act
            const result = instance.getMatchByStage(1);

            // Assert
            expect(result).toEqual([{stage:{stageId: 30537}}]);
        });

        it('return correctly when event stage = 2', () => {
            // Arrange
            const props = {
                ...defaultProps,
                matches: [{stage:{stageId: 30537}}, {stage:{stageId: 30540}}]
            };
            const container = shallow(<Grid {...props} />);
            const instance = container.instance();

            // Act
            const result = instance.getMatchByStage(2);

            // Assert
            expect(result).toEqual([]);
        });

        it('return correctly when event stage = 3', () => {
            // Arrange
            const props = {
                ...defaultProps,
                matches: [{stage:{stageId: 30537}}, {stage:{stageId: 30540}}]
            };
            const container = shallow(<Grid {...props} />);
            const instance = container.instance();

            // Act
            const result = instance.getMatchByStage(3);

            // Assert
            expect(result).toEqual([]);
        });

        it('return correctly when event stage = 4', () => {
            // Arrange
            const props = {
                ...defaultProps,
                matches: [{stage:{stageId: 30537}}, {stage:{stageId: 30540}}]
            };
            const container = shallow(<Grid {...props} />);
            const instance = container.instance();

            // Act
            const result = instance.getMatchByStage(4);

            // Assert
            expect(result).toEqual([{stage:{stageId: 30540}}]);
        });

        it('return correctly when event stage = 5', () => {
            // Arrange
            const props = {
                ...defaultProps,
                matches: [{stage:{stageId: 30537}}, {stage:{stageId: 30540}}]
            };
            const container = shallow(<Grid {...props} />);
            const instance = container.instance();

            // Act
            const result = instance.getMatchByStage(5);

            // Assert
            expect(result).toEqual([]);
        });
    });

    describe('render', () => {
        it('render correctly', () =>  {
            // Arrange
            const props = {
                ...defaultProps,
                matches: [{stage:{stageId: 30537}}, {stage:{stageId: 30540}}]
            };
            const container = shallow(<Grid {...props} />);
            const instance = container.instance();

            // Act
            const result = instance.render();

            // Assert
            expect(result).toMatchSnapshot();
        });
    })
});