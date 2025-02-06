/*<info serverAlias="SSMS-sabasports" databaseType="2" executers="sabasports" isFunction="0" isNested="0"></info>*/
DROP PROCEDURE IF EXISTS Livescore_Top_Scorers_Insert;
DELIMITER //
CREATE DEFINER=`sabasports`@`%` PROCEDURE `Livescore_Top_Scorers_Insert`(
	/*
		Creator: Brian@20220809
        Revisions:
			- 20220809@Brian: init
    */
	IN PlayerId LONG,
    IN SeasonId LONG, 
    IN LeagueId LONG,
    IN TeamId LONG,
    IN Goals INT,
    IN Assists INT,
	IN Top INT,
    OUT ErrCode SMALLINT,
    OUT ErrMsg VARCHAR(100)
)
BEGIN
	INSERT INTO `livescore_top_scorers`
		(`PlayerId`, `SeasonId`, `LeagueId`, `TeamId`, `Goals`, `Assists`, `Top`)
		VALUES
		(PlayerId, SeasonId, LeagueId, TeamId, Goals, Assists, Top);
END

//
DELIMITER ;