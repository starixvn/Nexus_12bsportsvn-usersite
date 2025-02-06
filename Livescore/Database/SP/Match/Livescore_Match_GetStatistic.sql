DROP PROCEDURE IF EXISTS Livescore_Match_GetStatistic;

DELIMITER //
CREATE DEFINER=`sabasports`@`%` PROCEDURE `Livescore_Match_GetStatistic`(
	matchId BIGINT,
    sportId SMALLINT UNSIGNED
    /*
		Creator: Hank@20220419
        Revisions: - 20220419@Hank: init
    */
)
BEGIN
	DECLARE hTeamId BIGINT;
    DECLARE aTeamId BIGINT;
    
    SELECT m.HomeTeamId, m.AwayTeamId INTO hTeamId, aTeamId
    FROM livescore_match m 
    WHERE m.MatchId = matchId AND m.SportId = sportId;
    
     SELECT s.TeamId, t.TeamNameEN, t.TeamFullNameEN, t.Icon
    , s.Goal, s.CornerKick, s.YellowCard, s.RedCard, s.YellowToRed, s.OutBall, s.FreeKick, s.GoalKick, s.PenaltyKick
    , s.FailPenaltyKick, s.OwnGoal, s.InjuryTime, s.OnGoal, s.MissGoal, s.Attack, s.DangerAttack, s.ControlRate
    , s.ExtraScore, s.PenaltyScore, s.Assists, s.First, s.Follow, s.Grade, s.Foul, s.HalfCorner, s.HalfPossession, s.Head
    , s.HeadSuccess, s.Intercept, s.OffSide, s.OnDoor, s.Pass, s.PassSuccess, s.Past, s.Shoot, s.ShootOut, s.ShootStop
    , s.Slide, s.Steals
    FROM livescore_match_statistic s 
    LEFT JOIN livescore_team t ON t.TeamId = s.TeamId 
    WHERE s.TeamId  = hTeamId AND s.MatchId = matchId;
    
    SELECT s.TeamId, t.TeamNameEN, t.TeamFullNameEN, t.Icon
    , s.Goal, s.CornerKick, s.YellowCard, s.RedCard, s.YellowToRed, s.OutBall, s.FreeKick, s.GoalKick, s.PenaltyKick
    , s.FailPenaltyKick, s.OwnGoal, s.InjuryTime, s.OnGoal, s.MissGoal, s.Attack, s.DangerAttack, s.ControlRate
    , s.ExtraScore, s.PenaltyScore, s.Assists, s.First, s.Follow, s.Grade, s.Foul, s.HalfCorner, s.HalfPossession, s.Head
    , s.HeadSuccess, s.Intercept, s.OffSide, s.OnDoor, s.Pass, s.PassSuccess, s.Past, s.Shoot, s.ShootOut, s.ShootStop
    , s.Slide, s.Steals
    FROM livescore_match_statistic s 
    LEFT JOIN livescore_team t ON t.TeamId = s.TeamId 
    WHERE s.TeamId  = aTeamId AND s.MatchId = matchId;
END
//
DELIMITER ;	