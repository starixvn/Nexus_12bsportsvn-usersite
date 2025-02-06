DROP PROCEDURE IF EXISTS Livescore_Match_GetDetail;

DELIMITER //
CREATE DEFINER=`sabasports`@`%` PROCEDURE `Livescore_Match_GetDetail`(
	matchId BIGINT
    ,sportId SMALLINT UNSIGNED
    /*
		Creator: Hank@20220419
        Revisions: - 20220419@Hank: init
    */
    
)
BEGIN
	DECLARE hTeamId BIGINT;
    DECLARE aTeamId BIGINT;
    
    SELECT m.MatchId, m.StartTime, m.EndTime, m.Status
		,m.HomeTeamHalfScore, m.AwayTeamHalfScore, m.HomeTeamTotalScore, m.AwayTeamTotalScore, m.HomeTeamAggregateScore, m.AwayTeamAggregateScore
		,m.LeagueId, l.LeagueNameEN, l.LeagueFullNameEN, l.CurrentRound, l.Icon, s.SeasonId, s.StartTime, s.EndTime, s.Year, ss.StageId, ss.StageNameEN
		,@hTeamId := m.HomeTeamId AS HomeTeamId, h.TeamNameEN, h.TeamFullNameEN, h.Icon
        ,@aTeamId := m.AwayTeamId AS AwayTeamId, a.TeamNameEN, a.TeamFullNameEN, a.Icon
    FROM livescore_match m
    INNER JOIN livescore_league l ON m.LeagueId = l.LeagueId
	INNER JOIN livescore_team h ON m.HomeTeamId = h.TeamId
	INNER JOIN livescore_team a ON m.AwayTeamId = a.TeamId
    LEFT JOIN livescore_season s ON m.SeasonId = s.SeasonId
	LEFT JOIN livescore_season_stage ss ON m.StageId = ss.StageId
    WHERE m.MatchId = matchId AND m.SportId = sportId;
    
    SELECT mi.Type, mi.Position, mi.Time, mi.Second, mi.HomeScore, mi.AwayScore, mi.PlayerId, IFNULL(player.NameEN, mi.PlayerName) as PlayerName
	, mi.AssistId, mi.AssistName, mi.InPlayerId, IFNULL(inplayer.NameEN, mi.InPlayerName) as InPlayerName, mi.OutPlayerId ,IFNULL(outplayer.NameEN, mi.OutPlayerName) as OutPlayerName
	, mi.VarReason, mi.VarResult, mi.ReasonType
    FROM livescore_match_incident mi
    LEFT JOIN livescore_player AS player ON player.PlayerId = mi.PlayerId
    LEFT JOIN livescore_player AS inplayer ON inplayer.PlayerId = mi.PlayerId
    LEFT JOIN livescore_player AS outplayer ON outplayer.PlayerId = mi.PlayerId
    WHERE mi.MatchId =  matchId
    ORDER BY mi.second;
    
    SELECT s.TeamId, t.TeamNameEN, t.TeamFullNameEN, t.Icon
    , s.Goal, s.CornerKick, s.YellowCard, s.RedCard, s.YellowToRed, s.OutBall, s.FreeKick, s.GoalKick, s.PenaltyKick
    , s.FailPenaltyKick, s.OwnGoal, s.InjuryTime, s.OnGoal, s.MissGoal, s.Attack, s.DangerAttack, s.ControlRate
    , s.ExtraScore, s.PenaltyScore, s.Assists, s.First, s.Follow, s.Grade, s.Foul, s.HalfCorner, s.HalfPossession, s.Head
    , s.HeadSuccess, s.Intercept, s.OffSide, s.OnDoor, s.Pass, s.PassSuccess, s.Past, s.Shoot, s.ShootOut, s.ShootStop
    , s.Slide, s.Steals
    FROM livescore_match_statistic s 
    INNER JOIN livescore_team t ON t.TeamId = s.TeamId 
    WHERE s.TeamId  = @hTeamId AND s.MatchId = matchId;
    
    SELECT s.TeamId, t.TeamNameEN, t.TeamFullNameEN, t.Icon
    , s.Goal, s.CornerKick, s.YellowCard, s.RedCard, s.YellowToRed, s.OutBall, s.FreeKick, s.GoalKick, s.PenaltyKick
    , s.FailPenaltyKick, s.OwnGoal, s.InjuryTime, s.OnGoal, s.MissGoal, s.Attack, s.DangerAttack, s.ControlRate
    , s.ExtraScore, s.PenaltyScore, s.Assists, s.First, s.Follow, s.Grade, s.Foul, s.HalfCorner, s.HalfPossession, s.Head
    , s.HeadSuccess, s.Intercept, s.OffSide, s.OnDoor, s.Pass, s.PassSuccess, s.Past, s.Shoot, s.ShootOut, s.ShootStop
    , s.Slide, s.Steals
    FROM livescore_match_statistic s 
    INNER JOIN livescore_team t ON t.TeamId = s.TeamId 
    WHERE s.TeamId  = @aTeamId AND s.MatchId = matchId;
    
     /* Lineup*/
    SELECT l.HomeFormation, l.AwayFormation, l.HomeCoach, l.AwayCoach
    FROM livescore_lineup l
    WHERE l.MatchId = matchId;
    
    SELECT t.TeamId, t.PlayerId, IFNULL(player.NameEN, t.PlayerName) AS PlayerName, t.IsSubstitute, t.PlayerNumber, t.Position, t.CoordinateX, t.CoordinateY
    FROM livescore_lineup_detail t
    LEFT JOIN livescore_player AS player ON player.PlayerId = t.PlayerId
    WHERE t.MatchId = matchId AND t.TeamId = @hTeamId
    ORDER BY t.Position = 0, t.CoordinateY,  t.CoordinateX, t.position;
    
    SELECT t.TeamId, t.PlayerId, IFNULL(player.NameEN, t.PlayerName) AS PlayerName, t.IsSubstitute, t.PlayerNumber, t.Position, t.CoordinateX, t.CoordinateY
    FROM livescore_lineup_detail t
    LEFT JOIN livescore_player AS player ON player.PlayerId = t.PlayerId
    WHERE t.MatchId = matchId AND t.TeamId = @aTeamId 
    ORDER BY t.Position = 0, t.CoordinateY,  t.CoordinateX, t.position ;
    
    /* Head to head*/
    SELECT h.MatchId, h.HomeHalfScore, h.AwayHalfScore, h.HomeTotalScore, h.AwayTotalScore, m.StartTime
    , home.TeamId AS HomeTeamId, home.TeamNameEN AS HomeTeamNameEN, home.TeamFullNameEN AS HomeTeamFullNameEN, home.Icon AS HomeTeamIcon
    , away.TeamId AS AwayTeamId, away.TeamNameEN AS AwayTeamNameEN, away.TeamFullNameEN AS AwayTeamFullNameEN, away.Icon AS AwayTeamIcon
    FROM livescore_head_to_head h 
    LEFT JOIN livescore_match m ON m.MatchId = h.MatchId
    LEFT JOIN livescore_team home ON home.TeamId = h.HomeTeamId
    LEFT JOIN livescore_team away ON away.TeamId = h.AwayTeamId
    WHERE h.HomeTeamId = @hTeamId AND h.awayTeamId = @aTeamId
    ORDER BY h.EventDate DESC
    LIMIT 0,5;
    
    SELECT h.MatchId, h.HomeHalfScore, h.AwayHalfScore, h.HomeTotalScore, h.AwayTotalScore, m.StartTime
    , home.TeamId AS HomeTeamId, home.TeamNameEN AS HomeTeamNameEN, home.TeamFullNameEN AS HomeTeamFullNameEN, home.Icon AS HomeTeamIcon
    , away.TeamId AS AwayTeamId, away.TeamNameEN AS AwayTeamNameEN, away.TeamFullNameEN AS AwayTeamFullNameEN, away.Icon AS AwayTeamIcon
    FROM livescore_head_to_head h 
    LEFT JOIN livescore_match m ON m.MatchId = h.MatchId
    LEFT JOIN livescore_team home ON home.TeamId = h.HomeTeamId
    LEFT JOIN livescore_team away ON away.TeamId = h.AwayTeamId
    WHERE h.HomeTeamId = @hTeamId OR h.awayTeamId = @hTeamId
    ORDER BY h.EventDate DESC
	LIMIT 0,5;
    
    SELECT h.MatchId, h.HomeHalfScore, h.AwayHalfScore, h.HomeTotalScore, h.AwayTotalScore, m.StartTime
    , home.TeamId AS HomeTeamId, home.TeamNameEN AS HomeTeamNameEN, home.TeamFullNameEN AS HomeTeamFullNameEN, home.Icon AS HomeTeamIcon
    , away.TeamId AS AwayTeamId, away.TeamNameEN AS AwayTeamNameEN, away.TeamFullNameEN AS AwayTeamFullNameEN, away.Icon AS AwayTeamIcon
    FROM livescore_head_to_head h 
    LEFT JOIN livescore_match m ON m.MatchId = h.MatchId
    LEFT JOIN livescore_team home ON home.TeamId = h.HomeTeamId
    LEFT JOIN livescore_team away ON away.TeamId = h.AwayTeamId
    WHERE h.HomeTeamId = @aTeamId OR h.awayTeamId = @aTeamId
    ORDER BY h.EventDate DESC
    LIMIT 0,5;

END
//
DELIMITER ;	