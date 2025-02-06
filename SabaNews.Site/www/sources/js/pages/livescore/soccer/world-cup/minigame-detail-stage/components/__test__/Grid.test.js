import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import Grid  from '../Grid';
import CommonFunctions from '@jsroot/common/common-functions';
import DateTimeService from '@jsroot/common/dateTimeService';
import Site from '@jsroot/common/site';


describe('Grid', () => {
    const defaultProps = {
        matches: [],
        votes: []
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('checkMatchResult', () => {
        it('return correctly when call function', () => {
            // Arrange
            const match = {
                matchId: 1,
                stage: {stageId: 30537},
                homeTeamTotalScore: 2,
                awayTeamTotalScore: 0,
                status: 50,
                homeTeam: {teamId: 1},
                awayTeam: {teamId: 2}
            };
            const vote = {matchId: 1, teamId: 1}
            const container = shallow(<Grid {...defaultProps} />);
            const instance = container.instance();

            // Act
            const result = instance.checkMatchResult(match, vote);

            // Assert
            expect(result).toEqual({score: 10, status: true});
        });
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
                votes: [{matchId: 1, team: 1, stage: 1}, {matchId: 2, team: 3, stage: 1}]
            }
            const container = shallow(<Grid {...props} />);
            const instance = container.instance();
            //instance.checkMatchResult = jest.fn().mockReturnValueOnce({score: 10, status: true}).mockReturnValueOnce({score: 10, status: true});
            // Act
            const result = instance.render();

            // Assert
            expect(result).toMatchSnapshot()
        });
    });
})