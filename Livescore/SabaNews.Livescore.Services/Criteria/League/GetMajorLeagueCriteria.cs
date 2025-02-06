namespace SabaNews.Livescore.Services.Criteria.League;

using Fanex.Data.Repository;

public class GetMajorLeagueCriteria : CriteriaBase
{
    public override string GetSettingKey() => "Livescore_League_GetMajorLeague";

    public override bool IsValid() => true;
}