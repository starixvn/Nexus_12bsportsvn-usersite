DROP PROCEDURE IF EXISTS Livesocre_Match_GetMaxMatchId;
DELIMITER //

CREATE DEFINER = 'sabasports'@'%' PROCEDURE Livesocre_Match_GetMaxMatchId(
    /*
		Creator: Oliver@20220318
        Param: - 
        Revisions: - 20220318@Oliver: init
    */
)
SQL SECURITY DEFINER
BEGIN
    SELECT m.MatchId 
    FROM livescore_match m
    ORDER BY MatchId DESC 
    LIMIT 1;
END;

//
DELIMITER ;
GRANT EXECUTE ON PROCEDURE Livesocre_Match_GetMaxMatchId TO 'sabasports'@'%';