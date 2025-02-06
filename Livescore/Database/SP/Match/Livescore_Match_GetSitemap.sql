/*<info serverAlias="SSMS-sabasports" databaseType="2" executers="sabasports" isFunction="0" isNested="0"></info>*/
DROP PROCEDURE IF EXISTS Livescore_Match_GetSitemap;
DELIMITER //

CREATE DEFINER=`sabasports`@`%` PROCEDURE `Livescore_Match_GetSitemap`(
    /*
		Creator: Hank@202306110
        Revisions:
			- 202306110@Hank: init
    */
)
BEGIN
	DECLARE today DATETIME;
    DECLARE now DATETIME;
    SET now = DATE_ADD(UTC_TIMESTAMP(), INTERVAL 7 HOUR);
    SET today = concat(DATE(now), ' 00:00:00');
    SET today =  DATE_SUB(today, INTERVAL 7 HOUR);
	
    SELECT m.MatchId, COALESCE(mc.StartTime, m.StartTime) as StartTime
		,m.LeagueId, l.LeagueNameVN, l.LeagueNameEN, l.LeagueFullNameEN
		,m.HomeTeamId, h.TeamNameEN as HomeTeamNameEN, h.TeamFullNameEN as HomeTeamFullNameEN, h.TeamNameVN as HomeTeamNameVN
        ,m.AwayTeamId, a.TeamNameEN as AwayTeamNameEN, a.TeamFullNameEN as AwayTeamFullNameEN, a.TeamNameVN as AwayTeamNameVN
    FROM livescore_match m
        INNER JOIN livescore_league l ON m.LeagueId = l.LeagueId
        INNER JOIN livescore_team h ON m.HomeTeamId = h.TeamId
        INNER JOIN livescore_team a ON m.AwayTeamId = a.TeamId
        INNER JOIN livescore_league_extra le ON l.LeagueId = le.LeagueId
        LEFT JOIN livescore_match_custom mc ON mc.MatchId = m.matchId
	WHERE m.StartTime >= today
		AND m.Status IS NOT NULL 
		AND m.CombinedId IS NULL
        AND m.SportId = 1
        AND NOT EXISTS (SELECT md.MatchId FROM livescore_match_deleted md WHERE m.MatchId = md.MatchId)
    ORDER BY m.StartTime ASC
    LIMIT 100;
END
//
DELIMITER ;	