/*<info serverAlias="SSMS-sabasports" databaseType="2" executers="sabasports" isFunction="0" isNested="0"></info>*/
DROP PROCEDURE IF EXISTS Livescore_Team_GetAll;

DELIMITER //


CREATE DEFINER=`sabasports`@`%` PROCEDURE `Livescore_Team_GetAll`(
	IN LeagueId LONG
	/*
		Creator: Brian@20220809
        Revisions:
			- 20220809@Brian: init
    */
)
BEGIN
	SELECT t.TeamId, t.TeamNameEN, TeamFullNameEN, t.LeagueId
	FROM livescore_team AS t
    WHERE t.LeagueId = LeagueId;
END




//
DELIMITER ;	