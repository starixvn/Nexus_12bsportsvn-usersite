namespace SabaNews.Criteria.Posts;

using Fanex.Data.Repository;
using SabaNews.Core.Constants;

public class GetPostDetailSummaryCriteria : CriteriaBase
{
    public string Slug { get; set; }
    public string PostType { get; set; } = Constants.postType;

    public override string GetSettingKey() => "post_get_detail_summary";

    public override bool IsValid() =>  !string.IsNullOrEmpty(Slug) && Slug.Length < Constants.StringLimitLength;
}