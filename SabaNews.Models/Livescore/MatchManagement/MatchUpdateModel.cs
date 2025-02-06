namespace SabaNews.Models.Livescore.MatchManagement;

using Microsoft.AspNetCore.Http;
using System;

public class MatchUpdateModel
{
    public long MatchId { get; set; }
    public long HomeTeamId { get; set; }
    public string HomeTeamNameVN { get; set; }
    public bool IsDeletedHomeIcon { get; set; }
    public IFormFile HomeIcon { get; set; }
    public long AwayTeamId { get; set; }
    public string AwayTeamNameVN { get; set; }
    public IFormFile AwayIcon { get; set; }
    public bool IsDeletedAwayIcon { get; set; }
    public short? HomeTeamHalfScore { get; set; }
    public short? AwayTeamHalfScore { get; set; }
    public short? HomeTeamExtraScore { get; set; }
    public short? AwayTeamExtraScore { get; set; }
    public short? HomeTeamAggregateScore { get; set; }
    public short? AwayTeamAggregateScore { get; set; }
    public short? HomeTeamPenaltyScore { get; set; }
    public short? AwayTeamPenaltyScore { get; set; }
    public short? Status { get; set; }
    public DateTime StartTime { get; set; }
    public short? Round { get; set; }
    public string StageNameVN { get; set; }
}