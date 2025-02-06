CREATE TABLE `livescore_head_to_head` (
  `HomeTeamId` bigint NOT NULL,
  `AwayTeamId` bigint NOT NULL,
  `MatchId` bigint NOT NULL
);

CREATE TABLE `livescore_league` (
  `LeagueId` bigint PRIMARY KEY NOT NULL,
  `LeagueName` varchar(100) DEFAULT NULL,
  `LeagueFullName` varchar(255) DEFAULT NULL,
  `LeagueNameVN` varchar(255) DEFAULT NULL,
  `Level` int NOT NULL,
  `Icon` varchar(255),
  `LeagueType` int NOT NULL,
  `CurrentRound` int,
  `RoundCount` int,
  `TitleHolderTeam` varchar(255),
  `TitleHolderCount` varchar(10),
  `MostTitleTeam` varchar(255),
  `MostTitleCount` varchar(10),
  `CategoryId` int,
  `CurrentSeasonId` varchar(45) DEFAULT NULL,
  `CurrentStage` int NOT NULL,
  `CurrentStageName` varchar(255),
  `CountryId` bigint,
  `Country` varchar(100),
  `City` varchar(100),
  `Seasons` json,
  `HigherLeagueIds` json,
  `LowerLeagueIds` json,
  `IsMajor` bit DEFAULT 0,
  `SyncedDate` datetime NOT NULL,
  `UpdatedAt` datetime DEFAULT NULL
);

CREATE TABLE `livescore_league_season` (
  `SportId` int DEFAULT 1,
  `LeagueId` bigint NOT NULL,
  `SeasonId` bigint NOT NULL,
  `StartDate` datetime NOT NULL,
  `EndDate` datetime DEFAULT null,
  `Year` int NOT NULL,
  `IsCurrent` bit DEFAULT 0,
  `HasPlayerStats` bit DEFAULT 0,
  `HasTeamStats` bit DEFAULT 0,
  `HasLeaderBoard` bit DEFAULT 0,
  `IsDeleted` bit DEFAULT 0,
  `SyncedDate` datetime NOT NULL,
  `UpdatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`SeasonId`, `LeagueId`)
);

CREATE TABLE `livescore_season_stage` (
  `SportId` int DEFAULT 1,
  `SeasonId` bigint NOT NULL,
  `StageId` bigint NOT NULL,
  `StageName` varchar(50),
  `StageNameVN` varchar(50),
  `StageFashion` tinyint(4),
  `GroupCount` int,
  `OrderIndex` int,
  `RoundCount` int,
  `IsDeleted` bit DEFAULT 0,
  `SyncedDate` datetime NOT NULL,
  `UpdatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`SeasonId`, `StageId`)
);

CREATE TABLE `livescore_lineup` (
  `MatchId` bigint PRIMARY KEY NOT NULL,
  `HomeFormat` varchar(30),
  `AwayFormat` varchar(30),
  `HomeCoach` varchar(50),
  `AwayCoach` varchar(50),
  `SyncedDate` datetime NOT NULL,
  `EventDate` datetime DEFAULT NULL
);

CREATE TABLE `livescore_team_lineup` (
  `MatchId` bigint NOT NULL,
  `TeamId` bigint NOT NULL,
  `PlayerId` bigint NOT NULL,
  `PlayerName` int NOT NULL,
  `IsSubstitute` bit DEFAULT 0,
  `ShirtNumber` int NOT NULL,
  `Position` int DEFAULT null,
  `CoordinateX` int DEFAULT null,
  `CoordinateY` int DEFAULT null,
  PRIMARY KEY (`MatchId`, `TeamId`)
);

CREATE TABLE `livescore_match` (
  `MatchId` bigint PRIMARY KEY NOT NULL,
  `CombinedId` bigint,
  `SportId` tinyint DEFAULT 1,
  `LeagueId` bigint NOT NULL,
  `SeasonId` bigint,
  `RoundId` bigint,
  `StageId` bigint,
  `GroupNum` int,
  `RelatedId` bigint,
  `Round` int,
  `Neutral` int,
  `StartTime` datetime,
  `EndTime` datetime,
  `HomeTeamId` bigint NOT NULL,
  `AwayTeamId` bigint NOT NULL,
  `Status` int,
  `IsLineUp` bit,
  `IsIntelligence` bit,
  `SyncedDate` datetime NOT NULL,
  `UpdatedAt` datetime DEFAULT NULL
);

CREATE TABLE `livescore_match_statistic` (
  `MatchId` bigint NOT NULL,
  `TeamId` bigint NOT NULL,
  `YellowCard` int,
  `RedCard` int,
  `FullScore` int,
  `HalfScore` int,
  `CornerKick` int,
  `ExtractScore` int,
  `PenaltiesScore` int,
  `OutBall` int,
  `FreeKick` int,
  `GoalKick` int,
  `PenaltyKick` int,
  `YellowToRed` int,
  `FailPenaltyKick` int,
  `OwnGoal` int,
  `InjuryTime` int,
  `OnGoal` int,
  `MissGoal` int,
  `Attack` int,
  `DangerAttack` int,
  `ControlRate` int,
  PRIMARY KEY (`MatchId`, `TeamId`)
);

