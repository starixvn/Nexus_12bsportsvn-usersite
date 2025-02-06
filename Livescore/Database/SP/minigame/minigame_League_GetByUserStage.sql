/*<info serverAlias="SSMS-sabasports" databaseType="2" executers="sabasports" isFunction="0" isNested="0"></info>*/
DROP PROCEDURE IF EXISTS minigame_League_GetByUserStage;
DELIMITER //

CREATE DEFINER=`sabasports`@`%` PROCEDURE `minigame_League_GetByUserStage`(
	userId BIGINT,
    stage SMALLINT,
    leagueId BIGINT,
    seasonId BIGINT
    /*
		Creator: Hank@20240529
        Revisions:
			- 20240529@Hank: init
    */
)
BEGIN
	SELECT m.UserId, m.MatchId, m.Stage, m.TeamId, m.UpdatedDate, m.CreatedDate, m.LeagueId, m.SeasonId
    FROM livescore_league_minigame m
    WHERE m.LeagueId = leagueId AND m.SeasonId = seasonId AND m.UserId = userId AND m.Stage = stage;
END
//
DELIMITER ;	