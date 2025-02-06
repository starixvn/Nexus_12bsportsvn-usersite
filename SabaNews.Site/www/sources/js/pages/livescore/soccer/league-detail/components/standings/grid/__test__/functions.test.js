import React from 'react';
import * as funcs from '../functions';

describe('functions', () => {
    afterAll(() => {
        jest.clearAllMocks();
    });

    describe('getMatchResult', () => {
        it('return as expected when homeTeamPenaltyScore > 0', () => {
            // Arrange
            const match = {
                homeTeamId: 1,
                awayTeamId: 2,
                homeTeamPenaltyScore: 3,
                awayTeamPenaltyScore: 0
            };

            // Act
            const result = funcs.getMatchResult(1, match);

            // Assert
            expect(result).toEqual(<div className="wld win">T</div>);
        });

        it('return as expected when awayTeamPenaltyScore > 0', () => {
            // Arrange
            const match = {
                homeTeamId: 1,
                awayTeamId: 2,
                homeTeamPenaltyScore: 0,
                awayTeamPenaltyScore: 2
            };

            // Act
            const result = funcs.getMatchResult(2, match);

            // Assert
            expect(result).toEqual(<div className="wld win">T</div>);
        });

        it('return as expected when isSecondLeg = true and homeTeamAggregateScore > 0', () => {
            // Arrange
            const match = {
                homeTeamId: 1,
                awayTeamId: 2,
                homeTeamAggregateScore: 3,
                awayTeamAggregateScore: 0,
                isSecondLeg: true
            };

            // Act
            const result = funcs.getMatchResult(1, match);

            // Assert
            expect(result).toEqual(<div className="wld win">T</div>);
        });

        it('return as expected when isSecondLeg = true and awayTeamAggregateScore > 0', () => {
            // Arrange
            const match = {
                homeTeamId: 1,
                awayTeamId: 2,
                homeTeamAggregateScore: 0,
                awayTeamAggregateScore: 2,
                isSecondLeg: true
            };

            // Act
            const result = funcs.getMatchResult(1, match);

            // Assert
            expect(result).toEqual(<div className="wld loss">B</div>);
        });

        it('return as expected when homeTeamExtraScore > 0', () => {
            // Arrange
            const match = {
                homeTeamId: 1,
                awayTeamId: 2,
                homeTeamExtraScore: 3,
                awayTeamExtraScore: 0
            };

            // Act
            const result = funcs.getMatchResult(1, match);

            // Assert
            expect(result).toEqual(<div className="wld win">T</div>);
        });

        it('return as expected when awayTeamExtraScore > 0', () => {
            // Arrange
            const match = {
                homeTeamId: 1,
                awayTeamId: 2,
                homeTeamExtraScore: 0,
                awayTeamExtraScore: 2
            };

            // Act
            const result = funcs.getMatchResult(2, match);

            // Assert
            expect(result).toEqual(<div className="wld win">T</div>);
        });

        it('return as expected when homeTeamTotalScore > 0', () => {
            // Arrange
            const match = {
                homeTeamId: 1,
                awayTeamId: 2,
                homeTeamTotalScore: 3,
                awayTeamTotalScore: 0
            };

            // Act
            const result = funcs.getMatchResult(1, match);

            // Assert
            expect(result).toEqual(<div className="wld win">T</div>);
        });

        it('return as expected when awayTeamTotalScore > 0', () => {
            // Arrange
            const match = {
                homeTeamId: 1,
                awayTeamId: 2,
                homeTeamTotalScore: 0,
                awayTeamTotalScore: 2
            };

            // Act
            const result = funcs.getMatchResult(2, match);

            // Assert
            expect(result).toEqual(<div className="wld win">T</div>);
        });

        it('return as expected when homeTeamTotalScore < awayTeamTotalScore', () => {
            // Arrange
            const match = {
                homeTeamId: 1,
                awayTeamId: 2,
                homeTeamTotalScore: 2,
                awayTeamTotalScore: 3
            };

            // Act
            const result = funcs.getMatchResult(1, match);

            // Assert
            expect(result).toEqual(<div className="wld loss">B</div>);
        });

        it('return as expected when homeTeamTotalScore = awayTeamTotalScore', () => {
            // Arrange
            const match = {
                homeTeamId: 1,
                awayTeamId: 2,
                homeTeamTotalScore: 2,
                awayTeamTotalScore: 2
            };

            // Act
            const result = funcs.getMatchResult(1, match);

            // Assert
            expect(result).toEqual(<div className="wld draw">H</div>);
        });
    });
});