CREATE TABLE `livescore_match_progress` (
  `MatchId` bigint NOT NULL,
  `Type` int,
  `IsTextLive` bit DEFAULT 0,
  `Position` int,
  `Time` int,
  `Seccond` int,
  `HomeScore` int NOT NULL,
  `AwayScore` int NOT NULL,
  `PlayerId` bigint,
  `PlayerName` varchar(100),
  `VarReason` int,
  `VarResult` int,
  `ReasonType` int,
  `Content` text
);

CREATE TABLE `livescore_standings` (
  `LeagueId` bigint NOT NULL,
  `SeasonId` bigint NOT NULL,
  `TeamId` int NOT NULL,
  `Position` int NOT NULL,
  `Total` int NOT NULL,
  `TotalHome` int NOT NULL,
  `TotalAway` int NOT NULL,
  `Won` int NOT NULL,
  `WonHome` int NOT NULL,
  `WonAway` int NOT NULL,
  `Draw` int NOT NULL,
  `DrawHome` int NOT NULL,
  `DrawAway` int NOT NULL,
  `Points` int NOT NULL,
  `PointsHome` int NOT NULL,
  `PointsAway` int NOT NULL,
  `DeductPoints` int NOT NULL,
  `Goals` int NOT NULL,
  `GoalsHome` int NOT NULL,
  `GoalsAway` int NOT NULL,
  `GoalsAgainst` int NOT NULL,
  `GoalsAgainstHome` int NOT NULL,
  `GoalsAgainstAway` int NOT NULL,
  `GoalDiff` int NOT NULL,
  `GoalDiffHome` int NOT NULL,
  `GoalDiffAway` int NOT NULL,
  `SyncedDate` datetime NOT NULL,
  `UpdatedAt` datetime NOT NULL,
  PRIMARY KEY (`LeagueId`, `SeasonId`, `TeamId`)
);

CREATE TABLE `livescore_team` (
  `TeamId` bigint PRIMARY KEY NOT NULL,
  `CombinedTeamId` bigint,
  `SportId` int DEFAULT 1,
  `TeamName` varchar(100) NOT NULL,
  `TeamFullName` varchar(200),
  `LeagueId` int NOT NULL,
  `CountryId` int,
  `Abbreviation` varchar(45) NOT NULL,
  `Icon` varchar(100) NOT NULL DEFAULT "",
  `FoundationTime` varchar(50),
  `Website` varchar(50),
  `MarketValue` bigint,
  `National` tinyint(4),
  `CoachId` int,
  `CoachName` varchar(100),
  `CoachIcon` varchar(100),
  `VanueId` int,
  `VanueName` varchar(100),
  `VanueCapacity` varchar(50),
  `VanueCity` varchar(50),
  `SyncedDate` datetime NOT NULL,
  `UpdatedAt` datetime DEFAULT NULL
);

CREATE TABLE `livescore_player` (
  `PlayerId` bigint PRIMARY KEY NOT NULL,
  `PlayerName` varchar(50),
  `PlayerFullName` varchar(255),
  `Icon` varchar(100),
  `ShirtNumber` int,
  `Description` varchar(100),
  `UpdatedAt` datetime DEFAULT NULL,
  `SyncedDate` datetime NOT NULL
);

CREATE TABLE `livescore_temporary_match` (
  `MatchId` bigint PRIMARY KEY NOT NULL
);

CREATE INDEX `headtohead_match_id_index` ON `livescore_head_to_head` (`MatchId`);

CREATE INDEX `headtohead_home_team_index` ON `livescore_head_to_head` (`HomeTeamId`);

CREATE INDEX `headtohead_away_team_index` ON `livescore_head_to_head` (`AwayTeamId`);

CREATE INDEX `league_id_index` ON `livescore_league` (`LeagueId`);

CREATE INDEX `league_updated_at_index` ON `livescore_league` (`UpdatedAt`);

CREATE INDEX `league_name_index` ON `livescore_league` (`LeagueName`);

CREATE INDEX `season_updated_at_index` ON `livescore_league_season` (`UpdatedAt`);

CREATE INDEX `stage_updated_at_index` ON `livescore_season_stage` (`UpdatedAt`);

CREATE INDEX `lineup_match_id` ON `livescore_lineup` (`MatchId`);

CREATE INDEX `match_match_id_index` ON `livescore_match` (`MatchId`);

CREATE INDEX `match_home_team_index` ON `livescore_match` (`HomeTeamId`);

CREATE INDEX `match_away_team_index` ON `livescore_match` (`AwayTeamId`);

CREATE INDEX `match_updated_at_index` ON `livescore_match` (`UpdatedAt`);

CREATE INDEX `match_progress_match_id_index` ON `livescore_match_progress` (`MatchId`);

CREATE INDEX `team_updated_at_index` ON `livescore_team` (`UpdatedAt`);

CREATE INDEX `player_updated_at_index` ON `livescore_player` (`UpdatedAt`);
