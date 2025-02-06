namespace SabaNews.Criteria;

using Fanex.Data.Repository;

public class GetSitemapDataCriteria : CriteriaBase
{
    public override string GetSettingKey() => "get_sitemap";

    public override bool IsValid() => true;
}