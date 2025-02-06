namespace SabaNews.Livescore.Services.Criteria.League;

using SabaNews.Core.Models;

public class InsertTopScorersCriteria : BaseNonQueryCommand
{
    public long PlayerId { get; set; }
    public long SeasonId { get; set; }
    public long LeagueId { get; set; }
    public long TeamId { get; set; }
    public int Goals { get; set; }
    public int Assists { get; set; }
    public int Top { get; set; }
    public override string GetSettingKey() => "Livescore_Top_Scorers_Insert";
    public override bool IsValid() => Top > 0 && PlayerId > 0;
}