DROP PROCEDURE IF EXISTS Livescore_Sync_Team_Import;
DELIMITER $$
CREATE DEFINER=`sabasports`@`%` PROCEDURE `Livescore_Sync_Team_Import`(
	IN teamListJson JSON
    ,OUT errCode SMALLINT
    ,OUT errMsg VARCHAR(100)
    /*
		Creator: Tim@20220325
        Revisions: - 20220325@Tim: init
    */
)
BEGIN
    SET errCode=0, errMsg='';
    
    DROP TEMPORARY TABLE IF EXISTS tmp_Team;
    CREATE TEMPORARY TABLE IF NOT EXISTS tmp_Team(TeamId BIGINT PRIMARY KEY NOT NULL
		,CombinedId BIGINT
		,SportId SMALLINT
        ,TeamNameEN VARCHAR(255)
		,TeamFullNameEN VARCHAR(255)
        ,TeamNameCN VARCHAR(255)
		,TeamFullNameCN VARCHAR(255)
		,LeagueId BIGINT
        ,CountryId BIGINT
		,Icon VARCHAR(255)
		,FoundationTime VARCHAR(4)
		,Website VARCHAR(255)
		,MarketValue BIGINT
		,MarketValueCurrency VARCHAR(50)
		,National BIT
		,CountryLogo VARCHAR(255)
        ,TotalPlayers SMALLINT
        ,ForeignPlayers SMALLINT
        ,NationalPlayers SMALLINT
        ,CoachId BIGINT
        ,CoachNameEN VARCHAR(255)
        ,CoachIcon VARCHAR(255)
        ,VanueId BIGINT
        ,VanueNameEN VARCHAR(255)
        ,VanueCapacity INT
		,VanueCity VARCHAR(50)
		,UpdatedAt DATETIME DEFAULT NULL);
    
	INSERT INTO tmp_Team(TeamId
		,CombinedId
		,SportId
        ,TeamNameEN
		,TeamFullNameEN
        ,TeamNameCN
		,TeamFullNameCN
		,LeagueId
        ,CountryId
		,Icon
		,FoundationTime
		,Website
		,MarketValue
		,MarketValueCurrency
		,National
		,CountryLogo
        ,TotalPlayers
        ,ForeignPlayers
        ,NationalPlayers
        ,CoachId
        ,CoachNameEN
        ,CoachIcon
        ,VanueId
        ,VanueNameEN
        ,VanueCapacity
		,VanueCity
		,UpdatedAt)
    SELECT TeamId
		,CombinedId
		,SportId
        ,NULLIF(TeamNameEN, 'NULL')
		,NULLIF(TeamFullNameEN, 'NULL')
        ,NULLIF(TeamNameCN, 'NULL')
		,NULLIF(TeamFullNameCN, 'NULL')
		,LeagueId
        ,CountryId
		,NULLIF(Icon, 'NULL')
		,NULLIF(FoundationTime, 'NULL')
		,NULLIF(Website, 'NULL')
		,MarketValue
		,NULLIF(MarketValueCurrency, 'NULL')
		,National
		,NULLIF(CountryLogo, 'NULL')
        ,TotalPlayers
        ,ForeignPlayers
        ,NationalPlayers
        ,CoachId
        ,NULLIF(CoachNameEN, 'NULL')
        ,NULLIF(CoachIcon, 'NULL')
        ,VanueId
        ,VanueNameEN
        ,VanueCapacity
		,VanueCity
		,UpdatedAt
    FROM 
		JSON_TABLE
        (
			teamListJson,
            "$[*]"
            COLUMNS
            (
                TeamId BIGINT PATH "$.TeamId"
				,CombinedId BIGINT PATH "$.CombinedId"
				,SportId SMALLINT PATH "$.SportId"
				,TeamNameEN VARCHAR(255) PATH "$.TeamNameEN"
				,TeamFullNameEN VARCHAR(255) PATH "$.TeamFullNameEN"
				,TeamNameCN VARCHAR(255) PATH "$.TeamName"
				,TeamFullNameCN VARCHAR(255) PATH "$.TeamFullName"
				,LeagueId BIGINT PATH "$.LeagueId"
				,CountryId BIGINT PATH "$.CountryId"
				,Icon VARCHAR(255) PATH "$.Icon"
				,FoundationTime VARCHAR(4) PATH "$.FoundationTime"
				,Website VARCHAR(255) PATH "$.Website"
				,MarketValue BIGINT PATH "$.MarketValue"
				,MarketValueCurrency VARCHAR(50) PATH "$.MarketValueCurrency"
				,National BIT PATH "$.National"
				,CountryLogo VARCHAR(255) PATH "$.CountryLogo"
				,TotalPlayers SMALLINT PATH "$.TotalPlayers"
				,ForeignPlayers SMALLINT PATH "$.ForeignPlayers"
				,NationalPlayers SMALLINT PATH "$.NationalPlayers"
				,CoachId BIGINT PATH "$.ManagerId"
				,CoachNameEN VARCHAR(255) PATH "$.ManagerNameEN"
				,CoachIcon VARCHAR(255) PATH "$.ManagerIcon"
				,VanueId BIGINT PATH "$.VanueId"
				,VanueNameEN VARCHAR(255) PATH "$.VanueNameEN"
				,VanueCapacity INT PATH "$.VanueCapacity"
				,VanueCity VARCHAR(50) PATH "$.VanueCity"
				,UpdatedAt DATETIME PATH "$.UpdatedAt"
            )
        ) AS t;

        INSERT INTO livescore_team(TeamId
			,CombinedId
			,SportId
			,TeamNameEN
			,TeamFullNameEN
			,TeamNameCN
			,TeamFullNameCN
			,LeagueId
			,CountryId
			,Icon
			,FoundationTime
			,Website
			,MarketValue
			,MarketValueCurrency
			,National
			,CountryLogo
			,TotalPlayers
			,ForeignPlayers
			,NationalPlayers
			,CoachId
			,CoachNameEN
			,CoachIcon
			,VanueId
			,VanueNameEN
			,VanueCapacity
			,VanueCity
			,UpdatedAt
			,SyncedDate)
		SELECT TeamId
			,CombinedId
			,SportId
			,TeamNameEN
			,TeamFullNameEN
			,TeamNameCN
			,TeamFullNameCN
			,LeagueId
			,CountryId
			,Icon
			,FoundationTime
			,Website
			,MarketValue
			,MarketValueCurrency
			,National
			,CountryLogo
			,TotalPlayers
			,ForeignPlayers
			,NationalPlayers
			,CoachId
			,CoachNameEN
			,CoachIcon
			,VanueId
			,VanueNameEN
			,VanueCapacity
			,VanueCity
			,UpdatedAt
			,NOW()
        FROM tmp_Team t
        ON DUPLICATE KEY UPDATE
            CombinedId = t.CombinedId
			,SportId = t.SportId
			,TeamNameEN = t.TeamNameEN
			,TeamFullNameEN = t.TeamFullNameEN
			,TeamNameCN = t.TeamNameCN
			,TeamFullNameCN = t.TeamFullNameCN
			,LeagueId = t.LeagueId
			,CountryId = t.CountryId
			,Icon = t.Icon
			,FoundationTime = t.FoundationTime
			,Website = t.Website
			,MarketValue = t.MarketValue
			,MarketValueCurrency = t.MarketValueCurrency
			,National = t.National
			,CountryLogo = t.CountryLogo
			,TotalPlayers = t.TotalPlayers
			,ForeignPlayers = t.ForeignPlayers
			,NationalPlayers = t.NationalPlayers
			,CoachId = t.CoachId
			,CoachNameEN = t.CoachNameEN
			,CoachIcon = t.CoachIcon
			,VanueId = t.VanueId
			,VanueNameEN = t.VanueNameEN
			,VanueCapacity = t.VanueCapacity
			,VanueCity = t.VanueCity
			,UpdatedAt = t.UpdatedAt
            ,SyncedDate = NOW();
END$$
DELIMITER ;

GRANT EXECUTE ON PROCEDURE Livescore_Sync_Team_Import TO 'sabasports'@'%';
