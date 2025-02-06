namespace SabaNews.Criteria.User;

using Fanex.Data.Repository;
using System;

public class GetMembershipEventDataCriteria : CriteriaBase
{
    public DateTimeOffset ToDate {get;set;}

    public int Start { get; set; }

    public int End { get; set; }

    public int TotalItems { get; set; }

    public override string GetSettingKey() => "user_membership_event_get_data";

    public override bool IsValid() => true;
}