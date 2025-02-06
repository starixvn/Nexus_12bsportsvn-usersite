namespace SabaNews.Criteria.User;

using Fanex.Data.Repository;
using System;

public class GetMembershipEventResultCriteria : CriteriaBase
{
    public int ResultNumber { get; set; }

    public DateTimeOffset ToDate { get; set; }

    public int Start { get; set; }

    public int End { get; set; }

    public override string GetSettingKey() => "user_membership_event_get_result";

    public override bool IsValid() => true;
}