DROP PROCEDURE IF EXISTS Livescore_Match_GetLastUpdatedTime;
DELIMITER //

CREATE DEFINER = 'sabasports'@'%' PROCEDURE Livescore_Match_GetLastUpdatedTime(
    /*
		Creator: Oliver@20220318
        Revisions: - 20220318@Oliver: Get last updated time of match
    */
)
SQL SECURITY DEFINER
BEGIN
    SELECT m.UpdatedAt
    FROM livescore_match m
    ORDER BY m.UpdatedAt DESC
    LIMIT 1;
END;

//
DELIMITER ;
GRANT EXECUTE ON PROCEDURE Livescore_Match_GetLastUpdatedTime TO 'sabasports'@'%';