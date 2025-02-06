/*<info serverAlias="SSMS-sabasports" databaseType="2" executers="sabasports" isFunction="0" isNested="0"></info>*/
DROP PROCEDURE IF EXISTS Livescore_League_Update;
DELIMITER //
CREATE DEFINER=`sabasports`@`%` PROCEDURE `Livescore_League_Update`(
	/*
		Creator: Brian@20220808
        Revisions:
			- 20220808@Brian: init
            - 20221227@Brian: add update IconVN
    */
    IN CountryVN VARCHAR(255),
    IN LeagueNameVN VARCHAR(255), 
    IN LeagueId LONG,
    IN CountryIconVN VARCHAR(255), 
    IN IconVN VARCHAR(255), 
    OUT ErrCode SMALLINT,
    OUT ErrMsg VARCHAR(100)    
)
BEGIN
	UPDATE `livescore_league` as le
	SET
	`CountryVN` = CountryVN,
    `LeagueNameVN` = LeagueNameVN,
	`CountryIconVN` = CountryIconVN,
    `IconVN` = IconVN
	WHERE le.LeagueId = LeagueId;
END

//
DELIMITER ;