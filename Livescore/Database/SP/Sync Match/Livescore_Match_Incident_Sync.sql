/*<info serverAlias="SSMS-sabasports" databaseType="2" executers="sabasports" isFunction="0" isNested="0"></info>*/
DROP PROCEDURE IF EXISTS Livescore_Match_Incident_Sync;
DELIMITER //

CREATE DEFINER=`sabasports`@`%` PROCEDURE `Livescore_Match_Incident_Sync`(
    IN matchId BIGINT
    ,IN incidentJson JSON
    ,OUT errCode SMALLINT
	,OUT errMsg VARCHAR(100)
    /*
		Creator: Oliver@20220325
        Param: - incidentJson: in JSON format
						[{
                            "MatchId": 6227374,
                            "Type": 3,
                            "Position": 0,
                            "Time": 10,
                            "Second": 10,
                            "HomeScore": 1,
                            "AwayScore": 2,
                            "PlayerId": 6235328,
                            "PlayerName": "Player1",
                            "AssistId": 6235328,
                            "AssistName": "Player1",
                            "InPlayerId": 6235328,
                            "InPlayerName": "Player1",
                            "OutPlayerId": 6235328,
                            "OutPlayerName": "Player1",
                            "VarReason": 2,
                            "VarResult": 10,
                            "ReasonType": 1
                        }]
        Revisions: - 20220328@Oliver: init
		Revisions: - 20220915@Hank: fix duplicate player name
					- 20221202@Hank: remove sort by time
    */
)
BEGIN
 # Variables
    SET errCode=0, errMsg='';
    
    DROP TEMPORARY TABLE IF EXISTS tmp_incident;
    CREATE TEMPORARY TABLE IF NOT EXISTS tmp_incident(
                        Type TINYINT,
                        Position TINYINT,
                        Time SMALLINT,
                        Second INT,
                        HomeScore SMALLINT,
                        AwayScore SMALLINT,
                        PlayerId BIGINT,
                        PlayerName VARCHAR(100),
                        AssistId BIGINT,
                        AssistName VARCHAR(100),
                        InPlayerId BIGINT,
                        InPlayerName VARCHAR(100),
                        OutPlayerId BIGINT,
                        OutPlayerName VARCHAR(100),
                        VarReason SMALLINT,
                        VarResult SMALLINT,
                        ReasonType SMALLINT);
    
	INSERT INTO tmp_incident(
        Type,
        Position,
        Time,
        Second,
        HomeScore,
        AwayScore,
        PlayerId,
        PlayerName,
        AssistId,
        AssistName,
        InPlayerId,
        InPlayerName,
        OutPlayerId,
        OutPlayerName,
        VarReason,
        VarResult,
        ReasonType)
    SELECT  ti.Type,
            ti.Position,
            ti.Time,
            ti.Second,
            ti.HomeScore,
            ti.AwayScore,
            ti.PlayerId,
            (SELECT 
				(CASE
                WHEN IFNULL(p.NameEN, '') <> '' THEN p.NameEN
                ELSE IFNULL(p.FullNameEN, '')
                END) FROM livescore_player p WHERE ti.PlayerId = p.PlayerId AND p.TeamId > 0 LIMIT 0,1) as PlayerName,
            ti.AssistId,
            (SELECT 
				(CASE
                WHEN IFNULL(a.NameEN, '') <> '' THEN a.NameEN
                ELSE IFNULL(a.FullNameEN, '')
                END) FROM livescore_player a WHERE ti.AssistId = a.PlayerId AND a.TeamId > 0 LIMIT 0,1) AS AssistPlayerName,
            ti.InPlayerId,
            (SELECT 
				(CASE
                WHEN IFNULL(i.NameEN, '') <> '' THEN i.NameEN
                ELSE IFNULL(i.FullNameEN, '')
                END) FROM livescore_player i WHERE ti.InPlayerId = i.PlayerId AND i.TeamId > 0 LIMIT 0,1) AS InPlayerName,
            ti.OutPlayerId,
            (SELECT 
				(CASE
                WHEN IFNULL(o.NameEN, '') <> '' THEN o.NameEN
                ELSE IFNULL(o.FullNameEN, '')
                END) FROM livescore_player o WHERE ti.OutPlayerId = o.PlayerId AND o.TeamId > 0 LIMIT 0,1) AS OutPlayerName,
            ti.VarReason,
            ti.VarResult,
            ti.ReasonType
    FROM 
		JSON_TABLE
        (
			incidentJson,
            "$[*]"
            COLUMNS
            (
                Type TINYINT PATH "$.Type",
                Position TINYINT PATH "$.Position",
                Time SMALLINT PATH "$.Time",
                Second INT PATH "$.Second",
                HomeScore SMALLINT PATH "$.HomeScore",
                AwayScore SMALLINT PATH "$.AwayScore",
                PlayerId BIGINT PATH "$.PlayerId",
                PlayerName VARCHAR(100) PATH "$.PlayerName",
                AssistId BIGINT PATH "$.AssistId",
                AssistName VARCHAR(100) PATH "$.AssistName",
                InPlayerId BIGINT PATH "$.InPlayerId",
                InPlayerName VARCHAR(100) PATH "$.InPlayerName",
                OutPlayerId BIGINT PATH "$.OutPlayerId",
                OutPlayerName VARCHAR(100) PATH "$.OutPlayerName",
                VarReason SMALLINT PATH "$.VarReason",
                VarResult SMALLINT PATH "$.VarResult",
                ReasonType SMALLINT PATH "$.ReasonType"
            )
        ) AS ti;

    DELETE FROM livescore_match_incident lmi
    WHERE lmi.MatchId = matchId;
    

    INSERT INTO livescore_match_incident(
        MatchId,
        Type,
        Position,
        Time,
        Second,
        HomeScore,
        AwayScore,
        PlayerId,
        PlayerName,
        AssistId,
        AssistName,
        InPlayerId,
        InPlayerName,
        OutPlayerId,
        OutPlayerName,
        VarReason,
        VarResult,
        ReasonType)
    SELECT DISTINCT matchId,
            ti.Type,
            ti.Position,
            ti.Time,
            ti.Second,
            ti.HomeScore,
            ti.AwayScore,
            ti.PlayerId,
            ti.PlayerName,
            ti.AssistId,
            ti.AssistName,
            ti.InPlayerId,
            ti.InPlayerName,
            ti.OutPlayerId,
            ti.OutPlayerName,
            ti.VarReason,
            ti.VarResult,
            ti.ReasonType
    FROM tmp_incident ti;
        
END

//
DELIMITER ;