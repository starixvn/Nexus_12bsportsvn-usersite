DROP PROCEDURE IF EXISTS Livescore_Match_Commentary_Sync;
DELIMITER //

CREATE DEFINER = 'sabasports'@'%' PROCEDURE Livescore_Match_Commentary_Sync(
    IN commentaryJson JSON
    ,OUT errCode SMALLINT
	,OUT errMsg VARCHAR(100)
    /*
		Creator: Oliver@20220325
        Param: - commentaryJson: in JSON format
						[{
                            "MatchId": 6227374,
                            "Time": "3'",
                            "Data": "A player of Univ.Cesar Vallejo took a free kick.",
                        }]
        Revisions: - 20220328@Oliver: init
    */
)
SQL SECURITY DEFINER
BEGIN
 # Variables
    SET errCode=0, errMsg='';
    
    DROP TEMPORARY TABLE IF EXISTS tmp_commentary;
    CREATE TEMPORARY TABLE IF NOT EXISTS tmp_commentary(
                        MatchId BIGINT,
                        Time VARCHAR(20),
                        Data VARCHAR(500));
    
	INSERT INTO tmp_commentary(MatchId, Time, Data)
    SELECT m.MatchId, m.Time, m.Data
    FROM 
		JSON_TABLE
        (
			commentaryJson,
            "$[*]"
            COLUMNS
            (
                MatchId BIGINT PATH "$.MatchId",
                Time VARCHAR(20) PATH "$.Time",
                Data VARCHAR(500) PATH "$.Data"
            )
        ) AS m;


    DELETE FROM livescore_match_commentary lmc
    WHERE lmc.MatchId IN (SELECT MatchId FROM tmp_commentary);

    INSERT INTO livescore_match_commentary(MatchId, Time, Data)
    SELECT tc.MatchId, tc.Time, tc.Data
    FROM tmp_commentary tc
    ORDER BY tc.Time;
        
END;

//
DELIMITER ;
GRANT EXECUTE ON PROCEDURE Livescore_Match_Commentary_Sync TO 'sabasports'@'%';