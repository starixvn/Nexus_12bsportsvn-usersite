DROP PROCEDURE IF EXISTS Livescore_Sync_Player_Import;
DELIMITER $$
CREATE DEFINER=`sabasports`@`%` PROCEDURE `Livescore_Sync_Player_Import`(
	IN playerListJson JSON
    ,OUT errCode SMALLINT
    ,OUT errMsg VARCHAR(100)
    /*
		Creator: Tim@20220325
        Revisions: - 20220325@Tim: init
    */
)
BEGIN
    SET errCode=0, errMsg='';
    
    DROP TEMPORARY TABLE IF EXISTS tmp_Player;
    CREATE TEMPORARY TABLE IF NOT EXISTS tmp_Player(PlayerId BIGINT
		,TeamId BIGINT
		,Birthday DATE
        ,Weight SMALLINT
        ,Height SMALLINT
        ,NameEN VARCHAR(255)
		,FullNameEN VARCHAR(255)
        ,NameCN VARCHAR(255)
		,FullNameCN VARCHAR(255)
		,Icon VARCHAR(255)
		,ShirtNumber SMALLINT
		,CountryId BIGINT
		,Nationality VARCHAR(255)
		,Description VARCHAR(255)
		,UpdatedAt DATETIME DEFAULT NULL
        ,PRIMARY KEY (PlayerId, TeamId));
    
	INSERT INTO tmp_Player(PlayerId
		,TeamId
		,Birthday
        ,Weight
        ,Height
        ,NameEN
		,FullNameEN
        ,NameCN
		,FullNameCN
		,Icon
		,ShirtNumber
		,CountryId
		,Nationality
        ,Description
		,UpdatedAt)
    SELECT PlayerId
		,TeamId
		,Birthday
        ,Weight
        ,Height
        ,NULLIF(NameEN, 'NULL')
		,NULLIF(FullNameEN, 'NULL')
        ,NULLIF(NameCN, 'NULL')
		,NULLIF(FullNameCN, 'NULL')
		,NULLIF(Icon, 'NULL')
		,ShirtNumber
		,CountryId
		,Nationality
        ,NULLIF(Description, 'NULL')
		,UpdatedAt
    FROM 
		JSON_TABLE
        (
			playerListJson,
            "$[*]"
            COLUMNS
            (
                PlayerId BIGINT PATH "$.PlayerId"
				,TeamId BIGINT PATH "$.TeamId"
				,Birthday DATE PATH "$.Birthday"
				,Weight SMALLINT PATH "$.Weight"
				,Height SMALLINT PATH "$.Height"
				,NameEN VARCHAR(255) PATH "$.NameEN"
				,FullNameEN VARCHAR(255) PATH "$.FullNameEN"
				,NameCN VARCHAR(255) PATH "$.Name"
				,FullNameCN VARCHAR(255) PATH "$.FullName"
				,Icon VARCHAR(255) PATH "$.Icon"
				,ShirtNumber SMALLINT PATH "$.ShirtNumber"
				,CountryId BIGINT PATH "$.CountryId"
				,Nationality VARCHAR(255) PATH "$.Nationality"
				,Description VARCHAR(255) PATH "$.Description"
				,UpdatedAt DATETIME PATH "$.UpdatedAt"
            )
        ) AS p;

	INSERT INTO livescore_player(PlayerId
		,TeamId
		,Birthday
		,Weight
		,Height
		,NameEN
		,FullNameEN
		,NameCN
		,FullNameCN
		,Icon
		,ShirtNumber
		,CountryId
		,Nationality
		,Description
		,UpdatedAt
		,SyncedDate)
	SELECT PlayerId
		,TeamId
		,Birthday
		,Weight
		,Height
		,NameEN
		,FullNameEN
		,NameCN
		,FullNameCN
		,Icon
		,ShirtNumber
		,CountryId
		,Nationality
		,Description
		,UpdatedAt
		,NOW()
	FROM tmp_Player p
	ON DUPLICATE KEY UPDATE
		Birthday = p.Birthday
		,Weight = p.Weight
		,Height = p.Height
		,NameEN = p.NameEN
		,FullNameEN = p.FullNameEN
		,NameCN = p.NameCN
		,FullNameCN = p.FullNameCN
		,Icon = p.Icon
		,ShirtNumber = p.ShirtNumber
		,CountryId = p.CountryId
		,Nationality = p.Nationality
		,Description = p.Description
		,UpdatedAt = p.UpdatedAt
		,SyncedDate = NOW();
END$$
DELIMITER ;

GRANT EXECUTE ON PROCEDURE Livescore_Sync_Player_Import TO 'sabasports'@'%';
