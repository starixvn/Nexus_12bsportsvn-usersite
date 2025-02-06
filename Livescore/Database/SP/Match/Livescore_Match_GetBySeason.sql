/*<info serverAlias="SSMS-sabasports" databaseType="2" executers="sabasports" isFunction="0" isNested="0"></info>*/
DROP PROCEDURE IF EXISTS Livescore_Match_GetBySeason;
DELIMITER //

CREATE DEFINER=`sabasports`@`%` PROCEDURE `Livescore_Match_GetBySeason`(
	IN leagueId BIGINT
    ,IN seasonId BIGINT
    ,IN fromTime DATETIME
    ,IN toTime DATETIME
    /*
		Creator: Tim@20220412
        Revisions:
			- 20220412@Tim: init
			- 202200512@Tim: check 2nd leg
			- 202200517@Tim: get start time for live match
            - 202200610@Hank: check deleted match
            - 2022008100@Hank: add TeamNameVN & IconVN,  select season, data custom
            - 20221227@Hank: select league IconVN
            - 20230804@Hank: check duplicate stageId
            - 20231006@Hank: check season is 0
            
    */
)
BEGIN    
    DECLARE _hasStandings BIT(1) DEFAULT 0;
    
	DROP TEMPORARY TABLE IF EXISTS tmp_MatchIds;
    CREATE TEMPORARY TABLE tmp_MatchIds (MatchId BIGINT PRIMARY KEY);
    
    SET _hasStandings = IF (EXISTS (SELECT 1 FROM livescore_season_standings ss WHERE ss.SeasonId = seasonId AND ss.StageId > 0), 1, 0);

	INSERT INTO tmp_MatchIds (MatchId)
	SELECT m.MatchId
	FROM livescore_match m
	WHERE m.LeagueId = leagueId
		AND m.SeasonId = seasonId
		AND m.CombinedId IS NULL
		AND m.Status IS NOT NULL
		AND (fromTime IS NULL OR m.StartTime BETWEEN fromTime AND toTime)
		AND NOT EXISTS (SELECT md.MatchId FROM livescore_match_deleted md WHERE m.MatchId = md.MatchId);
    
	
    SELECT l.LeagueId, l.LeagueNameVN, l.LeagueNameEN, l.LeagueFullNameEN, l.LeagueType, _hasStandings AS HasSeasonStandings, l.Icon, l.IconVN, l.CurrentStageId
    FROM livescore_league l
	WHERE l.LeagueId = leagueId;
    
    SELECT s.SeasonId, s.StartTime, s.EndTime, Year FROM livescore_season s WHERE s.SeasonId = seasonId;
    
    SELECT m.MatchId, m.EndTime, m.GroupNum, m.RelatedId
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
        ,m.HomeTeamId, h.TeamNameVN as HomeTeamNameVN, h.TeamNameEN AS HomeTeamNameEN, h.TeamFullNameEN AS HomeTeamFullNameEN, h.Icon AS HomeTeamIcon, h.IconVN AS HomeTeamIconVN
        ,m.AwayTeamId, a.TeamNameVN as AwayTeamNameVN, a.TeamNameEN AS AwayTeamNameEN, a.TeamFullNameEN AS AwayTeamFullNameEN, a.Icon AS AwayTeamIcon, a.IconVN AS AwayTeamIconVN
        ,m.StageId, ss.StageNameEN, COALESCE(ss.StageNameVN, rr.NameVN) AS StageNameVN, ss.Mode AS StageMode, ss.GroupCount, ss.RoundCount, ss.OrderIndex
    FROM livescore_match m
        INNER JOIN livescore_team h ON m.HomeTeamId = h.TeamId
        INNER JOIN livescore_team a ON m.AwayTeamId = a.TeamId
        LEFT JOIN livescore_match_statistic sh ON m.MatchId = sh.MatchId AND m.HomeTeamId = sh.TeamId
        LEFT JOIN livescore_match_statistic sa ON m.MatchId = sa.MatchId AND m.AwayTeamId = sa.TeamId
        LEFT JOIN livescore_season_stage ss ON m.StageId = ss.StageId AND m.SeasonId = ss.SeasonId
        LEFT JOIN livescore_ref_resource rr ON rr.RefName = 'Stage' AND ss.StageNameEN = rr.NameEN
        LEFT JOIN livescore_match firstleg ON m.RelatedId = firstleg.MatchId AND m.LeagueId = firstleg.LeagueId AND m.StartTime > firstleg.StartTime
        LEFT JOIN livescore_match_live live ON m.MatchId = live.MatchId
        LEFT JOIN livescore_match_custom mc ON mc.MatchId = m.matchId
	WHERE EXISTS (SELECT tmp_m.MatchId FROM tmp_MatchIds tmp_m WHERE m.MatchId = tmp_m.MatchId)
    ORDER BY StartTime ASC
		,CASE WHEN h.TeamNameVN IS NOT NULL THEN h.TeamNameVN
			WHEN h.TeamNameEN IS NOT NULL THEN h.TeamNameEN
			ELSE h.TeamFullNameEN END ASC;
            
	DROP TEMPORARY TABLE IF EXISTS tmp_MatchIds;
            
	
END
//
DELIMITER ;	