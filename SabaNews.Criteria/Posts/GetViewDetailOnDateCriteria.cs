namespace SabaNews.Criteria.Posts;

using System;
using Fanex.Data.Repository;

public class GetViewDetailOnDateCriteria : CriteriaBase
{
    public DateTime? CreatedDate { get; set; }

    public bool IsVideo { get; set; }

    public int PageIndex { get; set; }

    public int PageSize { get; set; }

    public string ViewSortType { get; set; }

    public string AuthorSortType { get; set; }

    public int TotalItems { get; set; }

    public int TotalViews { get; set; }

    public override string GetSettingKey() => "post_view_detail_get";

    public override bool IsValid() => CreatedDate.HasValue;
}