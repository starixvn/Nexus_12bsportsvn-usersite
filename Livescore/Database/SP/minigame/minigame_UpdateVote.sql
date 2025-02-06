/*<info serverAlias="SSMS-sabasports" databaseType="2" executers="sabasports" isFunction="0" isNested="0"></info>*/
DROP PROCEDURE IF EXISTS minigame_UpdateVote;
DELIMITER //

CREATE DEFINER=`sabasports`@`%` PROCEDURE `minigame_UpdateVote`(
	IN userId BIGINT,
    IN matchId BIGINT,
    IN stage SMALLINT,
    IN teamId BIGINT,
    IN leagueId BIGINT,
    IN seasonId BIGINT,
    IN updatedDate DATETIME,
	OUT ErrCode SMALLINT,
    OUT ErrMsg VARCHAR(100)
	/*
		Creator: Hank@20240529
        Revisions:
			- 20221019@Hank: 20240529
    */
)
BEGIN
	INSERT INTO `livescore_league_minigame`
	(`UserId`,
	`MatchId`,
	`Stage`,
	`TeamId`,
    `LeagueId`,
    `SeasonId`,
	`CreatedDate`,
    `UpdatedDate`)
	VALUES
	(userId,
	matchId,
	stage,
	teamId,
    leagueId,
    seasonId,
	updatedDate,
    updatedDate)
    ON DUPLICATE KEY UPDATE
    TeamId = teamId,
    UpdatedDate = updatedDate;

END
//
DELIMITER ;	