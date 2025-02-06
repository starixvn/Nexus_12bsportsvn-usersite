DROP PROCEDURE IF EXISTS Livescore_Livematch_Temporary_Insert;
DELIMITER //

CREATE DEFINER = 'sabasports'@'%' PROCEDURE Livescore_Livematch_Temporary_Insert(
    IN matchIds TEXT
    ,OUT errCode SMALLINT
	,OUT errMsg VARCHAR(100)
    /*
		Creator: Oliver@20220405
        Revisions: - 20220405@Oliver: Insert temporary Live match
        Params: - matchIds: "65723,23232,242123"
    */
)
SQL SECURITY DEFINER
Livescore_Livematch_Temporary_Insert:BEGIN
    SET errCode=0, errMsg='';
    
    DROP TEMPORARY TABLE IF EXISTS tmp_Match;
    CREATE TEMPORARY TABLE IF NOT EXISTS tmp_Match(MatchId bigint PRIMARY KEY NOT NULL);

    IF IFNULL(matchIds,'') = ''THEN
		BEGIN
			DELETE l 
			FROM livescore_match_live l;

			LEAVE Livescore_Livematch_Temporary_Insert;
        END;
    END IF;

    SET @sqlCommand = REPLACE(matchIds, ',', '),(');
    SET @sqlCommand = CONCAT('(', @sqlCommand, ')');
    SET @sqlCommand = CONCAT('INSERT INTO tmp_Match VALUES', @sqlCommand); 
                                                        
    PREPARE stmt FROM  @sqlCommand;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;

    DELETE l 
    FROM livescore_match_live l
    LEFT JOIN tmp_Match m ON l.MatchId = m.MatchId
    WHERE m.MatchId IS NULL;

    INSERT INTO livescore_match_live(MatchId)
    SELECT m.MatchId
    FROM tmp_Match m
    ON DUPLICATE KEY UPDATE
        MatchId = m.MatchId;
END;

//
DELIMITER ;
GRANT EXECUTE ON PROCEDURE Livescore_Livematch_Temporary_Insert TO 'sabasports'@'%';