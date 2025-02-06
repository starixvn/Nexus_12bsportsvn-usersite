namespace SabaNews.Livescore.Services.Criteria.League;

using SabaNews.Core.Models;

public class UpdateLeagueExtraPriorityCriteria : BaseNonQueryCommand
{
    public int Priority { get; set; }
    public long LeagueIdUpdate { get; set; }
    public int PriorityUpdate { get; set; }
    public bool IsDelete { get; set; }
    public bool IsCheck { get; set; }
    public override string GetSettingKey() => "Livescore_League_Extra_UpdatePriorities";

    public override bool IsValid() => true;
}