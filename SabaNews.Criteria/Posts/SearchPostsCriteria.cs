namespace SabaNews.Criteria.Posts;

using Fanex.Data.Repository;
using SabaNews.Core.Constants;

public class SearchPostsCriteria : CriteriaBase
{
    public string _Keyword { get; set; }

    public int _Start { get; set; }

    public int _End { get; set; }

    public int TotalItems { get; set; }

    public override string GetSettingKey() => "search_posts";

    public override bool IsValid() => !string.IsNullOrEmpty(_Keyword) && _Keyword.Length < Constants.StringLimitLength;
}