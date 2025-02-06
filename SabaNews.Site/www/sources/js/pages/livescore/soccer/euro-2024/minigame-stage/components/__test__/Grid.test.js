import React from 'react';
import { shallow } from 'enzyme';
import Grid  from '../Grid';

describe('Grid', () => {
    const defaultProps = {
        matches: [],
        startNum: 0
    };

    afterEach(() => {
        jest.clearAllMocks();
    });


    describe('renders', () => {
        it('render correctly when call function', () => {
            // Arrange
            window.stage = 1;
            const matches = [{
                matchId: 1,
                stage: {stageId: 30537},
                homeTeamTotalScore: 2,
                awayTeamTotalScore: 0,
                status: 50,
                homeTeam: {teamId: 1},
                awayTeam: {teamId: 2}
            },
            {
                matchId: 2,
                stage: {stageId: 30537},
                homeTeamTotalScore: 0,
                awayTeamTotalScore: 2,
                status: 50,
                homeTeam: {teamId: 3},
                awayTeam: {teamId: 4}
            },
            {
                matchId: 3,
                stage: {stageId: 30537},
                homeTeamTotalScore: 1,
                awayTeamTotalScore: 1,
                status: 50,
                homeTeam: {teamId: 5},
                awayTeam: {teamId: 6}
            }
            ];
            const props = {
                ...defaultProps,
                matches: matches,
            }
            const container = shallow(<Grid {...props} />);
            const instance = container.instance();
            // Act
            const result = instance.render();

            // Assert
            expect(result).toMatchSnapshot()
        });
    });
})