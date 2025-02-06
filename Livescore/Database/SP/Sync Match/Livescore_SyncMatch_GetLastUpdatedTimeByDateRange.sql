DROP PROCEDURE IF EXISTS Livescore_SyncMatch_GetLastUpdatedTimeByDateRange;
DELIMITER //

CREATE DEFINER = 'sabasports'@'%' PROCEDURE Livescore_SyncMatch_GetLastUpdatedTimeByDateRange(
    startTime DATETIME
    ,endTime DATETIME
    ,excludeLiveMatch BIT
    /*
		Creator: Oliver@20220509
        Param: - 
        Revisions: - 20220509@Oliver: init
    */
)
SQL SECURITY DEFINER
BEGIN
    SELECT MAX(m.UpdatedAt) 
    FROM sabasports.livescore_match m 
    LEFT JOIN sabasports.livescore_match_live l ON m.MatchId = l.MatchId
    WHERE (m.StartTime BETWEEN startTime AND endTime)
        AND (
            (IFNULL(excludeLiveMatch, 0) = 0)
            OR (IFNULL(excludeLiveMatch, 0) = 1 AND l.MatchId IS NULL));
END;

//
DELIMITER ;
GRANT EXECUTE ON PROCEDURE Livescore_SyncMatch_GetLastUpdatedTimeByDateRange TO 'sabasports'@'%';