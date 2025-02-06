/*<info serverAlias="SSMS-sabasports" databaseType="2" executers="sabasports" isFunction="0" isNested="0"></info>*/
DROP PROCEDURE IF EXISTS Livescore_Match_Incident_UpdateTimeSync;
DELIMITER //


CREATE DEFINER=`sabasports`@`%` PROCEDURE `Livescore_Match_Incident_UpdateTimeSync`(
	IN updatedTime DATETIME
    ,OUT errCode SMALLINT
	,OUT errMsg VARCHAR(100)
	 /*
		Creator: Hank@20221005
        Revisions: - 20221005@Hank: Get last updated time of incident
    */
)
BEGIN
	DELETE FROM `wp_options`
	WHERE option_name = 'Sync_Incident_UpdatedTime';

	INSERT INTO `wp_options`
	(`option_name`,
    `option_value`)
	VALUES
	('Sync_Incident_UpdatedTime',
    updatedTime) ;
    

END

//
DELIMITER ;