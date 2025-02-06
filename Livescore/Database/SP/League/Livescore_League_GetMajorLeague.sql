/*<info serverAlias="SSMS-sabasports" databaseType="2" executers="sabasports" isFunction="0" isNested="0"></info>*/
DROP PROCEDURE IF EXISTS Livescore_League_GetMajorLeague;

DELIMITER //



CREATE DEFINER=`sabasports`@`%` PROCEDURE `Livescore_League_GetMajorLeague`(
    /*
		Creator: Tim@20220331
        Revisions: - 20220331@Tim: init
					- 20221227@Hank: select league IconVN
    */
)
BEGIN
	SELECT l.LeagueId, l.LeagueNameVN, l.LeagueNameEN, l.LeagueFullNameEN, l.LeagueType, l.Icon, l.IconVN, l.CurrentSeasonId, e.IsMajor, e.Priority
	FROM livescore_league l
		INNER JOIN livescore_league_extra e ON l.LeagueId = e.LeagueId
	WHERE e.IsMajor = 1
	ORDER BY e.Priority;
END

//
DELIMITER ;	