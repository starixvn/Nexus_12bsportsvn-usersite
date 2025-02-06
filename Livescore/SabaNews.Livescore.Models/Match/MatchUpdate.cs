
namespace SabaNews.Livescore.Models.Match;

using System;
using SabaNews.Livescore.Models.League;
using SabaNews.Livescore.Models.Team;
public class MatchUpdate
{
    public long MatchId { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime? StartTimeCustom { get; set; }
    public DateTime EndTime { get; set; }
    public League League { get; set; }
    public Team HomeTeam { get; set; }
    public Team AwayTeam { get; set; }

    public Season Season { get; set; }
    public SeasonStage Stage { get; set; }

    public short? GroupNum { get; set; }
    public short? Round { get; set; }
    public short? RoundCustom { get; set; }
    public short Status { get; set; }
    public short? StatusCustom { get; set; }
    public short HomeTeamHalfScore { get; set; }
    public short? HomeTeamHalfScoreCustom { get; set; }
    public short AwayTeamHalfScore { get; set; }
    public short? AwayTeamHalfScoreCustom { get; set; }
    public short HomeTeamTotalScore { get; set; }
    public short AwayTeamTotalScore { get; set; }
    public short HomeTeamExtraScore { get; set; }
    public short? HomeTeamExtraScoreCustom { get; set; }
    public short AwayTeamExtraScore { get; set; }
    public short? AwayTeamExtraScoreCustom { get; set; }
    public short? HomeTeamAggregateScore { get; set; }
    public short? HomeTeamAggregateScoreCustom { get; set; }
    public short? AwayTeamAggregateScore { get; set; }
    public short? AwayTeamAggregateScoreCustom { get; set; }
    public short? HomeTeamPenaltyScore { get; set; }
    public short? HomeTeamPenaltyScoreCustom { get; set; }
    public short? AwayTeamPenaltyScore { get; set; }
    public short? AwayTeamPenaltyScoreCustom { get; set; }
    public DateTime? FootballStartTime { get; set; }
    public DateTime? FootballNextHalfStartTime { get; set; }
    public DateTime? FootballAddStartTime { get; set; }
    public bool IsFavourite { get; set; }
    public bool IsSecondLeg { get; set; }
}