/*<info serverAlias="SSMS-sabasports" databaseType="2" executers="sabasports" isFunction="0" isNested="0"></info>*/
DROP PROCEDURE IF EXISTS Livescore_League_GetByIds;

DELIMITER //
CREATE DEFINER=`sabasports`@`%` PROCEDURE `Livescore_League_GetByIds`(
	IN leagueIds JSON
    /*
		Creator: Hank@20220520
        Revisions:
			- 20220520@Hank: init
            - 20220712@Hank: get only major league
			- 20220808@Brian: get a few columns
            - 20221227@Brian: add select IconVN
    */
)
BEGIN
	DROP TEMPORARY TABLE IF EXISTS tmp_ids;
    CREATE TEMPORARY TABLE IF NOT EXISTS tmp_ids(LeagueId BIGINT NOT NULL);
	
	INSERT INTO tmp_ids(LeagueId)
    SELECT LeagueId
    FROM 
		JSON_TABLE
        (
			leagueIds,
            "$[*]"
            COLUMNS
            (
				LeagueId BIGINT  PATH "$"
            )
        ) AS t; 
	
        
	SELECT l.LeagueId, l.CountryIconVN, l.LeagueNameVN, l.LeagueNameEN, l.LeagueFullNameEN, l.LeagueType, l.Icon, l.IconVN, l.CurrentSeasonId, l.Country as CountryEN, l.CountryVN, e.IsMajor, e.Priority, c.CountryLogo
	FROM livescore_league l
	INNER JOIN livescore_league_extra e ON l.LeagueId = e.LeagueId
    LEFT JOIN livescore_country c ON c.CountryId = l.CountryId
	WHERE EXISTS (SELECT tmp.LeagueId FROM tmp_ids tmp WHERE l.LeagueId = tmp.LeagueId);
END

//
DELIMITER ;	