DROP PROCEDURE IF EXISTS Livescore_SyncMatch_StatisticImport;
DELIMITER //

CREATE DEFINER = 'sabasports'@'%' PROCEDURE Livescore_SyncMatch_StatisticImport(
    IN MatchScoreJson JSON
    ,IN MatchDetailJson JSON
    ,OUT errCode SMALLINT
	,OUT errMsg VARCHAR(100)
    /*
		Creator: Oliver@20220325
        Param: - matchScoreJson: in JSON format
						[{"matchId": 6227374,
                        "HomeTotalScore": 1,
                        "AwayTotalScore": 1,
                        "HomeHalfScore": 1,
                        "AwayHalfScore": 1,
                        "HomeAggregateScore": 3,
                        "AwayAggregateScore": 5,
                        "Status": 20}]
                - matchDetailJson: in JSON format
                    [{
                        "IsHomeTeam" = 10,
                        "MatchId" = 10,
                        "Goal" = 10,
                        "CornerKick" = 10,
                        "YellowCard" = 10,
                        "RedCard" = 10,
                        "OutBall" = 10,
                        "FreeKick" = 10,
                        "GoalKick" = 10,
                        "PenaltyKick" = 10,
                        "YellowToRed" = 10,
                        "FailPenaltyKick" = 10,
                        "OwnGoal" = 10,
                        "InjuryTime" = 10,
                        "OnGoal" = 10,
                        "MissGoal" = 10,
                        "Attack" = 10,
                        "DangerAttack" = 10,
                        "ControlRate" = 10,
                        "ExtraScore" = 10,
                        "PenaltyScore" = 10,
                        "Assists" = 10,
                        "First" = 10,
                        "Follow" = 10,
                        "Foul" = 10,
                        "Grade" = 10,
                        "HalfCorner" = 10,
                        "HalfPossession" = 10,
                        "Head" = 10,
                        "HeadSuccess" = 10,
                        "Intercept" = 10,
                        "OffSide" = 10,
                        "OnDoor" = 10,
                        "Pass" = 10,
                        "PassSuccess" = 10,
                        "Past" = 10,
                        "Shoot" = 10,
                        "ShootOut" = 10,
                        "ShootStop" = 10,
                        "Slide" = 10,
                        "Steals" = 10
                    }]
        Revisions: - 20220325@Oliver: init
    */
)
SQL SECURITY DEFINER
BEGIN
 # Variables
    SET errCode=0, errMsg='';
    
    DROP TEMPORARY TABLE IF EXISTS tmp_Match;
    CREATE TEMPORARY TABLE IF NOT EXISTS tmp_Match(
                        MatchId bigint PRIMARY KEY NOT NULL,
                        HomeTotalScore INT,
                        AwayTotalScore INT,
                        HomeHalfScore INT,
                        AwayHalfScore INT,
                        HomeAggregateScore INT,
                        AwayAggregateScore INT,
                        Status SMALLINT,
                        GameStartTime DATETIME,
                        GameEndTime DATETIME
                        );
    
	INSERT INTO tmp_Match(MatchId, HomeTotalScore, AwayTotalScore, HomeHalfScore, AwayHalfScore, 
                        HomeAggregateScore, AwayAggregateScore, Status, GameStartTime, GameEndTime)
    SELECT m.MatchId, m.HomeTotalScore, m.AwayTotalScore, m.HomeHalfScore, m.AwayHalfScore, 
            m.HomeAggregateScore, m.AwayAggregateScore, m.Status, m.GameStartTime, m.GameEndTime
    FROM 
		JSON_TABLE
        (
			MatchScoreJson,
            "$[*]"
            COLUMNS
            (
				MatchId bigint PATH "$.MatchId",
                HomeTotalScore INT PATH "$.HomeTotalScore",
                AwayTotalScore INT PATH "$.AwayTotalScore",
                HomeHalfScore INT PATH "$.HomeHalfScore",
                AwayHalfScore INT PATH "$.AwayHalfScore",
                HomeAggregateScore INT PATH "$.HomeAggregateScore",
                AwayAggregateScore INT PATH "$.AwayAggregateScore",
                Status SMALLINT PATH "$.Status",
                GameStartTime DATETIME PATH "$.GameStartTime",
                GameEndTime DATETIME PATH "$.GameEndTime"
            )
        ) AS m;

    UPDATE livescore_match AS m
    INNER JOIN tmp_Match AS m_tpm ON m.MatchId = m_tpm.MatchId
    SET  m.HomeTeamTotalScore = m_tpm.HomeTotalScore,
         m.AwayTeamTotalScore = m_tpm.AwayTotalScore,
         m.HomeTeamHalfScore = m_tpm.HomeHalfScore,
         m.AwayTeamHalfScore = m_tpm.AwayHalfScore,
         m.HomeTeamAggregateScore = m_tpm.HomeAggregateScore,
         m.AwayTeamAggregateScore = m_tpm.AwayAggregateScore,
         m.Status = m_tpm.Status,
         m.StartTime = m_tpm.GameStartTime,
         m.EndTime = m_tpm.GameEndTime;

