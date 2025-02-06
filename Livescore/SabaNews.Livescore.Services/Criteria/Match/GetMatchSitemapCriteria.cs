namespace SabaNews.Livescore.Services.Criteria.Match;

using Fanex.Data.Repository;

public class GetMatchSitemapCriteria : CriteriaBase
{
    public override string GetSettingKey() => "Livescore_Match_GetSitemap";

    public override bool IsValid() => true;
}