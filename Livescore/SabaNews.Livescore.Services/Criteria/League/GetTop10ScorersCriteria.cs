namespace SabaNews.Livescore.Services.Criteria.League;

using Fanex.Data.Repository;

public class GetTop10ScorersCriteria : CriteriaBase
{
    public long LeagueId { get; set; }
    public long SeasonId { get; set; }
    public override string GetSettingKey() => "Livescore_Top_Scorers_GetTop10";

    public override bool IsValid() => true;
}