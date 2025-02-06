/*<info serverAlias="SSMS-sabasports" databaseType="2" executers="sabasports" isFunction="0" isNested="0"></info>*/
DROP PROCEDURE IF EXISTS Livescore_Top_Scorers_Update;
DELIMITER //
CREATE DEFINER=`sabasports`@`%` PROCEDURE `Livescore_Top_Scorers_Update`(
	IN PlayerId LONG,
    IN SeasonId LONG, 
    IN LeagueId LONG,
    IN TeamId LONG,
    IN Goals INT,
    IN Assists INT,
    IN RowNum INT,
    IN Top INT,
    OUT ErrCode SMALLINT,
    OUT ErrMsg VARCHAR(100)
	/*
		Creator: Brian@20220809
        Revisions:
			- 20220809@Brian: init
    */
)
BEGIN
	UPDATE `livescore_top_scorers` as scr
	SET
	`PlayerId` = PlayerId,
	`TeamId` = TeamId,
	`Goals` = Goals,
	`Assists` = Assists,
    `Top` = Top
	WHERE scr.RowNum = RowNum AND scr.LeagueId = LeagueId AND scr.SeasonId = SeasonId;
END
//
DELIMITER ;