/*<info serverAlias="SSMS-sabasports" databaseType="2" executers="sabasports" isFunction="0" isNested="0"></info>*/
DROP PROCEDURE IF EXISTS Livescore_PlayerCustom_GetByTeamId;
DELIMITER //

CREATE DEFINER=`sabasports`@`%` PROCEDURE `Livescore_PlayerCustom_GetByTeamId`(
	IN TeamId LONG
	/*
		Creator: Hank@20240506
        Revisions:
			- 20240506@Hank: init
    */
)
BEGIN
	SELECT p.TeamId, p.PlayerId, p.PlayerName, p.PlayerFullName, p.Icon, p.Birthday, p.ShirtNumber, p.ClubName, p.Position
	FROM livescore_team_player_custom AS p
    WHERE p.TeamId = TeamId;
END
//
DELIMITER ;	