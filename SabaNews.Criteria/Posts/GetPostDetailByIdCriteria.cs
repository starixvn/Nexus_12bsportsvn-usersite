namespace SabaNews.Criteria.Posts;

using Fanex.Data.Repository;

public class GetPostDetailByIdCriteria : CriteriaBase
{
    public long PostId { get; set; }

    public override string GetSettingKey() => "post_get_by_id";

    public override bool IsValid() => PostId > 0;
}