/*<info serverAlias="SSMS-sabasports" databaseType="2" executers="sabasports" isFunction="0" isNested="0"></info>*/
DROP PROCEDURE IF EXISTS Livescore_League_GetSeasonStanding_Detail;
DELIMITER //

CREATE DEFINER=`sabasports`@`%` PROCEDURE `Livescore_League_GetSeasonStanding_Detail`(
    IN seasonId BIGINT
    ,IN stageId BIGINT
    ,IN teamId BIGINT
    /*
		Creator: Hank@20220811
        Revisions:
			- 20220811@Hank: init
    */
)
BEGIN
	
    SELECT t.TeamId, t.TeamNameVN, t.TeamNameEN, t.TeamFullNameEN, t.Icon, t.IconVN 
		,s.GroupName, se.GroupName as GroupNameCustom, s.Total, se.Total as TotalCustom, se.Won as WonCustom, s.Won
        ,s.Loss, se.Loss as LossCustom, s.Draw, se.Draw as DrawCustom, s.Points, se.Points as PointsCustom, s.Goals, se.Goals as GoalsCustom
        , s.GoalsAgainst, se.GoalsAgainst as GoalsAgainstCustom,  s.GoalDiff, se.GoalDiff as GoalDiffCustom
        ,(IFNULL(se.Position, s.Position)) as Position, s.Promotion
		,s.StageId, ss.StageNameEN, rr.NameVN AS StageNameVN, ss.OrderIndex
    FROM livescore_season_standings s
		INNER JOIN livescore_team t ON s.TeamId = t.TeamId
        INNER JOIN livescore_season_stage ss ON s.StageId = ss.StageId
        LEFT JOIN livescore_ref_resource rr ON rr.RefName = 'Stage' AND ss.StageNameEN = rr.NameEN
        LEFT JOIN livescore_season_standings_extra se ON se.SeasonId = s.SeasonId AND se.StageId = s.StageId AND se.TeamId = s.TeamId
    WHERE s.SeasonId = seasonId AND s.StageId = stageId AND s.TeamId = teamId;
END

//
DELIMITER ;	