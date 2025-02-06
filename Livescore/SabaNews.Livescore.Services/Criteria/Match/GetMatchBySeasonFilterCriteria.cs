namespace SabaNews.Livescore.Services.Criteria.Match;

using Fanex.Data.Repository;

public class GetMatchBySeasonFilterCriteria : CriteriaBase
{
    public long LeagueId { get; set; }
    public long SeasonId { get; set; }
    public override string GetSettingKey() => "Livescore_Match_GetBySeason_Filter";

    public override bool IsValid() => LeagueId > 0;
}