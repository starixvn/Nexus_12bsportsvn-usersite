/*<info serverAlias="SSMS-sabasports" databaseType="2" executers="sabasports" isFunction="0" isNested="0"></info>*/
DROP PROCEDURE IF EXISTS Livescore_Sync_Country_Import;

DELIMITER //

CREATE DEFINER=`sabasports`@`%` PROCEDURE `Livescore_Sync_Country_Import`(
	IN countryListJson JSON
    ,OUT errCode SMALLINT
    ,OUT errMsg VARCHAR(100)
    /*
		Creator: Hank@20220708
        Revisions: - 20220708@Hank: init
    */
)
BEGIN
	SET errCode=0, errMsg='';
    DROP TEMPORARY TABLE IF EXISTS tmp_Country;
    CREATE TEMPORARY TABLE IF NOT EXISTS tmp_Country(
		CountryId BIGINT NOT NULL
		,CategoryId BIGINT
        ,CountryName VARCHAR(255)
        ,CountryNameZHT VARCHAR(255)
        ,CountryNameEN VARCHAR(255)
        ,CountryFullName VARCHAR(255)
        ,countryFullNameZHT VARCHAR(255)
        ,CountryFullNameEN VARCHAR(255)
        ,CountryLogo VARCHAR(255)
        ,PRIMARY KEY (CountryId)
    );
    
    INSERT INTO tmp_Country(CountryId
		,CategoryId
        ,CountryName
		,CountryNameZHT
        ,CountryNameEN
        ,CountryFullName
		,CountryFullNameZHT
        ,CountryFullNameEN
		,CountryLogo)
    SELECT CountryId
		,CategoryId
        ,CountryName
		,CountryNameZHT
        ,CountryNameEN
        ,CountryFullName
		,CountryFullNameZHT
        ,CountryFullNameEN
		,CountryLogo
    FROM 
		JSON_TABLE
        (
			countryListJson,
            "$[*]"
            COLUMNS
            (
				CountryId BIGINT PATH "$.CountryId"
				,CategoryId BIGINT PATH "$.CategoryId"
				,CountryName VARCHAR(255) PATH "$.CountryName"
				,CountryNameZHT VARCHAR(255) PATH "$.CountryNameZHT"
				,CountryNameEN VARCHAR(255) PATH "$.CountryNameEN"
				,CountryFullName VARCHAR(255) PATH "$.CountryFullName"
				,CountryFullNameZHT VARCHAR(255) PATH "$.CountryFullNameZHT"
				,CountryFullNameEN VARCHAR(255) PATH "$.CountryFullNameEN"
				,CountryLogo VARCHAR(255) PATH "$.CountryLogo"
            )
        ) AS t;
        
	INSERT INTO livescore_country(CountryId
		,CategoryId
        ,CountryName
		,CountryNameZHT
        ,CountryNameEN
        ,CountryFullName
		,CountryFullNameZHT
        ,CountryFullNameEN
		,CountryLogo)
	SELECT CountryId
		,CategoryId
        ,CountryName
		,CountryNameZHT
        ,CountryNameEN
        ,CountryFullName
		,CountryFullNameZHT
        ,CountryFullNameEN
		,CountryLogo
	FROM tmp_Country c
	ON DUPLICATE KEY UPDATE
        CountryId = c.CountryId
		,CategoryId = c.CategoryId
        ,CountryName = c.CountryName
		,CountryNameZHT = c.CountryNameZHT
        ,CountryNameEN = c.CountryNameEN
		,CountryFullName = c.CountryFullName
		,CountryFullNameZHT = c.CountryFullNameZHT
		,CountryFullNameEN = c.CountryFullNameEN
		,CountryLogo = c.CountryLogo;
END

//
DELIMITER ;	