/* End handle update score------------------ */

    DROP TEMPORARY TABLE IF EXISTS tmp_Detail;
    CREATE TEMPORARY TABLE IF NOT EXISTS tmp_Detail(
                        MatchId BIGINT NOT NULL,
                        TeamId BIGINT NOT NULL,
                        Goal SMALLINT,
                        CornerKick SMALLINT,
                        YellowCard SMALLINT,
                        RedCard SMALLINT,
                        OutBall SMALLINT,
                        FreeKick SMALLINT,
                        GoalKick SMALLINT,
                        PenaltyKick SMALLINT,
                        YellowToRed SMALLINT,
                        FailPenaltyKick SMALLINT,
                        OwnGoal SMALLINT,
                        InjuryTime SMALLINT,
                        OnGoal SMALLINT,
                        MissGoal SMALLINT,
                        Attack SMALLINT,
                        DangerAttack SMALLINT,
                        ControlRate SMALLINT,
                        ExtraScore SMALLINT,
                        PenaltyScore SMALLINT,
                        Assists SMALLINT,
                        First SMALLINT,
                        Follow SMALLINT,
                        Foul SMALLINT,
                        Grade VARCHAR(10),
                        HalfCorner SMALLINT,
                        HalfPossession VARCHAR(10),
                        Head SMALLINT,
                        HeadSuccess SMALLINT,
                        Intercept SMALLINT,
                        OffSide SMALLINT,
                        OnDoor SMALLINT,
                        Pass SMALLINT,
                        PassSuccess VARCHAR(10),
                        Past SMALLINT,
                        Shoot SMALLINT,
                        ShootOut SMALLINT,
                        ShootStop SMALLINT,
                        Slide SMALLINT,
                        Steals SMALLINT,
                        IsExisted BIT);
    
	INSERT INTO tmp_Detail(MatchId, TeamId, Goal, CornerKick, YellowCard, RedCard, OutBall, 
    FreeKick, GoalKick, PenaltyKick, YellowToRed, FailPenaltyKick, OwnGoal, InjuryTime, OnGoal, 
    MissGoal, Attack, DangerAttack, ControlRate, ExtraScore, PenaltyScore, Assists, 
    First, Follow, Foul, Grade, HalfCorner, HalfPossession, Head, HeadSuccess, Intercept, 
    OffSide, OnDoor, Pass, PassSuccess, Past, Shoot, ShootOut, ShootStop, Slide, Steals)

    SELECT md.MatchId, (CASE WHEN md.IsHomeTeam = 1 THEN m.HomeTeamId ELSE m.AwayTeamId END) As TeamId, md.Goal, md.CornerKick, md.YellowCard, md.RedCard, md.OutBall, 
    md.FreeKick, md.GoalKick, md.PenaltyKick, md.YellowToRed, md.FailPenaltyKick, md.OwnGoal, md.InjuryTime, md.OnGoal, 
    md.MissGoal, md.Attack, md.DangerAttack, md.ControlRate, md.ExtraScore, md.PenaltyScore, md.Assists, 
    md.First, md.Follow, md.Foul, NULLIF(md.Grade, 'NULL'), md.HalfCorner, NULLIF(md.HalfPossession, 'NULL'), md.Head, md.HeadSuccess, md.Intercept,
    md.OffSide, md.OnDoor, md.Pass, NULLIF(md.PassSuccess, 'NULL'), md.Past, md.Shoot, md.ShootOut, md.ShootStop, md.Slide, md.Steals
    FROM 
		JSON_TABLE
        (
			MatchDetailJson,
            "$[*]"
            COLUMNS
            (
				MatchId BIGINT PATH "$.MatchId",
				IsHomeTeam SMALLINT PATH "$.IsHomeTeam",
                Goal SMALLINT  PATH "$.Goal",
                CornerKick SMALLINT PATH "$.CornerKick",
                YellowCard SMALLINT PATH "$.YellowCard",
                RedCard SMALLINT PATH "$.RedCard",
                OutBall SMALLINT PATH "$.OutBall",
                FreeKick SMALLINT PATH "$.FreeKick",
                GoalKick SMALLINT PATH "$.GoalKick",
                PenaltyKick SMALLINT PATH "$.PenaltyKick",
                YellowToRed SMALLINT PATH "$.YellowToRed",
                FailPenaltyKick SMALLINT PATH "$.FailPenaltyKick",
                OwnGoal SMALLINT PATH "$.OwnGoal",
                InjuryTime SMALLINT PATH "$.InjuryTime",
                OnGoal SMALLINT PATH "$.OnGoal",
                MissGoal SMALLINT PATH "$.MissGoal",
                Attack SMALLINT PATH "$.Attack",
                DangerAttack SMALLINT PATH "$.DangerAttack",
                ControlRate SMALLINT PATH "$.ControlRate",
                ExtraScore SMALLINT PATH "$.ExtraScore",
                PenaltyScore SMALLINT PATH "$.PenaltyScore",
                Assists SMALLINT PATH "$.Assists",
                First SMALLINT PATH "$.First",
                Follow SMALLINT PATH "$.Follow",
                Foul SMALLINT PATH "$.Foul",
                Grade VARCHAR(10) PATH "$.Grade",
                HalfCorner SMALLINT PATH "$.HalfCorner",
                HalfPossession VARCHAR(10) PATH "$.HalfPossession",
                Head SMALLINT PATH "$.Head",
                HeadSuccess SMALLINT PATH "$.HeadSuccess",
                Intercept SMALLINT PATH "$.Intercept",
                OffSide SMALLINT PATH "$.OffSide",
                OnDoor SMALLINT PATH "$.OnDoor",
                Pass SMALLINT PATH "$.Pass",
                PassSuccess VARCHAR(10) PATH "$.PassSuccess",
                Past SMALLINT PATH "$.Past",
                Shoot SMALLINT PATH "$.Shoot",
                ShootOut SMALLINT PATH "$.ShootOut",
                ShootStop SMALLINT PATH "$.ShootStop",
                Slide SMALLINT PATH "$.Slide",
                Steals SMALLINT PATH "$.Steals"
            )
        ) AS md
        INNER JOIN livescore_match m ON md.MatchId = m.MatchId;

        UPDATE tmp_Detail td
        LEFT JOIN livescore_match_statistic lms ON td.MatchId = lms.MatchId AND td.TeamId = lms.TeamId
        SET td.IsExisted = (
            CASE 
                WHEN lms.MatchId IS NOT NULL 
                THEN 1 
                ELSE 0 END
        );

        INSERT INTO livescore_match_statistic(MatchId, TeamId, Goal, CornerKick, YellowCard, RedCard, OutBall, 
            FreeKick, GoalKick, PenaltyKick, YellowToRed, FailPenaltyKick, OwnGoal, InjuryTime, OnGoal, 
            MissGoal, Attack, DangerAttack, ControlRate, ExtraScore, PenaltyScore, Assists, 
            First, Follow, Foul, Grade, HalfCorner, HalfPossession, Head, HeadSuccess, Intercept, 
            OffSide, OnDoor, Pass, PassSuccess, Past, Shoot, ShootOut, ShootStop, Slide, Steals)
        SELECT td.MatchId, td.TeamId, td.Goal, td.CornerKick, td.YellowCard, td.RedCard, td.OutBall, 
            td.FreeKick, td.GoalKick, td.PenaltyKick, td.YellowToRed, td.FailPenaltyKick, td.OwnGoal, td.InjuryTime, td.OnGoal, 
            td.MissGoal, td.Attack, td.DangerAttack, td.ControlRate, td.ExtraScore, td.PenaltyScore, td.Assists, 
            td.First, td.Follow, td.Foul, td.Grade, td.HalfCorner, td.HalfPossession, td.Head, td.HeadSuccess, td.Intercept,
            td.OffSide, td.OnDoor, td.Pass, td.PassSuccess, td.Past, td.Shoot, td.ShootOut, td.ShootStop, td.Slide, td.Steals
        FROM tmp_Detail td WHERE td.IsExisted = 0;

        UPDATE livescore_match_statistic lms
        INNER JOIN tmp_Detail td ON lms.MatchId = td.MatchId AND lms.TeamId = td.TeamId AND td.IsExisted = 1
        SET lms.Goal = td.Goal,
            lms.CornerKick = td.CornerKick,
            lms.YellowCard = td.YellowCard,
            lms.RedCard = td.RedCard,
            lms.OutBall = td.OutBall,
            lms.FreeKick = td.FreeKick,
            lms.GoalKick = td.GoalKick,
            lms.PenaltyKick = td.PenaltyKick,
            lms.YellowToRed = td.YellowToRed,
            lms.FailPenaltyKick = td.FailPenaltyKick,
            lms.OwnGoal = td.OwnGoal,
            lms.InjuryTime = td.InjuryTime,
            lms.OnGoal = td.OnGoal,
            lms.MissGoal = td.MissGoal,
            lms.Attack = td.Attack,
            lms.DangerAttack = td.DangerAttack,
            lms.ControlRate = td.ControlRate,
            lms.ExtraScore = td.ExtraScore,
            lms.PenaltyScore = td.PenaltyScore,
            lms.Assists = td.Assists,
            lms.First = td.First,
            lms.Follow = td.Follow,
            lms.Foul = td.Foul,
            lms.Grade = td.Grade,
            lms.HalfCorner = td.HalfCorner,
            lms.HalfPossession = td.HalfPossession,
            lms.Head = td.Head,
            lms.HeadSuccess = td.HeadSuccess,
            lms.Intercept = td.Intercept,
            lms.OffSide = td.OffSide,
            lms.OnDoor = td.OnDoor,
            lms.Pass = td.Pass,
            lms.PassSuccess = td.PassSuccess,
            lms.Past = td.Past,
            lms.Shoot = td.Shoot,
            lms.ShootOut = td.ShootOut,
            lms.ShootStop = td.ShootStop,
            lms.Slide = td.Slide,
            lms.Steals = td.Steals;
END;

//
DELIMITER ;
GRANT EXECUTE ON PROCEDURE Livescore_SyncMatch_StatisticImport TO 'sabasports'@'%';