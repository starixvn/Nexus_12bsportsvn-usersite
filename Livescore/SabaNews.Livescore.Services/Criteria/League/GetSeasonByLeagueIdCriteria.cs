namespace SabaNews.Livescore.Services.Criteria.League;

using Fanex.Data.Repository;

public class GetSeasonByLeagueIdCriteria : CriteriaBase
{
    public long LeagueId { get; set; }
    public override string GetSettingKey() => "Livescore_Season_GetByLeague";
    public override bool IsValid() => LeagueId > 0;
}