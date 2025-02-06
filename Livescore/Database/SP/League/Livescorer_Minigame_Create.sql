/*<info serverAlias="SSMS-sabasports" databaseType="2" executers="sabasports" isFunction="0" isNested="0"></info>*/
DROP PROCEDURE IF EXISTS Livescorer_Minigame_Create;

DELIMITER //


CREATE DEFINER=`sabasports`@`%` PROCEDURE `Livescorer_Minigame_Create`(
	/*
		Creator: Brian@20220909
        Revisions:
			- 20220909@Brian: init
    */
	UserId INT,
    LuckyNumber VARCHAR(50),
    JoinDate DATETIME,
	TeamId INT,
    OUT ErrCode SMALLINT,
    OUT ErrMsg VARCHAR(100)
)
Livescorer_Minigame_Create:BEGIN	   
    INSERT INTO `livescore_minigame`
	(`UserId`,
	`LuckyNumber`,
	`JoinDate`,
    `TeamId`)
	VALUES
	(UserId,
	LuckyNumber,
	JoinDate,
    TeamId);    
END

//
DELIMITER ;	