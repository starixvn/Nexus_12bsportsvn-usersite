/*<info serverAlias="SSMS-sabasports" databaseType="2" executers="sabasports" isFunction="0" isNested="0"></info>*/
DROP PROCEDURE IF EXISTS Livescore_Sync_LeagueSeason_Import;
DELIMITER //
CREATE DEFINER=`sabasports`@`%` PROCEDURE `Livescore_Sync_LeagueSeason_Import`(
	IN leagueListJson JSON
    ,OUT errCode SMALLINT
    ,OUT errMsg VARCHAR(100)
    /*
		Creator: Hank@20230921
		Param: - matchScoreJson: [{
									\"LeagueId\":12052,
									\"CurSeasonId\":9535,
                                    \"Seasons\":{\"2957\":\"2007\",\"2958\":\"2011\",\"2959\":\"2015\",\"4899\":\"2016\",\"8847\":\"2019\",\"9535\":\"2021\"}},{\"LeagueId\":12297,\"CurSeasonId\":11462,\"Seasons\":{\"5994\":\"2016\",\"6815\":\"2017\",\"10572\":\"2021-2022\",\"10746\":\"2021-2022\",\"11462\":\"2023\"}},{\"LeagueId\":12944,\"CurSeasonId\":10609,\"Seasons\":{\"215\":\"2005\",\"216\":\"2007-2008\",\"217\":\"2009\",\"218\":\"2011-2012\",\"219\":\"2013\",\"220\":\"2015-2016\",\"5583\":\"2017\",\"9264\":\"2019-2021\",\"10609\":\"2022\"}
								},
								{
                                    \"LeagueId\":12992,
                                    \"CurSeasonId\":10801,
                                    \"Seasons\":{\"5423\":\"2015\",\"5424\":\"2013\",\"5425\":\"2012\",\"5426\":\"2010\",\"5427\":\"2008\",\"5428\":\"2006\",\"5429\":\"2004\",\"5566\":\"2017\",\"6688\":\"2019\",\"9333\":\"2022\",\"10593\":\"2019-2022\",\"10801\":\"2022-2024\"}
								}]
        Revisions: - 20230921@Hank: init
    */
)
BEGIN
    SET errCode=0, errMsg='';
    
    DROP TEMPORARY TABLE IF EXISTS tmp_LeagueSeason;
    CREATE TEMPORARY TABLE IF NOT EXISTS tmp_LeagueSeason(LeagueId BIGINT PRIMARY KEY NOT NULL
        ,CurrentSeasonId BIGINT
        ,Seasons JSON);
    
	INSERT INTO tmp_LeagueSeason(LeagueId
        ,CurrentSeasonId
        ,Seasons)
    SELECT LeagueId
        ,CurrentSeasonId
        ,CASE WHEN Seasons = CAST('null' AS JSON) THEN NULL ELSE Seasons END
    FROM 
		JSON_TABLE
        (
			leagueListJson,
            "$[*]"
            COLUMNS
            (
                LeagueId BIGINT PATH "$.LeagueId"
				,CurrentSeasonId BIGINT PATH "$.CurSeasonId"
				,Seasons JSON PATH "$.Seasons"
            )
        ) AS l;
        
	UPDATE livescore_league l
    INNER JOIN tmp_LeagueSeason tmp ON tmp.LeagueId = l.LeagueId
    SET l.CurrentSeasonId = tmp.CurrentSeasonId,
		l.Seasons = tmp.Seasons;
        
	DROP TEMPORARY TABLE IF EXISTS tmp_LeagueSeason;
END

//
DELIMITER ;
