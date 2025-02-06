namespace SabaNews.Criteria.Posts;

using Fanex.Data.Repository;

public class GetPostsByAuthorCriteria : CriteriaBase
{
    public long AuthorId { get; set; }
    public int Start { get; set; }
    public int End { get; set; }
    public int TotalItems { get; set; }

    public override string GetSettingKey() => "post_get_by_author";

    public override bool IsValid() => AuthorId > 0;
}