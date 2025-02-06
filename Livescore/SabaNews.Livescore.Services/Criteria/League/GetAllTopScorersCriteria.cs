namespace SabaNews.Livescore.Services.Criteria.League;

using Fanex.Data.Repository;

public class GetAllTopScorersCriteria : CriteriaBase
{
    public long LeagueId { get; set; }
    public long SeasonId { get; set; }
    public override string GetSettingKey() => "Livescore_Top_Scorers_Get";

    public override bool IsValid() => true;
}