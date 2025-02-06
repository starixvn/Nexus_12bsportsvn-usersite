/*<info serverAlias="SSMS-sabasports" databaseType="2" executers="sabasports" isFunction="0" isNested="0"></info>*/
DROP PROCEDURE IF EXISTS Livescore_Team_GetByStage;
DELIMITER //

CREATE DEFINER=`sabasports`@`%` PROCEDURE `Livescore_Team_GetByStage`(
    IN seasonId BIGINT
    ,IN stageId BIGINT
    /*
		Creator: Hank@20240503
        Revisions:
			- 20240503@Hank: init
    */
)
BEGIN
    SELECT t.TeamId, t.TeamNameVN, t.TeamNameEN, t.TeamFullNameEN, t.Icon, t.IconVN
		,s.StageId, ss.StageNameEN, rr.NameVN AS StageNameVN, ss.OrderIndex
    FROM livescore_season_standings s
		INNER JOIN livescore_team t ON s.TeamId = t.TeamId
        INNER JOIN livescore_season_stage ss ON s.StageId = ss.StageId AND s.SeasonId = ss.SeasonId
        LEFT JOIN livescore_ref_resource rr ON rr.RefName = 'Stage' AND ss.StageNameEN = rr.NameEN
    WHERE s.SeasonId = seasonId AND s.StageId = stageId
    ORDER BY CASE WHEN t.TeamNameVN IS NOT NULL THEN t.TeamNameVN
			WHEN t.TeamNameEN IS NOT NULL THEN t.TeamNameEN
			ELSE t.TeamFullNameEN END ASC;
END
//
DELIMITER ;	