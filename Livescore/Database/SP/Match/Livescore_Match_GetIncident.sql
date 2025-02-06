DROP PROCEDURE IF EXISTS Livescore_Match_GetIncident;

DELIMITER //
CREATE DEFINER=`sabasports`@`%` PROCEDURE `Livescore_Match_GetIncident`(
	matchId BIGINT
    /*
		Creator: Hank@20220419
        Revisions: - 20220419@Hank: init
					- 20221202@Hank: remove sort by time
    */
)
BEGIN
	SELECT mi.Type, mi.Position, mi.Time, mi.Second, mi.HomeScore, mi.AwayScore, mi.PlayerId,  mi.PlayerName AS PlayerName
	, mi.AssistId, mi.AssistName, mi.InPlayerId,  mi.InPlayerName AS InPlayerName, mi.OutPlayerId ,mi.OutPlayerName AS OutPlayerName
	, mi.VarReason, mi.VarResult, mi.ReasonType
    FROM livescore_match_incident mi
    WHERE mi.MatchId =  matchId;
END
//
DELIMITER ;	