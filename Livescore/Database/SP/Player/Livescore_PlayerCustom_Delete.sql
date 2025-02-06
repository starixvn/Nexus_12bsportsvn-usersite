/*<info serverAlias="SSMS-sabasports" databaseType="2" executers="sabasports" isFunction="0" isNested="0"></info>*/
DROP PROCEDURE IF EXISTS Livescore_PlayerCustom_Delete;
DELIMITER //

CREATE DEFINER=`sabasports`@`%` PROCEDURE `Livescore_PlayerCustom_Delete`(
	/*
		Creator: Hank@20240514
        Revisions:
			- 20240514@Hank: init
    */
	IN PlayerId INT,
    OUT ErrCode SMALLINT,
    OUT ErrMsg VARCHAR(100)
)
BEGIN
	DELETE FROM livescore_team_player_custom p WHERE p.PlayerId = playerId;
END
//
DELIMITER ;	