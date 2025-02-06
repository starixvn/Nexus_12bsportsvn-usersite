namespace SabaNews.Livescore.Services.Criteria.Match;

using SabaNews.Core.Models;
using System;

public class UpdateMatchCommand : BaseNonQueryCommand
{
    public long MatchId { get; set; }
    public long StageId { get; set; }
    public long HomeTeamId { get; set; }
    public string HomeTeamNameVN { get; set; }
    public string HomeTeamIconVN { get; set; }
    public long AwayTeamId { get; set; }
    public string AwayTeamNameVN { get; set; }
    public string AwayTeamIconVN { get; set; }
    public string StageNameVN { get; set; }
    public short? Status { get; set; }
    public DateTime? StartTime { get; set; }
    public short? Round { get; set; }
    public short? HomeTeamHalfScore { get; set; }
    public short? AwayTeamHalfScore { get; set; }
    public short? HomeTeamExtraScore { get; set; }
    public short? AwayTeamExtraScore { get; set; }
    public short? HomeTeamAggregateScore { get; set; }
    public short? AwayTeamAggregateScore { get; set; }
    public short? HomeTeamPenaltyScore { get; set; }
    public short? AwayTeamPenaltyScore { get; set; }

    public override string GetSettingKey() => "Livescore_Match_Update";

    public override bool IsValid() => true;
}