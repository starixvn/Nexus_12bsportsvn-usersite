namespace SabaNews.Criteria.Posts;

using Fanex.Data.Repository;

public class GetPostDetailContentCriteria : CriteriaBase
{
    public int _postId { get; set; }

    public override string GetSettingKey() => "get_post_detail_by_postid";

    public override bool IsValid() => true;
}