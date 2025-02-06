/*<info serverAlias="SSMS-sabasports" databaseType="2" executers="sabasports" isFunction="0" isNested="0"></info>*/
DROP PROCEDURE IF EXISTS Livescore_Top_Scorers_GetByRow;
DELIMITER //
CREATE DEFINER=`sabasports`@`%` PROCEDURE `Livescore_Top_Scorers_GetByRow`(
	IN LeagueId LONG,
    IN SeasonId LONG,
    In RowNum INT
	/*
		Creator: Brian@20220809
        Revisions:
			- 20220809@Brian: init
    */
)
BEGIN
	SELECT t.LeagueId, t.SeasonId, t.PlayerId, t.TeamId, t.Goals, t.Assists, t.RowNum, t.Top ,m.TeamNameEN, m.TeamFullNameEN, m.Icon AS TeamLogo, p.NameEN AS PlayerNameEN, p.FullNameEN AS PlayerFullNameEN
	FROM livescore_top_scorers AS t INNER JOIN livescore_team AS m ON t.TeamId = m.TeamId
			INNER JOIN livescore_player AS p ON t.PlayerId = p.PlayerId
    WHERE t.LeagueId = LeagueId AND t.SeasonId = SeasonId AND t.RowNum = RowNum
    ORDER BY t.Top;
END
//
DELIMITER ;