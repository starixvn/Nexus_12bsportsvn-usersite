import React from 'react';
import { shallow } from 'enzyme';
import Grid from '../Grid';

describe('Grid', () => {
    const defaultProps = {
        matches: [],
        votes: [],
        statusStages: []
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