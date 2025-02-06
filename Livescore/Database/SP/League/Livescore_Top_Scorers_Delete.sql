/*<info serverAlias="SSMS-sabasports" databaseType="2" executers="sabasports" isFunction="0" isNested="0"></info>*/
DROP PROCEDURE IF EXISTS Livescore_Top_Scorers_Delete;

DELIMITER //


CREATE DEFINER=`sabasports`@`%` PROCEDURE `Livescore_Top_Scorers_Delete`(
	IN LeagueId LONG,
    IN SeasonId LONG,
    In RowNum INT,
    OUT ErrCode SMALLINT,
    OUT ErrMsg VARCHAR(100)
	/*
		Creator: Hank@20240617
        Revisions:
			- 20240617@Hank: init
    */
)
BEGIN
	DELETE FROM `livescore_top_scorers` as scr
	WHERE scr.RowNum = RowNum AND scr.LeagueId = LeagueId AND scr.SeasonId = SeasonId;
END



//
DELIMITER ;	