DROP PROCEDURE IF EXISTS Livescore_SyncHeadToHead_Import;
DELIMITER //

CREATE DEFINER = 'sabasports'@'%' PROCEDURE Livescore_SyncHeadToHead_Import(
    IN headToHeadJson JSON
    ,OUT errCode SMALLINT
	,OUT errMsg VARCHAR(100)
    /*
		Creator: Oliver@20220325
        Param: - incidentJson: in JSON format
						[{
                            "MatchId": 6227374,
                            "HomeTeamId": 52733,
                            "AwayTeamId": 58293,
                            "ReferenceMatchId": 6227374,
                            "HomeTotalScore": 1,
                            "AwayTotalScore": 0,
                            "HomeHalfScore": 0,
                            "AwayHalfScore": 0,
                        }]
        Revisions: - 20220328@Oliver: init
    */
)
SQL SECURITY DEFINER
BEGIN
 # Variables
    SET errCode=0, errMsg='';
    
    DROP TEMPORARY TABLE IF EXISTS tmp_h2h;
    CREATE TEMPORARY TABLE IF NOT EXISTS tmp_h2h(
                        MatchId BIGINT NOT NULL,
                        HomeTeamId BIGINT NOT NULL,
                        AwayTeamId BIGINT NOT NULL,
                        ReferenceMatchId BIGINT NOT NULL,
                        HomeTotalScore SMALLINT,
                        AwayTotalScore SMALLINT,
                        HomeHalfScore SMALLINT,
                        AwayHalfScore SMALLINT);
    
	INSERT INTO tmp_h2h(
        MatchId,
        HomeTeamId,
        AwayTeamId,
        ReferenceMatchId,
        HomeTotalScore,
        AwayTotalScore,
        HomeHalfScore,
        AwayHalfScore)
    SELECT  m.MatchId,
            m.HomeTeamId,
            m.AwayTeamId,
            m.ReferenceMatchId,
            m.HomeTotalScore,
            m.AwayTotalScore,
            m.HomeHalfScore,
            m.AwayHalfScore
    FROM 
		JSON_TABLE
        (
			headToHeadJson,
            "$[*]"
            COLUMNS
            (
                MatchId BIGINT PATH "$.MatchId",
                HomeTeamId BIGINT PATH "$.HomeTeamId",
                AwayTeamId BIGINT PATH "$.AwayTeamId",
                ReferenceMatchId BIGINT PATH "$.ReferenceMatchId",
                HomeTotalScore SMALLINT PATH "$.HomeTotalScore",
                AwayTotalScore SMALLINT PATH "$.AwayTotalScore",
                HomeHalfScore SMALLINT PATH "$.HomeHalfScore",
                AwayHalfScore SMALLINT PATH "$.AwayHalfScore"
            )
        ) AS m
    WHERE m.MatchId <> m.ReferenceMatchId;

    INSERT INTO livescore_head_to_head(
        MatchId,
        HomeTeamId,
        AwayTeamId,
        ReferenceMatchId,
        HomeHalfScore,
        AwayHalfScore,
        HomeTotalScore,
        AwayTotalScore,
        EventDate,
        SyncedDate)
    SELECT DISTINCT h.MatchId,
            h.HomeTeamId,
            h.AwayTeamId,
            h.ReferenceMatchId,
            m.HomeTeamHalfScore,
            m.AwayTeamHalfScore,
            m.HomeTeamTotalScore,
            m.AwayTeamTotalScore,
            m.StartTime,
            utc_timestamp()
    FROM tmp_h2h h
    INNER JOIN livescore_match m ON h.MatchId = m.MatchId
    ON DUPLICATE KEY UPDATE
        SyncedDate = utc_timestamp();
END;

//
DELIMITER ;
GRANT EXECUTE ON PROCEDURE Livescore_SyncHeadToHead_Import TO 'sabasports'@'%';