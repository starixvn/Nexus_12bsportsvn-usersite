namespace SabaNews.Criteria.Posts;

using Fanex.Data.Repository;

public class GetRSSRecentCriteria : CriteriaBase
{
    public override string GetSettingKey() => "rss_get_recent";

    public override bool IsValid() => true;
}