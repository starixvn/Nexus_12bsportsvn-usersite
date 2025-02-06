namespace SabaNews.Livescore.Services.Criteria.Match;

using Fanex.Data.Repository;

public class GetMatchIncidentCriteria : CriteriaBase
{
    public long MatchId { get; set; }

    public override string GetSettingKey() => "Livescore_Match_GetIncident";

    public override bool IsValid() => MatchId > 0;
}