/*<info serverAlias="SSMS-sabasports" databaseType="2" executers="sabasports" isFunction="0" isNested="0"></info>*/
DROP PROCEDURE IF EXISTS minigame_League_GetByStage;
DELIMITER //

CREATE DEFINER=`sabasports`@`%` PROCEDURE `minigame_League_GetByStage`(
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
	SELECT m.UserId, m.MatchId, m.Stage, m.TeamId, m.CreatedDate, m.UpdatedDate, m.LeagueId, m.SeasonId,
		u.display_name AS UserName, u.user_email AS Email, m4.meta_value AS Icon
	FROM livescore_league_minigame AS m 
		INNER JOIN wp_users AS u ON m.UserId=u.ID 
		LEFT JOIN wp_usermeta AS m4 ON m4.user_id = m.UserId AND m4.meta_key = 'photo' 
	WHERE m.Stage = stage AND m.leagueId = leagueId AND m.seasonId = seasonId;
END
//
DELIMITER ;	