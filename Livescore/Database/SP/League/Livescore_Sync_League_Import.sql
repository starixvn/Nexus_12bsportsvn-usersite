DROP PROCEDURE IF EXISTS Livescore_Sync_League_Import;
DELIMITER //
CREATE DEFINER=`sabasports`@`%` PROCEDURE `Livescore_Sync_League_Import`(
	IN leagueListJson JSON
    ,OUT errCode SMALLINT
    ,OUT errMsg VARCHAR(100)
    /*
		Creator: Tim@20220325
        Revisions: - 20220325@Tim: init
    */
)
BEGIN
    SET errCode=0, errMsg='';
    
    DROP TEMPORARY TABLE IF EXISTS tmp_League;
    CREATE TEMPORARY TABLE IF NOT EXISTS tmp_League(LeagueId BIGINT PRIMARY KEY NOT NULL
		,CombinedId BIGINT
		,SportId SMALLINT
        ,LeagueNameEN VARCHAR(255)
		,LeagueFullNameEN VARCHAR(255)
        ,LeagueNameCN VARCHAR(255)
		,LeagueFullNameCN VARCHAR(255)
		,Level INT
		,Icon VARCHAR(255)
		,LeagueType TINYINT
		,CurrentRound SMALLINT
		,RoundCount SMALLINT
		,TitleHolderTeam VARCHAR(255)
		,TitleHolderCount VARCHAR(10)
		,MostTitleTeam VARCHAR(255)
		,MostTitlesCount VARCHAR(10)
		,CategoryId BIGINT
        ,CountryId BIGINT
        ,CurrentSeasonId BIGINT
        ,CurrentStageId BIGINT
        ,CurrentStageNameEN VARCHAR(255)
        ,RuleDescription VARCHAR(255)
        ,Country VARCHAR(100)
        ,City VARCHAR(100)
        ,Seasons JSON
		,HigherLeagueIds JSON
		,LowerLeagueIds JSON
        ,HigherNewcomers JSON
        ,LowerNewcomers JSON
		,UpdatedAt DATETIME DEFAULT NULL);
    
	INSERT INTO tmp_League(LeagueId
		,CombinedId
		,SportId
        ,LeagueNameEN
		,LeagueFullNameEN
        ,LeagueNameCN
		,LeagueFullNameCN
		,Level
		,Icon
		,LeagueType
		,CurrentRound
		,RoundCount
		,TitleHolderTeam
		,TitleHolderCount
		,MostTitleTeam
		,MostTitlesCount
		,CategoryId
        ,CountryId
        ,CurrentSeasonId
        ,CurrentStageId
        ,CurrentStageNameEN
        ,RuleDescription
        ,Country
        ,City
        ,Seasons
		,HigherLeagueIds
		,LowerLeagueIds
        ,HigherNewcomers
        ,LowerNewcomers
		,UpdatedAt)
    SELECT LeagueId
		,CombinedId
		,SportId
        ,NULLIF(LeagueNameEN, 'NULL')
		,NULLIF(LeagueFullNameEN, 'NULL')
        ,NULLIF(LeagueNameCN, 'NULL')
		,NULLIF(LeagueFullNameCN, 'NULL')
		,Level
		,NULLIF(Icon, 'NULL')
		,LeagueType
		,CurrentRound
		,RoundCount
		,NULLIF(TitleHolderTeam, 'NULL')
		,NULLIF(TitleHolderCount, 'NULL')
		,NULLIF(MostTitleTeam, 'NULL')
		,NULLIF(MostTitlesCount, 'NULL')
		,CategoryId
        ,CountryId
        ,CurrentSeasonId
        ,CurrentStageId
        ,NULLIF(CurrentStageNameEN, 'NULL')
        ,NULLIF(RuleDescription, 'NULL')
        ,NULLIF(Country, 'NULL')
        ,NULLIF(City, 'NULL')
        ,NULLIF(Seasons, 'NULL')
		,HigherLeagueIds
		,LowerLeagueIds
        ,NULLIF(HigherNewcomers, 'NULL')
        ,NULLIF(LowerNewcomers, 'NULL')
		,UpdatedAt
    FROM 
		JSON_TABLE
        (
			leagueListJson,
            "$[*]"
            COLUMNS
            (
                LeagueId BIGINT PATH "$.LeagueId"
                ,CombinedId BIGINT PATH "$.CombinedId"
                ,SportId SMALLINT PATH "$.SportId"
                ,LeagueNameEN VARCHAR(255) PATH "$.LeagueNameEN"
				,LeagueFullNameEN VARCHAR(255) PATH "$.LeagueFullNameEN"
                ,LeagueNameCN VARCHAR(255) PATH "$.LeagueName"
				,LeagueFullNameCN VARCHAR(255) PATH "$.LeagueFullName"
				,Level INT PATH "$.Level"
				,Icon VARCHAR(255) PATH "$.Icon"
				,LeagueType TINYINT PATH "$.LeagueType"
				,CurrentRound SMALLINT PATH "$.CurrentRound"
				,RoundCount SMALLINT PATH "$.RoundCount"
				,TitleHolderTeam VARCHAR(255) PATH "$.TitleHolderTeam"
				,TitleHolderCount VARCHAR(10) PATH "$.TitleHolderCount"
				,MostTitleTeam VARCHAR(255) PATH "$.MostTitleTeam"
				,MostTitlesCount VARCHAR(10) PATH "$.MostTitlesCount"
				,CategoryId BIGINT PATH "$.CategoryId"
				,CountryId BIGINT PATH "$.CountryId"
				,CurrentSeasonId BIGINT PATH "$.CurSeasonId"
				,CurrentStageId BIGINT PATH "$.CurStageId"
				,CurrentStageNameEN VARCHAR(255) PATH "$.CurStageNameEN"
				,RuleDescription VARCHAR(255) PATH "$.Ruledesc"
				,Country VARCHAR(100) PATH "$.Country"
				,City VARCHAR(100) PATH "$.City"
				,Seasons JSON PATH "$.Seasons"
				,HigherLeagueIds JSON PATH "$.HigherLeagueIds"
				,LowerLeagueIds JSON PATH "$.LowerLeagueIds"
				,HigherNewcomers JSON PATH "$.HigherNewcomers"
				,LowerNewcomers JSON PATH "$.LowerNewcomers"
				,UpdatedAt DATETIME PATH "$.UpdatedAt"
            )
        ) AS l;

        INSERT INTO livescore_league(LeagueId
			,CombinedId
			,SportId
			,LeagueNameEN
			,LeagueFullNameEN
			,LeagueNameCN
			,LeagueFullNameCN
			,Level
			,Icon
			,LeagueType
			,CurrentRound
			,RoundCount
			,TitleHolderTeam
			,TitleHolderCount
			,MostTitleTeam
			,MostTitlesCount
			,CategoryId
			,CountryId
			,CurrentSeasonId
			,CurrentStageId
			,CurrentStageNameEN
			,RuleDescription
			,Country
			,City
			,Seasons
			,HigherLeagueIds
			,LowerLeagueIds
			,HigherNewcomers
			,LowerNewcomers
			,UpdatedAt
			,SyncedDate)
		SELECT LeagueId
			,CombinedId
			,SportId
			,LeagueNameEN
			,LeagueFullNameEN
			,LeagueNameCN
			,LeagueFullNameCN
			,Level
			,Icon
			,LeagueType
			,CurrentRound
			,RoundCount
			,TitleHolderTeam
			,TitleHolderCount
			,MostTitleTeam
			,MostTitlesCount
			,CategoryId
			,CountryId
			,CurrentSeasonId
			,CurrentStageId
			,CurrentStageNameEN
			,RuleDescription
			,Country
			,City
			,Seasons
			,HigherLeagueIds
			,LowerLeagueIds
			,HigherNewcomers
			,LowerNewcomers
			,UpdatedAt
			,NOW()
        FROM tmp_League l
        ON DUPLICATE KEY UPDATE
            CombinedId = l.CombinedId
			,SportId = l.SportId
			,LeagueNameEN = l.LeagueNameEN
			,LeagueFullNameEN = l.LeagueFullNameEN
			,LeagueNameCN = l.LeagueNameCN
			,LeagueFullNameCN = l.LeagueFullNameCN
			,Level = l.Level
			,Icon = l.Icon
			,LeagueType = l.LeagueType
			,CurrentRound = l.CurrentRound
			,RoundCount = l.RoundCount
			,TitleHolderTeam = l.TitleHolderTeam
			,TitleHolderCount = l.TitleHolderCount
			,MostTitleTeam = l.MostTitleTeam
			,MostTitlesCount = l.MostTitlesCount
			,CategoryId = l.CategoryId
			,CountryId = l.CountryId
			,CurrentSeasonId = l.CurrentSeasonId
			,CurrentStageId = l.CurrentStageId
			,CurrentStageNameEN = l.CurrentStageNameEN
			,RuleDescription = l.RuleDescription
			,Country = l.Country
			,City = l.City
			,Seasons = l.Seasons
			,HigherLeagueIds = l.HigherLeagueIds
			,LowerLeagueIds = l.LowerLeagueIds
			,HigherNewcomers = l.HigherNewcomers
			,LowerNewcomers = l.LowerNewcomers
			,UpdatedAt = l.UpdatedAt
            ,SyncedDate = NOW();
END;

//
DELIMITER ;
GRANT EXECUTE ON PROCEDURE Livescore_Sync_League_Import TO 'sabasports'@'%';
