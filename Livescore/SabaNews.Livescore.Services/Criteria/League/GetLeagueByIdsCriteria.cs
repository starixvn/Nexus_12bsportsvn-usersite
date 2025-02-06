namespace SabaNews.Livescore.Services.Criteria.League;

using Fanex.Data.Repository;

public class GetLeagueByIdsCriteria : CriteriaBase
{
    public string LeagueIds { get; set; }

    public override string GetSettingKey() => "Livescore_League_GetByIds";

    public override bool IsValid() => true;
}