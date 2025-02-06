DROP PROCEDURE IF EXISTS Livescore_Match_GetLineup;

DELIMITER //
CREATE DEFINER=`sabasports`@`%` PROCEDURE `Livescore_Match_GetLineup`(
	matchId BIGINT
     /*
		Creator: Hank@20220419
        Revisions: - 20220419@Hank: init
    */
)
BEGIN
	DECLARE hId BIGINT;
    DECLARE aId  BIGINT;
    DECLARE homeCoach VARCHAR(200);
    DECLARE awayCoach VARCHAR(200);
    
    SELECT m.HomeTeamId, m.AwayTeamId INTO hId, aId
    FROM livescore_match  m
    WHERE m.MatchId = matchId AND m.SportId = 1;
    
    SELECT t.CoachNameEN INTO homeCoach
    FROM livescore_team t
    WHERE t.TeamId = hId;
    
    SELECT t.CoachNameEN INTO awayCoach
    FROM livescore_team t
    WHERE t.TeamId = aId;
    
	SELECT l.HomeFormation, l.AwayFormation, homeCoach AS HomeCoach, awayCoach AS AwayCoach
    FROM livescore_lineup l
    WHERE l.MatchId = matchId;
    
    SELECT t.TeamId, t.PlayerId, t.PlayerName AS PlayerName
    ,t.IsSubstitute, t.PlayerNumber, t.Position, t.CoordinateX, t.CoordinateY, t.Role
    FROM livescore_lineup_detail t
    WHERE t.MatchId = matchId AND t.TeamId = hId
    ORDER BY t.Position = 0, t.CoordinateY,  t.CoordinateX, t.position;
    
    SELECT t.TeamId, t.PlayerId,  t.PlayerName AS PlayerName, 
    t.IsSubstitute, t.PlayerNumber, t.Position, t.CoordinateX, t.CoordinateY, t.Role
    FROM livescore_lineup_detail t
    WHERE t.MatchId = matchId AND t.TeamId = aId 
    ORDER BY t.Position = 0, t.CoordinateY,  t.CoordinateX, t.position ;
    
    
END
//
DELIMITER ;	