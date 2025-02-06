namespace SabaNews.Criteria.Posts;

using System;
using Fanex.Data.Repository;

public class GetPostViewStatiscticCriteria : CriteriaBase
{
    public DateTime FromDate { get; set; }

    public DateTime ToDate { get; set; }

    public override string GetSettingKey() => "post_view_statistic_get";

    public override bool IsValid() => ToDate >= FromDate;
}