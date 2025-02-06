/*<info serverAlias="SSMS-sabasports" databaseType="2" executers="sabasports" isFunction="0" isNested="0"></info>*/
DROP PROCEDURE IF EXISTS Livescore_Player_GetByTeamId;

DELIMITER //


CREATE DEFINER=`sabasports`@`%` PROCEDURE `Livescore_Player_GetByTeamId`(
	IN TeamId LONG
	/*
		Creator: Brian@20220809
        Revisions:
			- 20220809@Brian: init
    */
)
BEGIN
	SELECT p.TeamId, p.PlayerId, p.NameEN, p.FullNameEN, p.Icon
	FROM livescore_player AS p
    WHERE p.TeamId = TeamId;
END




//
DELIMITER ;	