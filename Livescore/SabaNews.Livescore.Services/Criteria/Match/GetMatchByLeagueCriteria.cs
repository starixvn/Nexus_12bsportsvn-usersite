namespace SabaNews.Livescore.Services.Criteria.Match;

using Fanex.Data.Repository;

public class GetMatchByLeagueCriteria : CriteriaBase
{
    public long LeagueId { get; set; }
        
    public override string GetSettingKey() => "Livescore_Match_GetByLeague";

    public override bool IsValid() => LeagueId > 0;
}