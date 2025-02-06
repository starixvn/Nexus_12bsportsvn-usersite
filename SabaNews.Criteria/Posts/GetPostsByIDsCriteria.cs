using Fanex.Data.Repository;

namespace SabaNews.Criteria.Posts;

public  class GetPostsByIDsCriteria : CriteriaBase
{
    public string IDs { get; set; }

    public override string GetSettingKey() => "get_posts_by_ids";

    public override bool IsValid() => true;
}