/*<info serverAlias="SSMS-sabasports" databaseType="2" executers="sabasports" isFunction="0" isNested="0"></info>*/
DROP PROCEDURE IF EXISTS Livescore_Match_Update;
DELIMITER //

CREATE DEFINER=`sabasports`@`%` PROCEDURE `Livescore_Match_Update`(
	IN matchId BIGINT,
    IN stageId BIGINT,
	IN homeTeamId BIGINT,
	IN homeTeamNameVN VARCHAR(255),
    IN homeTeamIconVN VARCHAR(255),
    IN awayTeamId BIGINT,
    IN awayTeamNameVN VARCHAR(255),
    IN awayTeamIconVN VARCHAR(255),
    IN stageNameVN VARCHAR(255),
    IN round SMALLINT,
    IN status SMALLINT,
    IN startTime DATETIME,
    IN homeTeamHalfScore SMALLINT,
    IN awayTeamHalfScore SMALLINT,
    IN homeTeamExtraScore SMALLINT,
    IN awayTeamExtraScore SMALLINT,
	IN homeTeamAggregateScore SMALLINT,
    IN awayTeamAggregateScore SMALLINT,
    IN homeTeamPenaltyScore SMALLINT,
    IN awayTeamPenaltyScore SMALLINT,
    OUT ErrCode SMALLINT,
    OUT ErrMsg VARCHAR(100)   
	/*
		Creator: Hank@20220907
        Revisions:
			- 20220907@Hank: init
    */
)
BEGIN
	UPDATE `livescore_team` as t
	SET
	`TeamNameVN` = homeTeamNameVN,
    `IconVN` = homeTeamIconVN
	WHERE t.TeamId = homeTeamId;
    
    UPDATE `livescore_team` as t
	SET
	`TeamNameVN` = awayTeamNameVN,
    `IconVN` = awayTeamIconVN
	WHERE t.TeamId = awayTeamId;
    
    UPDATE `livescore_season_stage` as ss
	SET
	`StageNameVN` = stageNameVN
	WHERE ss.stageId = stageId;
    
    INSERT INTO `livescore_match_custom`
	(`MatchId`,
    `Status`,
    `StartTime`,
    `Round`,
	`HomeTeamHalfScore`,
	`AwayTeamHalfScore`,
	`HomeTeamExtraScore`,
	`AwayTeamExtraScore`,
	`HomeTeamAggregateScore`,
	`AwayTeamAggregateScore`,
	`HomeTeamPenaltyScore`,
	`AwayTeamPenaltyScore`,
	`UpdatedDate`)
	VALUES
	(matchId,
    status,
    startTime,
    round,
	homeTeamHalfScore,
	awayTeamHalfScore,
	homeTeamExtraScore,
	awayTeamExtraScore,
	homeTeamAggregateScore,
	awayTeamAggregateScore,
	homeTeamPenaltyScore,
	awayTeamPenaltyScore,
	NOW())
    ON DUPLICATE KEY UPDATE 
    Status = status,
    StartTime = startTime,
    Round = round,
    HomeTeamHalfScore = homeTeamHalfScore,
    AwayTeamHalfScore = awayTeamHalfScore,
    HomeTeamExtraScore = homeTeamExtraScore,
    AwayTeamExtraScore = awayTeamExtraScore,
    HomeTeamAggregateScore = homeTeamAggregateScore,
    AwayTeamAggregateScore = awayTeamAggregateScore,
    HomeTeamPenaltyScore = homeTeamPenaltyScore,
    AwayTeamPenaltyScore = awayTeamPenaltyScore,
    UpdatedDate = NOW();

    
END

//
DELIMITER ;	