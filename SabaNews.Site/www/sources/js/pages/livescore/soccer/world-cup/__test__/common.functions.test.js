import Site from '@jsroot/common/site';
import DataService from '@jsroot/common/dataService';
import functions from '../common.functions';
import CommonFunctions from '@jsroot/common/common-functions';
import dayjs from 'dayjs';

describe('common.functions', () => {
    beforeAll(() => {
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getMatchByEventStage', () => {
        it('return correctly when stage = 1', () => {
             //Arrange
            window.stage = 1;
            const matches = [{matchId: 1, stage:{stageId:30537}}, {matchId: 2, stage:{stageId:30537}}];

            //Act
            const result = functions.getMatchByEventStage(matches);

            //Assert
            expect(result).toEqual(matches);
        });

        it('return correctly when stage = 2', () => {
            //Arrange
           window.stage = 2;
           const matches = [{matchId: 1, stage:{stageId:30537}}, {matchId: 2, stage:{stageId:30537}}, , {matchId: 3, stage:{stageId:30537}}, , {matchId: 4, stage:{stageId:30537}}, {matchId: 5, stage:{stageId:30537}}, {matchId: 6, stage:{stageId:30537}},
            {matchId: 7, stage:{stageId:30537}}, {matchId: 8, stage:{stageId:30537}}, {matchId: 9, stage:{stageId:30537}}, {matchId: 10, stage:{stageId:30537}},, {matchId: 11, stage:{stageId:30537}}, {matchId:12, stage:{stageId:30537}},
            {matchId: 13, stage:{stageId:30537}}, {matchId: 14, stage:{stageId:30537}}, {matchId: 15, stage:{stageId:30537}}, {matchId: 16, stage:{stageId:30537}}, {matchId: 17, stage:{stageId:30537}}, {matchId: 18, stage:{stageId:30537}},
            {matchId: 19, stage:{stageId:30537}}, {matchId: 20, stage:{stageId:30537}}, {matchId: 21, stage:{stageId:30537}}, {matchId: 22, stage:{stageId:30537}}, {matchId: 23, stage:{stageId:30537}}, {matchId: 24, stage:{stageId:30537}},
            {matchId: 25, stage:{stageId:30537}}, {matchId: 26, stage:{stageId:30537}}, {matchId: 27, stage:{stageId:30537}}, {matchId: 28, stage:{stageId:30537}}, {matchId: 29, stage:{stageId:30537}}, {matchId: 30, stage:{stageId:30537}},
            {matchId: 31, stage:{stageId:30537}}, {matchId: 32, stage:{stageId:30537}}];

        const expected =  [ {matchId: 17, stage:{stageId:30537}}, {matchId: 18, stage:{stageId:30537}},
            {matchId: 19, stage:{stageId:30537}}, {matchId: 20, stage:{stageId:30537}}, {matchId: 21, stage:{stageId:30537}}, {matchId: 22, stage:{stageId:30537}}, {matchId: 23, stage:{stageId:30537}}, {matchId: 24, stage:{stageId:30537}},
            {matchId: 25, stage:{stageId:30537}}, {matchId: 26, stage:{stageId:30537}}, {matchId: 27, stage:{stageId:30537}}, {matchId: 28, stage:{stageId:30537}}, {matchId: 29, stage:{stageId:30537}}, {matchId: 30, stage:{stageId:30537}},
            {matchId: 31, stage:{stageId:30537}}, {matchId: 32, stage:{stageId:30537}}];

           //Act
           const result = functions.getMatchByEventStage(matches);

           //Assert
           expect(result).toEqual(expected);
       });

       it('return correctly when stage = 3', () => {
            //Arrange
           window.stage = 3;
           const matches = [{matchId: 1, stage:{stageId:30537}}, {matchId: 2, stage:{stageId:30537}}, , {matchId: 3, stage:{stageId:30537}}, , {matchId: 4, stage:{stageId:30537}}, {matchId: 5, stage:{stageId:30537}}, {matchId: 6, stage:{stageId:30537}},
                {matchId: 7, stage:{stageId:30537}}, {matchId: 8, stage:{stageId:30537}}, {matchId: 9, stage:{stageId:30537}}, , {matchId: 10, stage:{stageId:30537}},, {matchId: 11, stage:{stageId:30537}}, {matchId:12, stage:{stageId:30537}},
                {matchId: 13, stage:{stageId:30537}}, {matchId: 14, stage:{stageId:30537}}, {matchId: 15, stage:{stageId:30537}}, {matchId: 16, stage:{stageId:30537}}, {matchId: 17, stage:{stageId:30537}}, {matchId: 18, stage:{stageId:30537}},
                {matchId: 19, stage:{stageId:30537}}, {matchId: 20, stage:{stageId:30537}}, {matchId: 21, stage:{stageId:30537}}, {matchId: 22, stage:{stageId:30537}}, {matchId: 23, stage:{stageId:30537}}, {matchId: 24, stage:{stageId:30537}},
                {matchId: 25, stage:{stageId:30537}}, {matchId: 26, stage:{stageId:30537}}, {matchId: 27, stage:{stageId:30537}},  {matchId: 28, stage:{stageId:30537}}, {matchId: 29, stage:{stageId:30537}}, {matchId: 30, stage:{stageId:30537}},
                {matchId: 31, stage:{stageId:30537}}, {matchId: 32, stage:{stageId:30537}}, {matchId: 33, stage:{stageId:30537}}, {matchId: 34, stage:{stageId:30537}}, {matchId: 35, stage:{stageId:30537}}, {matchId: 36, stage:{stageId:30537}},
                {matchId: 37, stage:{stageId:30537}}, {matchId: 38, stage:{stageId:30537}}, {matchId: 39, stage:{stageId:30537}}, {matchId: 40, stage:{stageId:30537}}, {matchId: 41, stage:{stageId:30537}}, {matchId: 42, stage:{stageId:30537}}];

            const expected =  [ {matchId: 33, stage:{stageId:30537}}, {matchId: 34, stage:{stageId:30537}}, {matchId: 35, stage:{stageId:30537}}, {matchId: 36, stage:{stageId:30537}},
                {matchId: 37, stage:{stageId:30537}}, {matchId: 38, stage:{stageId:30537}}, {matchId: 39, stage:{stageId:30537}}, {matchId: 40, stage:{stageId:30537}}, {matchId: 41, stage:{stageId:30537}}, {matchId: 42, stage:{stageId:30537}}];

           //Act
           const result = functions.getMatchByEventStage(matches);

           //Assert
           expect(result).toEqual(expected);
       });

        it('return correctly when stage = 4', () => {
             //Arrange
            window.stage = 4;
            const matches = [{matchId: 1, stage:{stageId:30538}}, {matchId: 2, stage:{stageId:30538}}];

            //Act
            const result = functions.getMatchByEventStage(matches);

            //Assert
            expect(result).toEqual(matches);
        });

        it('return correctly when stage = 5', () => {
            //Arrange
           window.stage = 5;
           const matches = [{matchId: 1, stage:{stageId:30538}}, {matchId: 2, stage:{stageId:30538}}];

           //Act
           const result = functions.getMatchByEventStage(matches);

           //Assert
           expect(result).toEqual([]);
        });
    });

    describe('getMatchByEventStage', () => {
        it('return correctly when stage = 1', () => {
             //Arrange
            const matches = [{matchId: 1, stage:{stageId:30537}}, {matchId: 2, stage:{stageId:30537}}];

            //Act
            const result = functions.getMatchesByStage(matches, 1);

            //Assert
            expect(result).toEqual(matches);
        });

        it('return correctly when stage = 2', () => {
            //Arrange
           const matches = [{matchId: 1, stage:{stageId:30537}}, {matchId: 2, stage:{stageId:30537}}, , {matchId: 3, stage:{stageId:30537}}, , {matchId: 4, stage:{stageId:30537}}, {matchId: 5, stage:{stageId:30537}}, {matchId: 6, stage:{stageId:30537}},
            {matchId: 7, stage:{stageId:30537}}, {matchId: 8, stage:{stageId:30537}}, {matchId: 9, stage:{stageId:30537}}, {matchId: 10, stage:{stageId:30537}},, {matchId: 11, stage:{stageId:30537}}, {matchId:12, stage:{stageId:30537}},
            {matchId: 13, stage:{stageId:30537}}, {matchId: 14, stage:{stageId:30537}}, {matchId: 15, stage:{stageId:30537}}, {matchId: 16, stage:{stageId:30537}}, {matchId: 17, stage:{stageId:30537}}, {matchId: 18, stage:{stageId:30537}},
            {matchId: 19, stage:{stageId:30537}}, {matchId: 20, stage:{stageId:30537}}, {matchId: 21, stage:{stageId:30537}}, {matchId: 22, stage:{stageId:30537}}, {matchId: 23, stage:{stageId:30537}}, {matchId: 24, stage:{stageId:30537}},
            {matchId: 25, stage:{stageId:30537}}, {matchId: 26, stage:{stageId:30537}}, {matchId: 27, stage:{stageId:30537}}, {matchId: 28, stage:{stageId:30537}}, {matchId: 29, stage:{stageId:30537}}, {matchId: 30, stage:{stageId:30537}},
            {matchId: 31, stage:{stageId:30537}}, {matchId: 32, stage:{stageId:30537}}];

            const expected =  [ {matchId: 17, stage:{stageId:30537}}, {matchId: 18, stage:{stageId:30537}},
            {matchId: 19, stage:{stageId:30537}}, {matchId: 20, stage:{stageId:30537}}, {matchId: 21, stage:{stageId:30537}}, {matchId: 22, stage:{stageId:30537}}, {matchId: 23, stage:{stageId:30537}}, {matchId: 24, stage:{stageId:30537}},
            {matchId: 25, stage:{stageId:30537}}, {matchId: 26, stage:{stageId:30537}}, {matchId: 27, stage:{stageId:30537}}, {matchId: 28, stage:{stageId:30537}}, {matchId: 29, stage:{stageId:30537}}, {matchId: 30, stage:{stageId:30537}},
            {matchId: 31, stage:{stageId:30537}}, {matchId: 32, stage:{stageId:30537}}];

           //Act
           const result = functions.getMatchesByStage(matches, 2);

           //Assert
           expect(result).toEqual(expected);
       });

       it('return correctly when stage = 3', () => {
            //Arrange
           const matches = [{matchId: 1, stage:{stageId:30537}}, {matchId: 2, stage:{stageId:30537}}, , {matchId: 3, stage:{stageId:30537}}, , {matchId: 4, stage:{stageId:30537}}, {matchId: 5, stage:{stageId:30537}}, {matchId: 6, stage:{stageId:30537}},
                {matchId: 7, stage:{stageId:30537}}, {matchId: 8, stage:{stageId:30537}}, {matchId: 9, stage:{stageId:30537}}, , {matchId: 10, stage:{stageId:30537}},, {matchId: 11, stage:{stageId:30537}}, {matchId:12, stage:{stageId:30537}},
                {matchId: 13, stage:{stageId:30537}}, {matchId: 14, stage:{stageId:30537}}, {matchId: 15, stage:{stageId:30537}}, {matchId: 16, stage:{stageId:30537}}, {matchId: 17, stage:{stageId:30537}}, {matchId: 18, stage:{stageId:30537}},
                {matchId: 19, stage:{stageId:30537}}, {matchId: 20, stage:{stageId:30537}}, {matchId: 21, stage:{stageId:30537}}, {matchId: 22, stage:{stageId:30537}}, {matchId: 23, stage:{stageId:30537}}, {matchId: 24, stage:{stageId:30537}},
                {matchId: 25, stage:{stageId:30537}}, {matchId: 26, stage:{stageId:30537}}, {matchId: 27, stage:{stageId:30537}},  {matchId: 28, stage:{stageId:30537}}, {matchId: 29, stage:{stageId:30537}}, {matchId: 30, stage:{stageId:30537}},
                {matchId: 31, stage:{stageId:30537}}, {matchId: 32, stage:{stageId:30537}}, {matchId: 33, stage:{stageId:30537}}, {matchId: 34, stage:{stageId:30537}}, {matchId: 35, stage:{stageId:30537}}, {matchId: 36, stage:{stageId:30537}},
                {matchId: 37, stage:{stageId:30537}}, {matchId: 38, stage:{stageId:30537}}, {matchId: 39, stage:{stageId:30537}}, {matchId: 40, stage:{stageId:30537}}, {matchId: 41, stage:{stageId:30537}}, {matchId: 42, stage:{stageId:30537}}];

            const expected =  [ {matchId: 33, stage:{stageId:30537}}, {matchId: 34, stage:{stageId:30537}}, {matchId: 35, stage:{stageId:30537}}, {matchId: 36, stage:{stageId:30537}},
                {matchId: 37, stage:{stageId:30537}}, {matchId: 38, stage:{stageId:30537}}, {matchId: 39, stage:{stageId:30537}}, {matchId: 40, stage:{stageId:30537}}, {matchId: 41, stage:{stageId:30537}}, {matchId: 42, stage:{stageId:30537}}];

           //Act
           const result = functions.getMatchesByStage(matches, 3);

           //Assert
           expect(result).toEqual(expected);
       });

        it('return correctly when stage = 4', () => {
             //Arrange
            const matches = [{matchId: 1, stage:{stageId:30538}}, {matchId: 2, stage:{stageId:30538}}];

            //Act
            const result = functions.getMatchesByStage(matches, 4);

            //Assert
            expect(result).toEqual(matches);
        });

        it('return correctly when stage = 5', () => {
            //Arrange
           const matches = [{matchId: 1, stage:{stageId:30538}}, {matchId: 2, stage:{stageId:30538}}];

           //Act
           const result = functions.getMatchesByStage(matches, 5);

           //Assert
           expect(result).toEqual([]);
        });
    });

    describe('groupMatchesByStage', () => {
        it('return as expected', () => {
            // Arrange
            window.stage = 1;
            const matches = [
                { matchId: 1, status: 0, stage: { stageId: 30537 } },
                { matchId: 2, status: 0, stage: { stageId: 30537 } },
                { matchId: 3, status: 0, stage: { stageId: 30537 } },
                { matchId: 4, status: 50, stage: { stageId: 30537 } },
            ];

            // Act
            const result = functions.groupMatchesByStage(matches);

            // Assert
            expect(result).toEqual([
                {key: 30537, stage:{stageId: 30537}, matches: matches}
            ]);
        });
    });

    describe('getVoteResult', () => {
        it('return null when match is null', () => {
            // Arrange
            const match = null

            // Act
            const result = functions.getVoteResult(match);

            // Assert
            expect(result).toEqual(null);
        });

        it('return null when match is not finished', () => {
            // Arrange
            const match = {matchId: 1, status: 0}

            // Act
            const result = functions.getVoteResult(match);

            // Assert
            expect(result).toEqual(null);
        });

        it('return correctly when bet win in group stage', () => {
            // Arrange
            const match = {matchId: 1, status: 50, homeTeam:{teamId: 1}, stage: {stageId: 30537}};
            const vote = {teamId: 1}

            // Act
            CommonFunctions.getMatchResult = jest.fn().mockReturnValue(1)
            const result = functions.getVoteResult(match, vote);

            // Assert
            expect(result).toEqual({status: true, score: 10});
        });

        it('return correctly when bet draw', () => {
            // Arrange
            const match = {matchId: 1, status: 50, homeTeam:{teamId: 1}, stage: {stageId: 30537}};
            const vote = {teamId: 0}

            // Act
            CommonFunctions.getMatchResult = jest.fn().mockReturnValue(1)
            const result = functions.getVoteResult(match, vote);

            // Assert
            expect(result).toEqual({status: false, score: 0});
        });

        it('return correctly when bet win in final stage', () => {
            // Arrange
            const match = {matchId: 1, status: 50, homeTeam:{teamId: 1}, stage: {stageId: 30542}};
            const vote = {teamId: 0}

            // Act
            CommonFunctions.getMatchResult = jest.fn().mockReturnValue(0)
            const result = functions.getVoteResult(match, vote);

            // Assert
            expect(result).toEqual({status: true, score: 20});
        });


        it('return correctly when bet win in semifinal stage', () => {
            // Arrange
            const match = {matchId: 1, status: 50, homeTeam:{teamId: 1}, stage: {stageId: 30540}};
            const vote = {teamId: 0}

            // Act
            CommonFunctions.getMatchResult = jest.fn().mockReturnValue(0)
            const result = functions.getVoteResult(match, vote);

            // Assert
            expect(result).toEqual({status: true, score: 15});
        });

        it('return correctly when bet win in Quarterfinal stage', () => {
            // Arrange
            const match = {matchId: 1, status: 50, homeTeam:{teamId: 1}, stage: {stageId: 30539}};
            const vote = {teamId: 0}

            // Act
            CommonFunctions.getMatchResult = jest.fn().mockReturnValue(0)
            const result = functions.getVoteResult(match, vote);

            // Assert
            expect(result).toEqual({status: true, score: 12});
        });

        it('return correctly when match is draw and bet !== 0 ', () => {
            // Arrange
            const match = {matchId: 1, status: 50, homeTeam:{teamId: 1}, stage: {stageId: 30539}};
            const vote = {teamId: 1}

            // Act
            CommonFunctions.getMatchResult = jest.fn().mockReturnValue(0)
            const result = functions.getVoteResult(match, vote);

            // Assert
            expect(result).toEqual({status: false, score: 0});
        });

        it('return correctly when bet lose ', () => {
            // Arrange
            const match = {matchId: 1, status: 50, homeTeam:{teamId: 1}, stage: {stageId: 30539}};
            const vote = {teamId: 1}

            // Act
            CommonFunctions.getMatchResult = jest.fn().mockReturnValue(2)
            const result = functions.getVoteResult(match, vote);

            // Assert
            expect(result).toEqual({status: false, score: 0});
        });
    });

    describe("getMinigameStageStartTime", () => {
        it('return correct when stage = 1', () => {
            // Act
            const result = functions.getMinigameStageStartTime(1);

            // Assert
            expect(result).toEqual(dayjs(new Date(2022, 10, 16, 8, 0, 0)));
        });

        it('return correct when stage = 2', () => {
            // Act
            const result = functions.getMinigameStageStartTime(2);

            // Assert
            expect(result).toEqual(dayjs(new Date(2022, 10, 22, 8, 0, 0)));
        });
        it('return correct when stage = 3', () => {
            // Act
            const result = functions.getMinigameStageStartTime(3);

            // Assert
            expect(result).toEqual(dayjs(new Date(2022, 10, 26, 8, 0, 0)));
        });
        it('return correct when stage = 4', () => {
            // Act
            const result = functions.getMinigameStageStartTime(4);

            // Assert
            expect(result).toEqual(dayjs(new Date(2022, 10, 30, 8, 0, 0)));
        });

        it('return correct when stage > 4', () => {
            // Act
            const result = functions.getMinigameStageStartTime(5);

            // Assert
            expect(result).toEqual(dayjs(new Date(2022, 10, 30, 8, 0, 0)));
        });
    })
})