DROP PROCEDURE IF EXISTS Livescore_Sync_SeasonStandings_Import;
DELIMITER //

CREATE DEFINER=`sabasports`@`%` PROCEDURE `Livescore_Sync_SeasonStandings_Import`(
	IN seasonId BIGINT
    ,IN seasonStandingsJson JSON
    ,OUT errCode SMALLINT
    ,OUT errMsg VARCHAR(100)
    /*
		Creator: Tim@20220329
        Revisions: - 202203259@Tim: init
    */
)
BEGIN
    SET errCode=0, errMsg='';
    
    DROP TEMPORARY TABLE IF EXISTS tmp_SeasonStandings;
    CREATE TEMPORARY TABLE IF NOT EXISTS tmp_SeasonStandings(SeasonId BIGINT NOT NULL
		,StageId BIGINT NOT NULL
		,TeamId BIGINT NOT NULL
		,GroupName VARCHAR(255)
        ,Conference VARCHAR(255)
		,Position SMALLINT
		,PositionHome SMALLINT
		,PositionAway SMALLINT
		,Total SMALLINT
		,TotalHome SMALLINT
		,TotalAway SMALLINT
		,Won SMALLINT
		,WonHome SMALLINT
		,WonAway SMALLINT
		,Loss SMALLINT
		,LossHome SMALLINT
		,LossAway SMALLINT
		,Draw SMALLINT
		,DrawHome SMALLINT
		,DrawAway SMALLINT
		,PromotionId INT
        ,Promotion JSON
		,Points SMALLINT
		,PointsHome SMALLINT
		,PointsAway SMALLINT
		,DeductPoints SMALLINT
		,Goals SMALLINT
		,GoalsHome SMALLINT
		,GoalsAway SMALLINT
		,GoalsAgainst SMALLINT
		,GoalsAgainstHome SMALLINT
		,GoalsAgainstAway SMALLINT
		,GoalDiff SMALLINT
		,GoalDiffHome SMALLINT
		,GoalDiffAway SMALLINT
		,UpdatedAt DATETIME);
    
	INSERT INTO tmp_SeasonStandings(SeasonId
		,StageId
		,TeamId
		,GroupName
        ,Conference
		,Position
		,PositionHome
		,PositionAway
		,Total
		,TotalHome
		,TotalAway
		,Won
		,WonHome
		,WonAway
		,Loss
		,LossHome
		,LossAway
		,Draw
		,DrawHome
		,DrawAway
        ,PromotionId
		,Promotion
		,Points
		,PointsHome
		,PointsAway
		,DeductPoints
		,Goals
		,GoalsHome
		,GoalsAway
		,GoalsAgainst
		,GoalsAgainstHome
		,GoalsAgainstAway
		,GoalDiff
		,GoalDiffHome
		,GoalDiffAway
		,UpdatedAt)
    SELECT seasonId
		,StageId
		,TeamId
		,NULLIF(GroupName, 'null')
        ,NULLIF(Conference, 'null')
		,Position
		,PositionHome
		,PositionAway
		,Total
		,TotalHome
		,TotalAway
		,Won
		,WonHome
		,WonAway
		,Loss
		,LossHome
		,LossAway
		,Draw
		,DrawHome
		,DrawAway
        ,PromotionId
		,CASE WHEN Promotion = CAST('null' AS JSON) THEN NULL ELSE Promotion END
		,Points
		,PointsHome
		,PointsAway
		,DeductPoints
		,Goals
		,GoalsHome
		,GoalsAway
		,GoalsAgainst
		,GoalsAgainstHome
		,GoalsAgainstAway
		,GoalDiff
		,GoalDiffHome
		,GoalDiffAway
		,UpdatedAt
    FROM 
		JSON_TABLE
        (
			seasonStandingsJson,
            "$[*]"
            COLUMNS
            (
				StageId BIGINT PATH "$.StageId"
				,TeamId BIGINT PATH "$.TeamId"
				,GroupName VARCHAR(255) PATH "$.GroupName"
                ,Conference VARCHAR(255) PATH "$.Conference"
				,Position SMALLINT PATH "$.Position"
				,PositionHome SMALLINT PATH "$.PositionHome"
				,PositionAway SMALLINT PATH "$.PositionAway"
				,Total SMALLINT PATH "$.Total"
				,TotalHome SMALLINT PATH "$.TotalHome"
				,TotalAway SMALLINT PATH "$.TotalAway"
				,Won SMALLINT PATH "$.Won"
				,WonHome SMALLINT PATH "$.WonHome"
				,WonAway SMALLINT PATH "$.WonAway"
				,Loss SMALLINT PATH "$.Loss"
				,LossHome SMALLINT PATH "$.LossHome"
				,LossAway SMALLINT PATH "$.LossAway"
				,Draw SMALLINT PATH "$.Draw"
				,DrawHome SMALLINT PATH "$.DrawHome"
				,DrawAway SMALLINT PATH "$.DrawAway"
				,PromotionId INT PATH "$.PromotionId"
                ,Promotion JSON PATH "$.Promotion"
				,Points SMALLINT PATH "$.Points"
				,PointsHome SMALLINT PATH "$.PointsHome"
				,PointsAway SMALLINT PATH "$.PointsAway"
				,DeductPoints SMALLINT PATH "$.DeductPoints"
				,Goals SMALLINT PATH "$.Goals"
				,GoalsHome SMALLINT PATH "$.GoalsHome"
				,GoalsAway SMALLINT PATH "$.GoalsAway"
				,GoalsAgainst SMALLINT PATH "$.GoalsAgainst"
				,GoalsAgainstHome SMALLINT PATH "$.GoalsAgainstHome"
				,GoalsAgainstAway SMALLINT PATH "$.GoalsAgainstAway"
				,GoalDiff SMALLINT PATH "$.GoalDiff"
				,GoalDiffHome SMALLINT PATH "$.GoalDiffHome"
				,GoalDiffAway SMALLINT PATH "$.GoalDiffAway"
				,UpdatedAt DATETIME PATH "$.UpdatedAt"
            )
        ) AS ss;
	
    DELETE
    FROM livescore_season_standings ss
    WHERE ss.SeasonId = seasonId;

	INSERT INTO livescore_season_standings(SeasonId
		,StageId
		,TeamId
		,GroupName
        ,Conference
		,Position
		,PositionHome
		,PositionAway
        ,Total
		,TotalHome
		,TotalAway
		,Won
		,WonHome
		,WonAway
		,Loss
		,LossHome
		,LossAway
		,Draw
		,DrawHome
		,DrawAway
        ,PromotionId
		,Promotion
		,Points
		,PointsHome
		,PointsAway
		,DeductPoints
		,Goals
		,GoalsHome
		,GoalsAway
		,GoalsAgainst
		,GoalsAgainstHome
		,GoalsAgainstAway
		,GoalDiff
		,GoalDiffHome
		,GoalDiffAway
		,UpdatedAt
		,SyncedDate)
	SELECT SeasonId
		,StageId
		,TeamId
		,GroupName
        ,Conference
		,Position
		,PositionHome
		,PositionAway
        ,Total
		,TotalHome
		,TotalAway
		,Won
		,WonHome
		,WonAway
		,Loss
		,LossHome
		,LossAway
		,Draw
		,DrawHome
		,DrawAway
        ,PromotionId
		,Promotion
		,Points
		,PointsHome
		,PointsAway
		,DeductPoints
		,Goals
		,GoalsHome
		,GoalsAway
		,GoalsAgainst
		,GoalsAgainstHome
		,GoalsAgainstAway
		,GoalDiff
		,GoalDiffHome
		,GoalDiffAway
		,UpdatedAt
		,NOW()
	FROM tmp_SeasonStandings ss
	ON DUPLICATE KEY UPDATE
		GroupName = ss.GroupName
		,Conference = ss.Conference
		,Position = ss.Position
		,PositionHome = ss.PositionHome
		,PositionAway = ss.PositionAway
		,Total = ss.Total
		,TotalHome = ss.TotalHome
		,TotalAway = ss.TotalAway
		,Won = ss.Won
		,WonHome = ss.WonHome
		,WonAway = ss.WonAway
		,Loss = ss.Loss
		,LossHome = ss.LossHome
		,LossAway = ss.LossAway
		,Draw = ss.Draw
		,DrawHome = ss.DrawHome
		,DrawAway = ss.DrawAway
		,PromotionId = ss.PromotionId
		,Promotion = ss.Promotion
		,Points = ss.Points
		,PointsHome = ss.PointsHome
		,PointsAway = ss.PointsAway
		,DeductPoints = ss.DeductPoints
		,Goals = ss.Goals
		,GoalsHome = ss.GoalsHome
		,GoalsAway = ss.GoalsAway
		,GoalsAgainst = ss.GoalsAgainst
		,GoalsAgainstHome = ss.GoalsAgainstHome
		,GoalsAgainstAway = ss.GoalsAgainstAway
		,GoalDiff = ss.GoalDiff
		,GoalDiffHome = ss.GoalDiffHome
		,GoalDiffAway = ss.GoalDiffAway
		,UpdatedAt = ss.UpdatedAt
		,SyncedDate = NOW();
END;

//
DELIMITER;
GRANT EXECUTE ON PROCEDURE Livescore_Sync_SeasonStandings_Import TO 'sabasports'@'%';