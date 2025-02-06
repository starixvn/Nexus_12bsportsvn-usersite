namespace SabaNews.Livescore.Services.Criteria.Match;

using Fanex.Data.Repository;

public class GetLiveMatchCriteria : CriteriaBase
{
    public override string GetSettingKey() => "Livescore_Match_GetLiveMatch";

    public override bool IsValid() => true;
}