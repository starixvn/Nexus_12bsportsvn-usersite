/*<info serverAlias="SSMS-sabasports" databaseType="2" executers="sabasports" isFunction="0" isNested="0"></info>*/
DROP PROCEDURE IF EXISTS Livescore_Standing_RemoveCustom;
DELIMITER //

CREATE DEFINER=`sabasports`@`%` PROCEDURE `Livescore_Standing_RemoveCustom`(
	IN seasonId BIGINT,
    OUT ErrCode SMALLINT,
    OUT ErrMsg VARCHAR(100)  
    /*
		Creator: Hank@20230725
        Revisions:
			- 20230725@Hank: init
    */
)
BEGIN
     DELETE FROM livescore_season_standings_extra s WHERE s.SeasonId = seasonId;
END

//
DELIMITER ;	