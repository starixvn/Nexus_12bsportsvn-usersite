namespace SabaNews.Criteria.Posts;

using Fanex.Data.Repository;
using System;

public class GetPostDeletedListCriteria : CriteriaBase
{
    public DateTime FromDate { get; set; }

    public override string GetSettingKey() => "post_get_deleted";

    public override bool IsValid() => true;
}