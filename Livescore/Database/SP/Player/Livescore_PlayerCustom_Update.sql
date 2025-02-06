/*<info serverAlias="SSMS-sabasports" databaseType="2" executers="sabasports" isFunction="0" isNested="0"></info>*/
DROP PROCEDURE IF EXISTS Livescore_PlayerCustom_Update;
DELIMITER //

CREATE DEFINER=`sabasports`@`%` PROCEDURE `Livescore_PlayerCustom_Update`(
	/*
		Creator: Hank@20240507
        Revisions:
			- 20240507@Hank: init
    */
    IN PlayerId INT,
    IN PlayerName VARCHAR(255), 
    IN PlayerFullName VARCHAR(255),
    IN Birthday DATE,
    IN ShirtNumber VARCHAR(10),
    IN Club VARCHAR(255),
	IN Position INT,
    IN Icon VARCHAR(255),
    OUT ErrCode SMALLINT,
    OUT ErrMsg VARCHAR(100)
)
BEGIN
	UPDATE  `livescore_team_player_custom` as p 
    SET
    `PlayerName` = PlayerName,
    `PlayerFullName` = PlayerFullName,
    `Birthday` = Birthday,
    `ShirtNumber` = ShirtNumber,
    `ClubName` = Club,
    `Position` = Position,
    `Icon` = Icon
	WHERE p.PlayerId = playerId;
END
//
DELIMITER ;	