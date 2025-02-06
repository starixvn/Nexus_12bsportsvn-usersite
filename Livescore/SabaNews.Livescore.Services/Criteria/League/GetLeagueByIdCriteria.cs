namespace SabaNews.Livescore.Services.Criteria.League;

using Fanex.Data.Repository;

public class GetLeagueByIdCriteria : CriteriaBase
{
    public long LeagueId { get; set; }

    public override string GetSettingKey() => "Livescore_League_GetLeagueById";

    public override bool IsValid() => true;
}