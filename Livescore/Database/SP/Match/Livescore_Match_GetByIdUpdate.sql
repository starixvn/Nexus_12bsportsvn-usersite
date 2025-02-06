/*<info serverAlias="SSMS-sabasports" databaseType="2" executers="sabasports" isFunction="0" isNested="0"></info>*/
DROP PROCEDURE IF EXISTS Livescore_Match_GetByIdUpdate;
DELIMITER //

CREATE DEFINER=`sabasports`@`%` PROCEDURE `Livescore_Match_GetByIdUpdate`(
	matchId BIGINT, 
    IN sportId SMALLINT UNSIGNED
    /*
		Creator: Hank@20220920
        Revisions:
			- 20220920@Hank: init

    */
)
BEGIN
     SELECT m.MatchId, m.EndTime, m.Round
		,CASE WHEN firstleg.MatchId IS NOT NULL THEN 1 ELSE 0 END AS IsSecondLeg
		,m.HomeTeamTotalScore, m.AwayTeamTotalScore
        ,mc.StartTime as StartTimeCustom, m.StartTime
        ,mc.Status as StatusCustom, m.Status, mc.Round as RoundCustom, m.Round
		,mc.HomeTeamHalfScore as HomeTeamHalfScoreCustom, m.HomeTeamHalfScore, mc.AwayTeamHalfScore as AwayTeamHalfScoreCustom, m.AwayTeamHalfScore
        ,mc.HomeTeamAggregateScore as HomeTeamAggregateScoreCustom, m.HomeTeamAggregateScore, mc.AwayTeamAggregateScore as AwayTeamAggregateScoreCustom, m.AwayTeamAggregateScore
        ,mc.HomeTeamPenaltyScore as HomeTeamPenaltyScoreCustom, sh.PenaltyScore as HomeTeamPenaltyScore, mc.AwayTeamPenaltyScore as AwayTeamPenaltyScoreCustom, sa.PenaltyScore as AwayTeamPenaltyScore
		,mc.HomeTeamExtraScore as HomeTeamExtraScoreCustom, sh.ExtraScore as HomeTeamExtraScore, mc.AwayTeamExtraScore as AwayTeamExtraScoreCustom, sa.ExtraScore as AwayTeamExtraScore
        ,m.LeagueId,  l.LeagueNameVN,  l.LeagueNameEN, l.LeagueFullNameEN, l.CurrentRound, l.CurrentSeasonId, l.Icon
        ,m.SeasonId
        ,ss.StageId, ss.StageNameEN, rr.NameVN AS StageNameVN, ss.Mode, ss.GroupCount, ss.RoundCount, ss.OrderIndex
		,m.HomeTeamId, h.TeamNameEN, h.TeamFullNameEN, h.TeamNameVN, h.Icon, h.IconVN
        ,m.AwayTeamId, a.TeamNameEN, a.TeamFullNameEN, a.TeamNameVN, a.Icon, a.IconVN
    FROM livescore_match m
		INNER JOIN livescore_league l ON m.LeagueId = l.LeagueId
		INNER JOIN livescore_team h ON m.HomeTeamId = h.TeamId
		INNER JOIN livescore_team a ON m.AwayTeamId = a.TeamId
		LEFT JOIN livescore_match_statistic sh ON m.MatchId = sh.MatchId AND m.HomeTeamId = sh.TeamId
		LEFT JOIN livescore_match_statistic sa ON m.MatchId = sa.MatchId AND m.AwayTeamId = sa.TeamId
        LEFT JOIN livescore_season_stage ss ON m.StageId = ss.StageId
        LEFT JOIN livescore_ref_resource rr ON rr.RefName = 'Stage' AND ss.StageNameEN = rr.NameEN
        LEFT JOIN livescore_match firstleg ON m.RelatedId = firstleg.MatchId AND m.LeagueId = firstleg.LeagueId AND m.StartTime > firstleg.StartTime
        LEFT JOIN livescore_match_custom mc ON mc.MatchId = m.matchId
    WHERE m.MatchId = matchId AND m.SportId = sportId AND m.Status IS NOT NULL AND m.CombinedId IS NULL
		AND NOT EXISTS (SELECT md.MatchId FROM livescore_match_deleted md WHERE m.MatchId = md.MatchId);
END

//
DELIMITER ;	