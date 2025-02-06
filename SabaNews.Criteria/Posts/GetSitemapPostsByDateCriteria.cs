namespace SabaNews.Criteria.Posts;

using System;
using Fanex.Data.Repository;

public class GetSitemapPostsByDateCriteria : CriteriaBase
{
    public DateTime Date { get; set; }

    public override string GetSettingKey() => "posts_sitemap_get_by_date";

    public override bool IsValid() => true;
}