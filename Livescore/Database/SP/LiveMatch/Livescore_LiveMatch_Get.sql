DROP PROCEDURE IF EXISTS Livescore_LiveMatch_Get;
DELIMITER //

CREATE DEFINER = 'sabasports'@'%' PROCEDURE Livescore_LiveMatch_Get(
    /*
		Creator: Oliver@20220512
        Revisions: - 20220405@Oliver: Get current live matchId
        Params: 
    */
)
SQL SECURITY DEFINER
BEGIN
    SELECT MatchId
    FROM livescore_match_live;
END;

//
DELIMITER ;
GRANT EXECUTE ON PROCEDURE Livescore_LiveMatch_Get TO 'sabasports'@'%';