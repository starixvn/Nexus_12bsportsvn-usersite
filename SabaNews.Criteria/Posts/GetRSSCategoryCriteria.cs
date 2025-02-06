namespace SabaNews.Criteria.Posts;

using Fanex.Data.Repository;

public class GetRSSCategoryCriteria : CriteriaBase
{
    public string Slug { get; set; }
    public override string GetSettingKey() => "rss_get_category";

    public override bool IsValid() => true;
}