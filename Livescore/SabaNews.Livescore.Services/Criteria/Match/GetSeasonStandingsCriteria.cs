namespace SabaNews.Livescore.Services.Criteria.Match;

using Fanex.Data.Repository;

public class GetSeasonStandingsCriteria : CriteriaBase
{
    public long LeagueId { get; set; }
    public long SeasonId { get; set; }

    public override string GetSettingKey() => "Livescore_Match_GetSeasonStandings";

    public override bool IsValid() => LeagueId > 0 && SeasonId > 0;
}