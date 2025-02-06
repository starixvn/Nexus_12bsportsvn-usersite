/*<info serverAlias="SSMS-sabasports" databaseType="2" executers="sabasports" isFunction="0" isNested="0"></info>*/
DROP PROCEDURE IF EXISTS Livescore_Top_Scorers_GetTop10;

DELIMITER //


CREATE DEFINER=`sabasports`@`%` PROCEDURE `Livescore_Top_Scorers_GetTop10`(
	IN LeagueId LONG,
    IN SeasonId LONG
	/*
		Creator: Brian@20220809
        Revisions:
			- 20220809@Brian: init
            - 20221013@Hank: select Team IconVN
            - 20240417@Hank: select Team Name
    */
)
BEGIN
	SELECT t.LeagueId, t.SeasonId, t.PlayerId, t.TeamId, t.Goals, t.Assists, t.RowNum, t.Top
    , m.Icon AS TeamLogo, m.IconVN AS TeamLogoVN, m.TeamNameEN, m.TeamFullNameEN, m.TeamNameVN
    , p.NameEN AS PlayerNameEN, p.FullNameEN AS PlayerFullNameEN
	FROM livescore_top_scorers AS t 
		INNER JOIN livescore_team AS m ON t.TeamId = m.TeamId
		INNER JOIN livescore_player AS p ON t.PlayerId = p.PlayerId AND p.TeamId = t.TeamId
    WHERE t.LeagueId = LeagueId AND t.SeasonId = SeasonId
    ORDER BY t.Top LIMIT 10;
END




//
DELIMITER ;	