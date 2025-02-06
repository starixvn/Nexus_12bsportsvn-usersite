/*<info serverAlias="SSMS-sabasports" databaseType="2" executers="sabasports" isFunction="0" isNested="0"></info>*/
DROP PROCEDURE IF EXISTS Livescore_League_GetLeagueById;

DELIMITER //
CREATE DEFINER=`sabasports`@`%` PROCEDURE `Livescore_League_GetLeagueById`(
	In LeagueId LONG
	/*
		Creator: Brian@20220729
        Revisions:
			- 20220729@Brian: init
            - 20220831@Hank: add current stage field
            - 20221227@Brian: add select IconVN
            - 20340721@Hank: Add Season Year
    */
)
BEGIN
	SELECT l.LeagueId, l.LeagueNameVN, l.LeagueNameEN, l.LeagueFullNameEN, l.LeagueType, l.Icon, l.IconVN
    , l.CurrentSeasonId, s.Year, l.Country as CountryEN, l.CountryVN, l.CurrentStageId, c.CountryLogo
	FROM livescore_league l 
	LEFT JOIN livescore_season s ON s.SeasonId = l.CurrentSeasonId
    LEFT JOIN livescore_country c ON c.CountryId = l.CountryId
	Where l.LeagueId = LeagueId;
END
//
DELIMITER ;