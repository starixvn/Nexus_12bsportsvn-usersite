DROP PROCEDURE IF EXISTS Livescore_Sync_Stage_Import;
DELIMITER //
CREATE DEFINER=`sabasports`@`%` PROCEDURE `Livescore_Sync_Stage_Import`(
	IN stageListJson JSON
    ,OUT errCode SMALLINT
    ,OUT errMsg VARCHAR(100)
    /*
		Creator: Tim@20220328
        Revisions: 
			- 20220328@Tim: init
            - 20220609@Hank: insert seasonID = 0 when null
            - 20221001@Hank: sync mode field
    */
)
BEGIN
    SET errCode=0, errMsg='';
    
    DROP TEMPORARY TABLE IF EXISTS tmp_Stage;
    CREATE TEMPORARY TABLE IF NOT EXISTS tmp_Stage(
		SeasonId BIGINT NOT NULL
		,StageId BIGINT NOT NULL
        ,SportId SMALLINT
		,StageNameCH VARCHAR(100)
        ,StageNameEN VARCHAR(100)
        ,Mode TINYINT
		,GroupCount SMALLINT
        ,RoundCount SMALLINT
		,OrderIndex INT
		,IsDeleted BIT
		,UpdatedAt DATETIME DEFAULT NULL
        ,PRIMARY KEY (SeasonId, StageId));
    
	INSERT INTO tmp_Stage(SeasonId
		,StageId
        ,SportId
		,StageNameCH
        ,StageNameEN
        ,Mode
		,GroupCount
        ,RoundCount
		,OrderIndex
		,IsDeleted
		,UpdatedAt)
    SELECT IFNULL(SeasonId, 0)
		,StageId
        ,SportId
		,NULLIF(StageNameCH, 'NULL')
        ,NULLIF(StageNameEN, 'NULL')
        ,Mode
		,GroupCount
        ,RoundCount
		,OrderIndex
		,IsDeleted
		,UpdatedAt
    FROM 
		JSON_TABLE
        (
			stageListJson,
            "$[*]"
            COLUMNS
            (
				SeasonId BIGINT PATH "$.SeasonId"
				,StageId BIGINT PATH "$.StageId"
				,SportId SMALLINT PATH "$.SportId"
				,StageNameCH VARCHAR(100) PATH "$.StageName"
				,StageNameEN VARCHAR(100) PATH "$.StageNameEN"
				,Mode TINYINT PATH "$.Mode"
				,GroupCount SMALLINT PATH "$.GroupCount"
				,RoundCount SMALLINT PATH "$.RoundCount"
				,OrderIndex INT PATH "$.OrderIndex"
				,IsDeleted BIT PATH "$.IsDelete"
				,UpdatedAt DATETIME PATH "$.UpdatedAt"
            )
        ) AS t;

	INSERT INTO livescore_season_stage(SeasonId
		,StageId
        ,SportId
		,StageNameCH
        ,StageNameEN
        ,Mode
		,GroupCount
        ,RoundCount
		,OrderIndex
		,IsDeleted
		,UpdatedAt
		,SyncedDate)
	SELECT SeasonId
		,StageId
        ,SportId
		,StageNameCH
        ,StageNameEN
        ,Mode
		,GroupCount
        ,RoundCount
		,OrderIndex
		,IsDeleted
		,UpdatedAt
		,NOW()
	FROM tmp_Stage s
	ON DUPLICATE KEY UPDATE
        SportId = s.SportId
		,StageNameCH = s.StageNameCH
        ,StageNameEN = s.StageNameEN
        ,Mode = s.Mode
		,GroupCount = s.GroupCount
        ,RoundCount = s.RoundCount
		,OrderIndex = s.OrderIndex
		,IsDeleted = s.IsDeleted
		,UpdatedAt = s.UpdatedAt
		,SyncedDate = NOW();
END

//
DELIMITER ;
GRANT EXECUTE ON PROCEDURE Livescore_Sync_Stage_Import TO 'sabasports'@'%';
