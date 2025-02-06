DROP PROCEDURE IF EXISTS Livescore_SyncHeadToHead_UpdateSyncedMatch;
DELIMITER //

CREATE DEFINER = 'sabasports'@'%' PROCEDURE Livescore_SyncHeadToHead_UpdateSyncedMatch(
    matchId BIGINT
    ,OUT errCode SMALLINT
	,OUT errMsg VARCHAR(100)
    /*
		Creator: Oliver@20220407
        Revisions: - 20220407@Oliver: init
        Param: 
    */
)
SQL SECURITY DEFINER
BEGIN

    SET errCode=0, errMsg='';

    INSERT INTO livescore_match_extra(MatchId, IsSyncedHeadToHead)
    VALUES(matchId, 1)
    ON DUPLICATE KEY UPDATE
        IsSyncedHeadToHead = 1;
END;

//
DELIMITER ;
GRANT EXECUTE ON PROCEDURE Livescore_SyncHeadToHead_UpdateSyncedMatch TO 'sabasports'@'%';