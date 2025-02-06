/*<info serverAlias="SSMS-sabasports" databaseType="2" executers="sabasports" isFunction="0" isNested="0"></info>*/
DROP PROCEDURE IF EXISTS Livescore_League_Extra_Insert;
DELIMITER //
CREATE DEFINER=`sabasports`@`%` PROCEDURE `Livescore_League_Extra_Insert`(
	/*
		Creator: Brian@20220808
        Revisions:
			- 20220808@Brian: init
    */
	IN IsMajor bool,
    IN Priority INT, 
    IN LeagueId INT,
    IN CreatedDate DATETIME,
    OUT ErrCode SMALLINT,
    OUT ErrMsg VARCHAR(100)
)
BEGIN
	INSERT INTO `livescore_league_extra`
		(`IsMajor`, `Priority`, `LeagueId`, `CreatedDate`)
		VALUES
		(IsMajor, Priority, LeagueId, CreatedDate);
END
//
DELIMITER ;