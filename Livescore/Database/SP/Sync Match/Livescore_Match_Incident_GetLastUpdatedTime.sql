/*<info serverAlias="SSMS-sabasports" databaseType="2" executers="sabasports" isFunction="0" isNested="0"></info>*/
DROP PROCEDURE IF EXISTS Livescore_Match_Incident_GetLastUpdatedTime;
DELIMITER //

CREATE DEFINER=`sabasports`@`%` PROCEDURE `Livescore_Match_Incident_GetLastUpdatedTime`(
	 /*
		Creator: Hank@20221005
        Revisions: - 20221005@Hank: Get last updated time of incident
    */
)
BEGIN
	SELECT option_value as UpdatedTime
    FROM wp_options WHERE option_name = 'Sync_Incident_UpdatedTime'
    LIMIT 0, 1;
END

//
DELIMITER ;