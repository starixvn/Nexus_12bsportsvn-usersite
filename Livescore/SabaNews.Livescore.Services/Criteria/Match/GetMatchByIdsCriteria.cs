namespace SabaNews.Livescore.Services.Criteria.Match;

using Fanex.Data.Repository;

public class GetMatchByIdsCriteria : CriteriaBase
{
    public string MatchIds { get; set; }

    public override string GetSettingKey() => "Livescore_Match_GetByIds";

    public override bool IsValid() => true;
}