/*<info serverAlias="SSMS-sabasports" databaseType="2" executers="sabasports" isFunction="0" isNested="0"></info>*/
DROP PROCEDURE IF EXISTS Livescore_Match_GetTodayHotLeague;

DELIMITER //
CREATE DEFINER=`sabasports`@`%` PROCEDURE `Livescore_Match_GetTodayHotLeague`(
	IN fromTime DATETIME
    ,IN toTime DATETIME
	,IN sportId SMALLINT UNSIGNED
    /*
		Creator: Hank@20230815
        Revisions:
			- 20230815@Hank: init
    */
)
BEGIN
	DECLARE homeFixtureJson JSON;
	
	DROP TEMPORARY TABLE IF EXISTS tmp_HotLeagues;
    CREATE TEMPORARY TABLE IF NOT EXISTS tmp_HotLeagues(LeagueId BIGINT NOT NULL, SeasonId BIGINT NOT NULL , Priority INT NOT NULL);
    
    SELECT op.option_value INTO homeFixtureJson FROM wp_options op WHERE op.option_name = "homepage_fixture" LiMIT 1;
    
    INSERT INTO tmp_HotLeagues (LeagueId, SeasonId, Priority)
    SELECT LeagueId, SeasonId, Priority
    FROM 
		JSON_TABLE
        (
			homeFixtureJson,
            "$[*]"
            COLUMNS
            (
				LeagueId BIGINT  PATH "$.LeagueId",
                SeasonId BIGINT  PATH "$.SeasonId",
                Priority BIGINT  PATH "$.Order"
            )
        ) AS t; 
        
	
	
	SELECT m.MatchId, m.EndTime, m.GroupNum
		,CASE WHEN firstleg.MatchId IS NOT NULL THEN 1 ELSE 0 END AS IsSecondLeg
		,m.HomeTeamTotalScore, m.AwayTeamTotalScore
        ,COALESCE(mc.Round, m.Round) as Round
        ,COALESCE(mc.StartTime, m.StartTime) as StartTime
        ,COALESCE(mc.Status, m.Status) as Status
		,COALESCE(mc.HomeTeamHalfScore, m.HomeTeamHalfScore) as HomeTeamHalfScore, COALESCE(mc.AwayTeamHalfScore, m.AwayTeamHalfScore) as AwayTeamHalfScore
        ,COALESCE(mc.HomeTeamAggregateScore, m.HomeTeamAggregateScore) as HomeTeamAggregateScore, COALESCE(mc.AwayTeamAggregateScore, m.AwayTeamAggregateScore) as AwayTeamAggregateScore
        ,COALESCE(mc.HomeTeamPenaltyScore, sh.PenaltyScore) as HomeTeamPenaltyScore, COALESCE(mc.AwayTeamPenaltyScore, sa.PenaltyScore) as AwayTeamPenaltyScore
		,COALESCE(mc.HomeTeamExtraScore, sh.ExtraScore) as HomeTeamExtraScore, COALESCE(mc.AwayTeamExtraScore, sa.ExtraScore) as AwayTeamExtraScore
        ,CASE WHEN m.Status = 10 AND live.StartTime IS NOT NULL THEN live.StartTime ELSE m.FootballStartTime END AS FootballStartTime
        ,CASE WHEN m.Status = 30 AND live.StartTime IS NOT NULL THEN live.StartTime ELSE m.FootballNextHalfStartTime END AS FootballNextHalfStartTime
        ,CASE WHEN m.Status = 40 AND live.StartTime IS NOT NULL THEN live.StartTime ELSE m.FootballAddStartTime END AS FootballAddStartTime
		,m.LeagueId, l.LeagueNameVN, l.LeagueNameEN, l.CurrentSeasonId, l.LeagueFullNameEN, l.LeagueType, l.Icon, l.IconVN, l.CountryVN, l.CountryIconVN
		,m.HomeTeamId, h.TeamNameEN, h.TeamFullNameEN, h.TeamNameVN, h.Icon, h.IconVN
        ,m.AwayTeamId, a.TeamNameEN, a.TeamFullNameEN, a.TeamNameVN, a.Icon, a.IconVN
    FROM livescore_match m
        INNER JOIN tmp_HotLeagues hl ON m.LeagueId = hl.LeagueId
        INNER JOIN livescore_league l ON m.LeagueId = l.LeagueId AND m.SeasonId = l.CurrentSeasonId
        INNER JOIN livescore_team h ON m.HomeTeamId = h.TeamId
        INNER JOIN livescore_team a ON m.AwayTeamId = a.TeamId
        LEFT JOIN livescore_match_statistic sh ON m.MatchId = sh.MatchId AND m.HomeTeamId = sh.TeamId
        LEFT JOIN livescore_match_statistic sa ON m.MatchId = sa.MatchId AND m.AwayTeamId = sa.TeamId
        LEFT JOIN livescore_match firstleg ON m.RelatedId = firstleg.MatchId AND m.LeagueId = firstleg.LeagueId AND m.StartTime > firstleg.StartTime
        LEFT JOIN livescore_match_live live ON m.MatchId = live.MatchId
        LEFT JOIN livescore_match_custom mc ON mc.MatchId = m.matchId
	WHERE m.StartTime BETWEEN fromTime AND toTime
			AND m.SportId = sportId
			AND m.CombinedId IS NULL 
            AND m.Status IS NOT NULL
            AND NOT EXISTS (SELECT md.MatchId FROM livescore_match_deleted md WHERE m.MatchId = md.MatchId)
	ORDER BY CASE WHEN hl.LeagueId IS NOT NULL THEN hl.Priority ELSE 999999 END ASC
        ,CASE WHEN l.LeagueNameVN IS NOT NULL THEN l.LeagueNameVN
			WHEN l.LeagueNameEN IS NOT NULL THEN l.LeagueNameEN
            ELSE l.LeagueFullNameEN END ASC
		,StartTime ASC
        ,CASE WHEN h.TeamNameVN IS NOT NULL THEN h.TeamNameVN 
			WHEN h.TeamNameEN IS NOT NULL THEN h.TeamNameEN
			ELSE h.TeamFullNameEN END ASC;
	
    DROP TEMPORARY TABLE IF EXISTS tmp_HotLeagues;
	

END

//
DELIMITER ;	
