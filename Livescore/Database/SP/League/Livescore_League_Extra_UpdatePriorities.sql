/*<info serverAlias="SSMS-sabasports" databaseType="2" executers="sabasports" isFunction="0" isNested="0"></info>*/
DROP PROCEDURE IF EXISTS Livescore_League_Extra_UpdatePriorities;
DELIMITER //
CREATE DEFINER=`sabasports`@`%` PROCEDURE `Livescore_League_Extra_UpdatePriorities`(
	/*
		Creator: Brian@20220808
        Revisions:
			- 20220808@Brian: init
    */
    IN Priority INT,
    IN LeagueIdUpdate LONG,
    IN PriorityUpdate INT,
    IN IsDelete BOOL,
    IN IsCheck BOOL,
    OUT ErrCode SMALLINT,
    OUT ErrMsg VARCHAR(100) 
)
BEGIN
	DECLARE _leagueId BIGINT;
	DROP TEMPORARY TABLE IF EXISTS tmp_LeagueExtra;
    CREATE TEMPORARY TABLE IF NOT EXISTS tmp_LeagueExtra(LeagueId BIGINT PRIMARY KEY NOT NULL, Priority INT);
    
    INSERT INTO tmp_LeagueExtra(LeagueId, Priority) 
		SELECT leEX.LeagueId, leEX.Priority
		FROM `livescore_league_extra` AS leEX WHERE leEX.Priority >= Priority AND leEX.LeagueId != LeagueIdUpdate;
    WHILE (EXISTS (SELECT 1 FROM tmp_LeagueExtra)) DO
		SET _leagueId = (SELECT tmp.leagueid
        FROM tmp_LeagueExtra AS tmp ORDER BY tmp.Priority LIMIT 1);
        IF(IsDelete) THEN			
			UPDATE `livescore_league_extra` AS le
			SET le.Priority = Priority
			WHERE le.leagueId = _leagueId;
        END IF;
        IF(!IsDelete) THEN			
			UPDATE `livescore_league_extra` AS le
			SET le.Priority = Priority + 1
			WHERE le.leagueId = _leagueId;
        END IF;
        SET Priority = Priority + 1;
		IF(IsCheck AND Priority = PriorityUpdate) THEN			
			SET Priority = Priority + 1;
        END IF;        
        DELETE FROM tmp_LeagueExtra WHERE leagueId = _leagueId;
    END WHILE;
END
//
DELIMITER ;
