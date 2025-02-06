/*<info serverAlias="SSMS-sabasports" databaseType="2" executers="sabasports" isFunction="0" isNested="0"></info>*/
DROP PROCEDURE IF EXISTS Livescore_Match_GetSeasonStandings;
DELIMITER //

CREATE DEFINER=`sabasports`@`%` PROCEDURE `Livescore_Match_GetSeasonStandings`(
	IN leagueId BIGINT
    ,IN seasonId BIGINT
    /*
		Creator: Tim@20220418
        Revisions:
			- 20220418@Tim: init
			- 202200512@Tim: check 2nd leg
            - 202200615@Hank: check combine & delete match
            - 20220915@Hank: add team name & icon vn & update standing info
            - 20230804@Hank: check duplicate stageId
    */
)
BEGIN
	DECLARE _teamId BIGINT DEFAULT(0);
	DECLARE _stageId BIGINT DEFAULT(0);
    
    DROP TEMPORARY TABLE IF EXISTS tmp_MatchIds;
    CREATE TEMPORARY TABLE tmp_MatchIds (MatchId BIGINT, HomeTeamId BIGINT, AwayTeamId BIGINT);
    
	DROP TEMPORARY TABLE IF EXISTS tmp_Standings;
    CREATE TEMPORARY TABLE tmp_Standings (TeamId BIGINT, StageId BIGINT);
    
    INSERT INTO tmp_Standings (TeamId, StageId)
    SELECT DISTINCT s.TeamId, s.StageId
    FROM livescore_season_standings s
	WHERE s.SeasonId = seasonId AND s.StageId > 0;
    
    SELECT t.TeamId, t.TeamNameVN, t.TeamNameEN, t.TeamFullNameEN, t.TeamNameVN, t.Icon, t.IconVN, s.GroupName
		,s.StageId, ss.StageNameEN, rr.NameVN AS StageNameVN, ss.OrderIndex
        ,COALESCE(se.GroupName, s.GroupName) as GroupName, COALESCE(se.Total, s.Total) as Total, COALESCE(se.Won, s.Won) as Won
        ,COALESCE(se.Loss, s.Loss) as Loss, COALESCE(se.Draw, s.Draw) as Draw, COALESCE(se.Points, s.Points) as Points
        ,COALESCE(se.Goals, s.Goals) as Goals, COALESCE(se.GoalsAgainst, s.GoalsAgainst) as GoalsAgainst, COALESCE(se.GoalDiff, s.GoalDiff) as GoalDiff
        ,(IFNULL(se.Position, s.Position)) as Position,  s.Promotion
    FROM livescore_season_standings s
		INNER JOIN livescore_team t ON s.TeamId = t.TeamId
        INNER JOIN livescore_season_stage ss ON s.StageId = ss.StageId AND s.SeasonId = ss.SeasonId
        LEFT JOIN livescore_ref_resource rr ON rr.RefName = 'Stage' AND ss.StageNameEN = rr.NameEN
         LEFT JOIN livescore_season_standings_extra se ON se.SeasonId = s.SeasonId AND se.StageId = s.StageId AND se.TeamId = s.TeamId
    WHERE s.SeasonId = seasonId AND s.StageId > 0
    ORDER BY ss.OrderIndex ASC, GroupName ASC, Position ASC;
    
    
    lbltmpStandings: LOOP
		IF NOT EXISTS (SELECT 1 FROM tmp_Standings) THEN
			LEAVE lbltmpStandings;
		END IF;

		SELECT TeamId, StageId
        INTO _teamId, _stageId
        FROM tmp_Standings LIMIT 1;
        
        INSERT INTO tmp_MatchIds (MatchId, HomeTeamId, AwayTeamId)
		SELECT m.MatchId, m.HomeTeamId, m.AwayTeamId
		FROM livescore_match m
		WHERE m.Status = 50
			AND m.LeagueId = leagueId
			AND (m.HomeTeamId = _teamId OR m.AwayTeamId = _teamId)
			AND m.SeasonId = seasonId
			AND m.StageId = _stageId
            AND m.CombinedId IS NULL
            AND NOT EXISTS (SELECT md.MatchId FROM livescore_match_deleted md WHERE m.MatchId = md.MatchId)
		ORDER BY m.StartTime DESC
		LIMIT 5;

		DELETE FROM tmp_Standings WHERE TeamId = _teamId AND StageId = _stageId;
        
        ITERATE lbltmpStandings;
    END LOOP lbltmpStandings;
    
    SELECT m.MatchId, m.StartTime, m.EndTime, m.Status, m.GroupNum, m.Round
		,CASE WHEN firstleg.MatchId IS NOT NULL THEN 1 ELSE 0 END AS IsSecondLeg
		,m.HomeTeamHalfScore, m.AwayTeamHalfScore, m.HomeTeamTotalScore, m.AwayTeamTotalScore, m.HomeTeamAggregateScore, m.AwayTeamAggregateScore
        ,sh.ExtraScore AS HomeTeamExtraScore, sa.ExtraScore AS AwayTeamExtraScore
        ,sh.PenaltyScore AS HomeTeamPenaltyScore, sa.PenaltyScore AS AwayTeamPenaltyScore
        ,m.HomeTeamId, h.TeamNameEN, h.TeamFullNameEN, m.AwayTeamId, a.TeamNameEN, a.TeamFullNameEN
        ,m.StageId, ss.StageNameEN
    FROM livescore_match m
        INNER JOIN livescore_team h ON m.HomeTeamId = h.TeamId
        INNER JOIN livescore_team a ON m.AwayTeamId = a.TeamId
        INNER JOIN livescore_season_stage ss ON m.StageId = ss.StageId AND m.SeasonId = ss.SeasonId
        LEFT JOIN livescore_match_statistic sh ON m.MatchId = sh.MatchId AND m.HomeTeamId = sh.TeamId
        LEFT JOIN livescore_match_statistic sa ON m.MatchId = sa.MatchId AND m.AwayTeamId = sa.TeamId
        LEFT JOIN livescore_match firstleg ON m.RelatedId = firstleg.MatchId AND m.LeagueId = firstleg.LeagueId AND m.StartTime > firstleg.StartTime
	WHERE EXISTS (SELECT tmp.MatchId FROM tmp_MatchIds tmp WHERE m.MatchId = tmp.MatchId)
    ORDER BY m.StartTime DESC;
END

//
DELIMITER ;	