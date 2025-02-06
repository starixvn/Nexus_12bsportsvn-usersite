/*<info serverAlias="SSMS-sabasports" databaseType="2" executers="sabasports" isFunction="0" isNested="0"></info>*/
DROP PROCEDURE IF EXISTS Livescore_Season_GetByLeague;
DELIMITER //

CREATE DEFINER=`sabasports`@`%` PROCEDURE `Livescore_Season_GetByLeague`(
	leagueId BIGINT
	/*
		Creator: Hank@20220907
        Revisions:
			- 20220907@Hank: init
    */
)
BEGIN
	SELECT s.LeagueId, s.SeasonId, s.StartTime, s.EndTime, s.Year
    FROM livescore_season s
    WHERE s.LeagueId = leagueId
    ORDER BY s.SeasonId desc;
END

//
DELIMITER ;	