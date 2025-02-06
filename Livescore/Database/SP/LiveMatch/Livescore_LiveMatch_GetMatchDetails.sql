DROP PROCEDURE IF EXISTS Livescore_LiveMatch_GetMatchDetails;
DELIMITER //

CREATE DEFINER = 'sabasports'@'%' PROCEDURE Livescore_LiveMatch_GetMatchDetails(
    IN matchId BIGINT
    /*
		Creator: Oliver@20220406
        Revisions: - 20220406@Oliver: Get match details
        Params: 
    */
)
SQL SECURITY DEFINER
BEGIN

    DECLARE homeId BIGINT;
    DECLARE awayId BIGINT;

    SELECT m.HomeTeamId,  m.AwayTeamId INTO homeId, awayId
    FROM livescore_match m
    WHERE m.MatchId = matchId
    LIMIT 1;

    SELECT m.MatchId, m.StartTime, m.EndTime, m.Status
		,m.HomeTeamHalfScore, m.AwayTeamHalfScore, m.HomeTeamTotalScore, m.AwayTeamTotalScore, m.HomeTeamAggregateScore, m.AwayTeamAggregateScore
		,m.LeagueId, l.LeagueNameEN, l.LeagueFullNameEN, l.CurrentRound, l.Icon, l.IsMajor
		,m.HomeTeamId, h.TeamNameEN, h.TeamFullNameEN, h.Icon
        ,m.AwayTeamId, a.TeamNameEN, a.TeamFullNameEN, a.Icon
        
    FROM livescore_match m
        INNER JOIN livescore_league l ON m.LeagueId = l.LeagueId
        INNER JOIN livescore_team h ON m.HomeTeamId = h.TeamId
        INNER JOIN livescore_team a ON m.AwayTeamId = a.TeamId
    WHERE m.MatchId = matchId;

    SELECT sh.Goal AS HomeGoal, sh.CornerKick, sh.YellowCard, sh.RedCard, sh.YellowToRed, sh.OutBall, sh.FreeKick, sh.GoalKick, sh.PenaltyKick
            , sh.FailPenaltyKick, sh.OwnGoal, sh.InjuryTime, sh.OnGoal, sh.MissGoal, sh.Attack, sh.DangerAttack, sh.ControlRate
            , sh.ExtraScore, sh.PenaltyScore, sh.Assists, sh.First, sh.Follow, sh.Grade, sh.Foul, sh.HalfCorner, sh.HalfPossession, sh.Head
            , sh.HeadSuccess, sh.Intercept, sh.OffSide, sh.OnDoor, sh.Pass, sh.PassSuccess, sh.Past, sh.Shoot, sh.ShootOut, sh.ShootStop
            , sh.Slide
    FROM livescore_match_statistic sh 
    WHERE sh.MatchId = matchId AND sh.TeamId = homeId;

    SELECT sa.Goal AS AwayGoal, sa.CornerKick, sa.YellowCard, sa.RedCard, sa.YellowToRed, sa.OutBall, sa.FreeKick, sa.GoalKick, sa.PenaltyKick
            , sa.FailPenaltyKick, sa.OwnGoal, sa.InjuryTime, sa.OnGoal, sa.MissGoal, sa.Attack, sa.DangerAttack, sa.ControlRate
            , sa.ExtraScore, sa.PenaltyScore, sa.Assists, sa.First, sa.Follow, sa.Grade, sa.Foul, sa.HalfCorner, sa.HalfPossession, sa.Head
            , sa.HeadSuccess, sa.Intercept, sa.OffSide, sa.OnDoor, sa.Pass, sa.PassSuccess, sa.Past, sa.Shoot, sa.ShootOut, sa.ShootStop
            , sa.Slide
    FROM livescore_match_statistic sa 
    WHERE sa.MatchId = matchId AND sa.TeamId = homeId;

    SELECT mi.Type, mi.Position, mi.Time, mi.Second, mi.HomeScore, mi.AwayScore, mi.PlayerId, IFNULL(player.NameEN, mi.PlayerName) as PlayerName
	, mi.AssistId, mi.AssistName, mi.InPlayerId, IFNULL(inplayer.NameEN, mi.InPlayerName) as InPlayerName, mi.OutPlayerId ,IFNULL(outplayer.NameEN, mi.OutPlayerName) as OutPlayerName
	, mi.VarReason, mi.VarResult, mi.ReasonType
    FROM livescore_match_incident mi
    LEFT JOIN livescore_player as player ON player.PlayerId = mi.PlayerId
    LEFT JOIN livescore_player as inplayer ON inplayer.PlayerId = mi.PlayerId
    LEFT JOIN livescore_player as outplayer ON outplayer.PlayerId = mi.PlayerId
    WHERE mi.MatchId =  matchId
    ORDER BY mi.second;

    SELECT l.HomeFormation, l.AwayFormation, l.HomeCoach, l.AwayCoach
    FROM livescore_lineup l
    WHERE l.MatchId = matchId;
    
    SELECT t.TeamId, t.PlayerId, IFNULL(player.NameEN, t.PlayerName) as PlayerName, t.IsSubstitute, t.PlayerNumber, t.Position, t.CoordinateX, t.CoordinateY
    FROM livescore_lineup_detail t
    LEFT JOIN livescore_player as player ON player.PlayerId = t.PlayerId
    WHERE t.MatchId = matchId AND t.TeamId = homeId
    ORDER BY t.Position = 0, t.CoordinateY,  t.CoordinateX, t.position;
    
    SELECT t.TeamId, t.PlayerId, IFNULL(player.NameEN, t.PlayerName) as PlayerName, t.IsSubstitute, t.PlayerNumber, t.Position, t.CoordinateX, t.CoordinateY
    FROM livescore_lineup_detail t
    LEFT JOIN livescore_player as player ON player.PlayerId = t.PlayerId
    WHERE t.MatchId = matchId AND t.TeamId = awayId 
    ORDER BY t.Position = 0, t.CoordinateY,  t.CoordinateX, t.position;
END;

//
DELIMITER ;
GRANT EXECUTE ON PROCEDURE Livescore_LiveMatch_GetMatchDetails TO 'sabasports'@'%';