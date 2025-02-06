/*<info serverAlias="SSMS-sabasports" databaseType="2" executers="sabasports" isFunction="0" isNested="0"></info>*/
DROP PROCEDURE IF EXISTS Livescore_Standing_UpdatePosition;
DELIMITER //

CREATE DEFINER=`sabasports`@`%` PROCEDURE `Livescore_Standing_UpdatePosition`(
	IN seasonId INT,
    IN stageId INT,
    IN teamId INT,
    IN position INT,
    IN oldGroupName VARCHAR(255),
    OUT ErrCode SMALLINT,
    OUT ErrMsg VARCHAR(100) 
	/*
		Creator: Hank@20220912
        Revisions:
			- 20220912@Hank: init
    */
)
BEGIN
	DECLARE currentGroupName VARCHAR(255);
    DECLARE tmpSeasonId BIGINT;
    DECLARE tmpStageId BIGINT;
    DECLARE tmpTeamId BIGINT;
    DECLARE currentPosition SMALLINT;
    SET currentPosition = 0;
	DROP TEMPORARY TABLE IF EXISTS tmp_standingExtra;
    CREATE TEMPORARY TABLE IF NOT EXISTS tmp_standingExtra(
		SeasonId BIGINT NOT NULL, 
		StageId  BIGINT NOT NULL,
		TeamId BIGINT NOT NULL, 
		Position SMALLINT);
	
    SELECT COALESCE(se.GroupName, ss.GroupName) INTO currentGroupName
    FROM livescore_season_standings ss 
    LEFT JOIN livescore_season_standings_extra se ON se.SeasonId = ss.SeasonId AND se.StageId = ss.StageId AND se.TeamId = ss.TeamId
    WHERE ss.SeasonId = seasonId AND ss.StageId = stageId AND ss.TeamId = teamId;
    
    
    INSERT INTO tmp_standingExtra(SeasonId, StageId, TeamId, Position)
	SELECT seasonId, stageId, ss.TeamId, COALESCE(se.Position, ss.Position) as PositionTmp
    FROM livescore_season_standings ss
    LEFT JOIN livescore_season_standings_extra se ON se.SeasonId = ss.SeasonId AND se.StageId = ss.StageId AND se.TeamId = ss.TeamId
    WHERE ss.SeasonId = seasonId 
		AND ss.StageId = stageId 
        AND ss.TeamId != teamId
        AND ((se.GroupName is null AND ss.GroupName = currentGroupName) OR (se.GroupName is not null AND se.GroupName = currentGroupName))
	ORDER BY PositionTmp ASC;
    
	SET currentPosition = 0;
    
    
    WHILE (EXISTS (SELECT 1 FROM tmp_standingExtra)) DO
		SELECT ss.SeasonId, ss.StageId, ss.TeamId INTO tmpSeasonId, tmpStageId, tmpTeamId
		FROM tmp_standingExtra ss LIMIT 1;
		
        SET currentPosition = currentPosition + 1;
        IF currentPosition = position THEN
			SET currentPosition = currentPosition + 1;
		END IF;
        
        INSERT INTO `livescore_season_standings_extra`
		(`SeasonId`,
		`StageId`,
		`TeamId`,
		`Position`,
		`UpdatedDate`)
		VALUES
		(tmpSeasonId,
		tmpStageId,
		tmpTeamId,
		currentPosition,
		now())
        ON DUPLICATE KEY UPDATE Position=currentPosition;
		
        DELETE FROM tmp_standingExtra as tp WHERE tp.SeasonId = tmpSeasonId AND tp.StageId = tmpStageId AND tp.TeamId = tmpTeamId;
    END WHILE;
    
    INSERT INTO `livescore_season_standings_extra`
		(`SeasonId`,
		`StageId`,
		`TeamId`,
		`Position`,
		`UpdatedDate`)
		VALUES
		(seasonId,
		stageId,
		teamId,
		position,
		now())
        ON DUPLICATE KEY UPDATE Position = position;
        
	IF oldGroupName != currentGroupName THEN
		TRUNCATE tmp_standingExtra;
		INSERT INTO tmp_standingExtra(SeasonId, StageId, TeamId, Position)
		SELECT seasonId, stageId, ss.TeamId, COALESCE(se.Position, ss.Position) as PositionTmp
		FROM livescore_season_standings ss
		LEFT JOIN livescore_season_standings_extra se ON se.SeasonId = ss.SeasonId AND se.StageId = ss.StageId AND se.TeamId = ss.TeamId
		WHERE ss.SeasonId = seasonId 
			AND ss.StageId = stageId 
			AND ss.TeamId != teamId
			AND ((se.GroupName is null AND ss.GroupName = oldGroupName) OR (se.GroupName is not null AND se.GroupName = oldGroupName))
		ORDER BY PositionTmp ASC;
        
        SET currentPosition = 0;
        
        WHILE (EXISTS (SELECT 1 FROM tmp_standingExtra)) DO
			SELECT ss.SeasonId, ss.StageId, ss.TeamId INTO tmpSeasonId, tmpStageId, tmpTeamId
			FROM tmp_standingExtra ss LIMIT 1;
			
			SET currentPosition = currentPosition + 1;
			
			INSERT INTO `livescore_season_standings_extra`
			(`SeasonId`,
			`StageId`,
			`TeamId`,
			`Position`,
			`UpdatedDate`)
			VALUES
			(tmpSeasonId,
			tmpStageId,
			tmpTeamId,
			currentPosition,
			now())
			ON DUPLICATE KEY UPDATE Position=currentPosition;
			
			DELETE FROM tmp_standingExtra as tp WHERE tp.SeasonId = tmpSeasonId AND tp.StageId = tmpStageId AND tp.TeamId = tmpTeamId;
		END WHILE;
    END IF;
    
    
    
END

//
DELIMITER ;	