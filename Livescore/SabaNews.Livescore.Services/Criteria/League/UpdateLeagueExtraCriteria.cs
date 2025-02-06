namespace SabaNews.Livescore.Services.Criteria.League;

using SabaNews.Core.Models;

public class UpdateLeagueExtraCriteria : BaseNonQueryCommand
{
    public long LeagueId { get; set; }
    public int Priority { get; set; }
    public bool IsMajor { get; set; }
    public override string GetSettingKey() => "Livescore_League_Extra_Update";

    public override bool IsValid() => true;
}