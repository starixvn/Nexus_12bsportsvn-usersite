/*<info serverAlias="SSMS-sabasports" databaseType="2" executers="sabasports" isFunction="0" isNested="0"></info>*/
DROP PROCEDURE IF EXISTS Livescore_PlayerCustom_GetById;
DELIMITER //

CREATE DEFINER=`sabasports`@`%` PROCEDURE `Livescore_PlayerCustom_GetById`(
	IN playerId INT
	/*
		Creator: Hank@20240514
        Revisions:
			- 20240514@Hank: init
    */
)
BEGIN
	SELECT p.TeamId, p.PlayerId, p.PlayerName, p.PlayerFullName, p.Icon, p.Birthday, p.ShirtNumber, p.ClubName, p.Position
	FROM livescore_team_player_custom AS p
    WHERE p.PlayerId = playerId;
END
//
DELIMITER ;	