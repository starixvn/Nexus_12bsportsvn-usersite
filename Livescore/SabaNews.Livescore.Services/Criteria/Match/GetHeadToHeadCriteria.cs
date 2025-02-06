namespace SabaNews.Livescore.Services.Criteria.Match;

using Fanex.Data.Repository;

public class GetHeadToHeadCriteria : CriteriaBase
{
    public long MatchId { get; set; }

    public override string GetSettingKey() => "Livescore_Match_GetHeadToHead";

    public override bool IsValid() => MatchId > 0;
}