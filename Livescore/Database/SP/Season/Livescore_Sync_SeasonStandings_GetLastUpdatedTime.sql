DROP PROCEDURE IF EXISTS Livescore_Sync_SeasonStandings_GetLastUpdatedTime;
DELIMITER //

CREATE DEFINER=`sabasports`@`%` PROCEDURE `Livescore_Sync_SeasonStandings_GetLastUpdatedTime`(
    /*
		Creator: Tim@20220329
        Revisions: - 20220329@Tim: init
    */
)
BEGIN
    SELECT MAX(UpdatedAt)
    FROM livescore_season_standings;
END;

//
DELIMITER;
GRANT EXECUTE ON PROCEDURE Livescore_Sync_SeasonStandings_GetLastUpdatedTime TO 'sabasports'@'%';