DROP PROCEDURE IF EXISTS Livescore_HttpRequestLog_Insert;
DELIMITER //
CREATE DEFINER=`sabasports`@`%` PROCEDURE `Livescore_HttpRequestLog_Insert`(
	IN requestUrl VARCHAR(200)
    ,IN param TEXT
    ,IN response LONGTEXT
    ,OUT errCode SMALLINT
    ,OUT errMsg VARCHAR(100)
    /*
		Creator: Oliver@20220419
        Revisions: - 20220419@Oliver: init
    */
)
BEGIN
    SET errCode=0, errMsg='';
    INSERT INTO livescore_api_logs
    (LogDateUTC,
    RequestUrl,
    RequestParams,
    ResponseData)
    VALUES
    (utc_timestamp(),
    requestUrl,
    param,
    response
    );
END;

//
DELIMITER ;
GRANT EXECUTE ON PROCEDURE Livescore_HttpRequestLog_Insert TO 'sabasports'@'%';
