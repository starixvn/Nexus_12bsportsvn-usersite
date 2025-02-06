namespace SabaNews.Criteria.Posts;

using Fanex.Data.Repository;
using SabaNews.Core.Constants;

public class GetPostsByCateSlugNotContainChildrenCriteria : CriteriaBase
{
    public string _CategorySlug { get; set; }
    public int _Start { get; set; }
    public int _End { get; set; }
    public int TotalItems { get; set; }

    public override string GetSettingKey() => "get_posts_by_cate_slug_not_contain_children";

    public override bool IsValid() => !string.IsNullOrEmpty(_CategorySlug) && _CategorySlug.Length < Constants.StringLimitLength;
}