namespace SabaNews.Livescore.Services.Criteria.Match;

using Fanex.Data.Repository;

public class GetMatchLineupCriteria : CriteriaBase
{
    public long MatchId { get; set; }

    public override string GetSettingKey() => "Livescore_Match_GetLineup";

    public override bool IsValid() => MatchId > 0;
}