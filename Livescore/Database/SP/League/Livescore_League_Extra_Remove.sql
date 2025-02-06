/*<info serverAlias="SSMS-sabasports" databaseType="2" executers="sabasports" isFunction="0" isNested="0"></info>*/
DROP PROCEDURE IF EXISTS Livescore_League_Extra_Remove;
DELIMITER //
CREATE DEFINER=`sabasports`@`%` PROCEDURE `Livescore_League_Extra_Remove`(
	/*
		Creator: Brian@20220808
        Revisions:
			- 20220808@Brian: init
    */
    IN LeagueId INT,
    OUT ErrCode SMALLINT,
    OUT ErrMsg VARCHAR(100)  
)
BEGIN
	DELETE le FROM `livescore_league_extra` as le
	WHERE le.LeagueId = LeagueId;
END
//
DELIMITER ;