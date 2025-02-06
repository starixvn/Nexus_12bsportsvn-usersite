namespace SabaNews.Criteria.Posts;

using Fanex.Data.Repository;
using SabaNews.Core.Constants;

public class GetPostsByCateSlugsPagingCriteria : CriteriaBase
{
    public string Slug1 { get; set; }

    public string Slug2 { get; set; }

    public string Slug3 { get; set; }

    public int Start { get; set; }

    public int End { get; set; }

    public override string GetSettingKey() => "post_get_by_cate_slugs_paging";

    public override bool IsValid() => !string.IsNullOrEmpty(Slug1) && Slug1.Length < Constants.StringLimitLength;
}