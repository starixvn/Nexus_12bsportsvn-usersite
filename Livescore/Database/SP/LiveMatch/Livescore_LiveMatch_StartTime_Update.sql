DROP PROCEDURE IF EXISTS Livescore_LiveMatch_StartTime_Update;
DELIMITER //

CREATE DEFINER = 'sabasports'@'%' PROCEDURE Livescore_LiveMatch_StartTime_Update(
    IN matchId BIGINT
    ,IN startTime DATETIME
    ,IN startTimeStamp BIGINT
    ,OUT errCode SMALLINT
	,OUT errMsg VARCHAR(100)
    /*
		Creator: Oliver@20220513
        Revisions: - 20220513@Oliver: Update Live match start time
        Params:
    */
)
SQL SECURITY DEFINER
BEGIN
    SET errCode=0, errMsg='';

    UPDATE livescore_match_live l
    SET
    l.StartTime = startTime
    WHERE l.MatchId = matchId;

END;

//
DELIMITER ;
GRANT EXECUTE ON PROCEDURE Livescore_LiveMatch_StartTime_Update TO 'sabasports'@'%';