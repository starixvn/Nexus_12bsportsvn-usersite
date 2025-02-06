/*<info serverAlias="SSMS-sabasports" databaseType="2" executers="sabasports" isFunction="0" isNested="0"></info>*/
DROP PROCEDURE IF EXISTS Livescore_PlayerCustom_Create;
DELIMITER //

CREATE DEFINER=`sabasports`@`%` PROCEDURE `Livescore_PlayerCustom_Create`(
	/*
		Creator: Hank@20240507
        Revisions:
			- 20240507@Hank: init
    */
	IN TeamId LONG,
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
	INSERT INTO `livescore_team_player_custom`
		(`TeamId`, `PlayerName`, `PlayerFullName`, `Birthday`, `ShirtNumber`, `ClubName`, `Position`, `Icon`)
		VALUES
		(TeamId, PlayerName, PlayerFullName, Birthday, ShirtNumber, Club, Position, Icon);
END
//
DELIMITER ;	