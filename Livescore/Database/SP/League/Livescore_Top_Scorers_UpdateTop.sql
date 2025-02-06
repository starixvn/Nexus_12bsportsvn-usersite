/*<info serverAlias="SSMS-sabasports" databaseType="2" executers="sabasports" isFunction="0" isNested="0"></info>*/
DROP PROCEDURE IF EXISTS Livescore_Top_Scorers_UpdateTop;
DELIMITER //
CREATE DEFINER=`sabasports`@`%` PROCEDURE `Livescore_Top_Scorers_UpdateTop`(
    IN Top INT,
    IN RowNum INT,
    IN TopUpdate INT,
    IN IsCheck BOOL,
    OUT ErrCode SMALLINT,
    OUT ErrMsg VARCHAR(100) 
	/*
		Creator: Brian@20220809
        Revisions:
			- 20220809@Brian: init
    */
)
BEGIN
	DECLARE _RowNum BIGINT;
	DROP TEMPORARY TABLE IF EXISTS tmp_topScorers;
    CREATE TEMPORARY TABLE IF NOT EXISTS tmp_topScorers(RowNum INT PRIMARY KEY NOT NULL AUTO_INCREMENT, Top INT);
    
    INSERT INTO tmp_topScorers(RowNum, Top)
		SELECT t.RowNum, t.Top
		FROM `livescore_top_scorers` AS t WHERE t.Top >= Top AND t.RowNum != RowNum;	
    WHILE (EXISTS (SELECT 1 FROM tmp_topScorers)) DO
		SET _RowNum = (SELECT tmp.RowNum
        FROM tmp_topScorers AS tmp ORDER BY tmp.Top LIMIT 1);
        IF(IsCheck) THEN			
			UPDATE `livescore_top_scorers` AS le
			SET le.Top = Top
			WHERE le.RowNum = _RowNum;
        END IF;
        IF(!IsCheck) THEN			
			UPDATE `livescore_top_scorers` AS le
			SET le.Top = Top + 1
			WHERE le.RowNum = _RowNum;
        END IF;
        SET Top = Top + 1;
		IF(IsCheck AND Top = TopUpdate) THEN			
			SET Top = Top + 1;
        END IF;        
        DELETE FROM tmp_topScorers AS tp WHERE tp.RowNum = _RowNum;
    END WHILE;
END
//
DELIMITER ;