namespace SabaNews.Livescore.Services.Criteria.League;

using SabaNews.Core.Models;

public class DeleteTopScorersCriteria : BaseNonQueryCommand
{
    public int RowNum { get; set; }
    public long SeasonId { get; set; }
    public long LeagueId { get; set; }
    public override string GetSettingKey() => "Livescore_Top_Scorers_Delete";
    public override bool IsValid() => RowNum > 0;
}