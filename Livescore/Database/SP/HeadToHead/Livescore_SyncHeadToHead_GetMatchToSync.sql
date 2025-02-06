DROP PROCEDURE IF EXISTS Livescore_SyncHeadToHead_GetMatchToSync;
DELIMITER //

CREATE DEFINER = 'sabasports'@'%' PROCEDURE Livescore_SyncHeadToHead_GetMatchToSync(
    IN fromDate DATETIME
    ,IN toDate DATETIME
    ,IN rowLimit INT
    /*
		Creator: Oliver@20220407
        Revisions: - 20220407@Oliver: init
        Param: 
    */
)
SQL SECURITY DEFINER
BEGIN
    SELECT m.MatchId, 
           m.HomeTeamId, 
           m.AwayTeamId
    FROM livescore_match m
    LEFT JOIN livescore_match_extra me ON m.MatchId = me.MatchId
    WHERE (m.StartTime BETWEEN fromDate AND toDate) 
        AND (me.MatchId IS NULL 
            OR 
            me.MatchId IS NOT NULL AND me.IsSyncedHeadToHead = 0)
    ORDER BY m.MatchId
    LIMIT rowLimit;
END;

//
DELIMITER ;
GRANT EXECUTE ON PROCEDURE Livescore_SyncHeadToHead_GetMatchToSync TO 'sabasports'@'%';