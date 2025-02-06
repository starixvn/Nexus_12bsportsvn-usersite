namespace SabaNews.Livescore.Services.Criteria.League;

using SabaNews.Core.Models;
using System;

public class InsertLeagueExtraCriteria : BaseNonQueryCommand
{
    public long LeagueId { get; set; }
    public int Priority { get; set; }
    public bool IsMajor { get; set; }
    public DateTime CreatedDate { get; set; }
    public override string GetSettingKey() => "Livescore_League_Extra_Insert";

    public override bool IsValid() => true;
}