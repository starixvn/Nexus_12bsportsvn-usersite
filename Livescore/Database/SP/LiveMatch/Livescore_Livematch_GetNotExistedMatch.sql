DROP PROCEDURE IF EXISTS Livescore_Livematch_GetNotExistedMatch;
DELIMITER //

CREATE DEFINER = 'sabasports'@'%' PROCEDURE Livescore_Livematch_GetNotExistedMatch(
    /*
		Creator: Oliver@20220405
        Revisions: - 20220405@Oliver: Insert temporary Live match
        Params: - matchIds: "65723,23232,242123"
    */
)
SQL SECURITY DEFINER
BEGIN
    SELECT l.MatchId
    FROM livescore_match_live l
    LEFT JOIN livescore_match m ON l.MatchId = m.MatchId
    WHERE m.MatchId IS NULL;
END;

//
DELIMITER ;
GRANT EXECUTE ON PROCEDURE Livescore_Livematch_GetNotExistedMatch TO 'sabasports'@'%';