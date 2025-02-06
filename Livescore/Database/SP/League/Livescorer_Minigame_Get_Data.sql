/*<info serverAlias="SSMS-sabasports" databaseType="2" executers="sabasports" isFunction="0" isNested="0"></info>*/
DROP PROCEDURE IF EXISTS Livescorer_Minigame_Get_Data;

DELIMITER //


CREATE DEFINER=`sabasports`@`%` PROCEDURE `Livescorer_Minigame_Get_Data`(
	/*
		Creator: Brian@20220909
        Revisions:
			- 20220909@Brian: init
    */
    ToDate DATETIME,
	start INT,
    end INT,
    OUT TotalItems INT
)
BEGIN
	SELECT count(*)
    INTO TotalItems
    FROM wp_users as u
    INNER JOIN livescore_minigame as mi ON u.ID = mi.UserId;
	
	SELECT u.ID, u.display_name as Name, mi.LuckyNumber, mi.JoinDate, u.user_email as Email, t.TeamFullNameEN, t.TeamNameEN, t.TeamNameVN, t.Icon AS TeamLogo
    FROM wp_users as u
    INNER JOIN livescore_minigame as mi ON u.ID = mi.UserId
    INNER JOIN livescore_team as t ON mi.TeamId = t.TeamId
    WHERE mi.JoinDate < ToDate
    ORDER BY JoinDate DESC
    LIMIT start, end;
END

//
DELIMITER ;	