namespace SabaNews.Criteria;

using Fanex.Data.Repository;

public class GetRSSCriteria : CriteriaBase
{
    public override string GetSettingKey() => "get_rss";

    public override bool IsValid() => true;
}