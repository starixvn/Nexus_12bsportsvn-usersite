/*<info serverAlias="SSMS-sabasports" databaseType="2" executers="sabasports" isFunction="0" isNested="0"></info>*/
DROP PROCEDURE IF EXISTS Livescorer_Minigame_Get_Detail;

DELIMITER //

CREATE DEFINER=`sabasports`@`%` PROCEDURE `Livescorer_Minigame_Get_Detail`(
	/*
		Creator: Brian@20220909
        Revisions:
			- 20220909@Brian: init
    */
	userId INT
)
BEGIN
	SELECT u.ID, mi.LuckyNumber, mi.JoinDate, mi.TeamId
    FROM wp_users as u
    INNER JOIN livescore_minigame as mi ON u.ID = mi.UserId
    WHERE u.ID = userId;
END

//
DELIMITER ;	