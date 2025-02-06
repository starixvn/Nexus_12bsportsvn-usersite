/*<info serverAlias="SSMS-sabasports" databaseType="2" executers="sabasports" isFunction="0" isNested="0"></info>*/
DROP PROCEDURE IF EXISTS Livescore_Match_GetByIds;

DELIMITER //
CREATE DEFINER=`sabasports`@`%` PROCEDURE `Livescore_Match_GetByIds`(
	IN matchIds JSON
    /*
		Creator: Hank@20220419
        Revisions:
			- 20220419@Hank: init
			- 202200512@Tim: check 2nd leg
			- 202200517@Tim: get start time for live match
            - 20220711@Hank: get country data
            - 20220915@Hank: get team name & Icon VN & data custom
            - 20221227@Hank: select league IconVN & countryIconVN
    */
)
BEGIN
	DROP TEMPORARY TABLE IF EXISTS tmp_ids;
    CREATE TEMPORARY TABLE IF NOT EXISTS tmp_ids(MatchId BIGINT NOT NULL);
	
	INSERT INTO tmp_ids(MatchId)
    SELECT MatchId
    FROM 
		JSON_TABLE
        (
			matchIds,
            "$[*]"
            COLUMNS
            (
				MatchId BIGINT  PATH "$"
            )
        ) AS t;        
        
	SELECT m.MatchId, m.EndTime
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
        ,m.LeagueId, l.LeagueNameVN, l.LeagueNameEN, l.LeagueFullNameEN, l.CurrentRound, l.CurrentSeasonId, l.Icon, l.IconVN, le.IsMajor, le.Priority, l.CountryVN, l.CountryIconVN
        ,c.CountryId, c.CountryLogo, c.CountryLogoCustom
		,m.HomeTeamId, h.TeamNameEN, h.TeamFullNameEN, h.TeamNameVN, h.Icon, h.IconVN
        ,m.AwayTeamId, a.TeamNameEN, a.TeamFullNameEN, a.TeamNameVN, a.Icon, a.IconVN
    FROM livescore_match m
		INNER JOIN livescore_league l ON m.LeagueId = l.LeagueId
		INNER JOIN livescore_team h ON m.HomeTeamId = h.TeamId
		INNER JOIN livescore_team a ON m.AwayTeamId = a.TeamId
		LEFT JOIN livescore_match_statistic sh ON m.MatchId = sh.MatchId AND m.HomeTeamId = sh.TeamId
		LEFT JOIN livescore_match_statistic sa ON m.MatchId = sa.MatchId AND m.AwayTeamId = sa.TeamId
		LEFT JOIN livescore_league_extra le ON l.LeagueId = le.LeagueId
        LEFT JOIN livescore_match firstleg ON m.RelatedId = firstleg.MatchId AND m.LeagueId = firstleg.LeagueId AND m.StartTime > firstleg.StartTime
        LEFT JOIN livescore_match_live live ON m.MatchId = live.MatchId
        LEFT JOIN livescore_country c ON c.CountryId = l.CountryId
        LEFT JOIN livescore_match_custom mc ON mc.MatchId = m.matchId
    WHERE m.CombinedId IS NULL
			AND NOT EXISTS (SELECT md.MatchId FROM livescore_match_deleted md WHERE m.MatchId = md.MatchId)
            AND EXISTS (SELECT tmp.MatchId FROM tmp_ids tmp WHERE m.MatchId = tmp.MatchId)
     ORDER BY CASE WHEN le.LeagueId IS NOT NULL THEN le.Priority ELSE 9999999 END ASC
        ,CASE WHEN l.LeagueNameVN IS NOT NULL THEN l.LeagueNameVN
			WHEN l.LeagueNameEN IS NOT NULL THEN l.LeagueNameEN
            ELSE l.LeagueFullNameEN END ASC
		,StartTime ASC;
END

//
DELIMITER ;	
