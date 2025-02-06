namespace SabaNews.Criteria.User;

using Fanex.Data.Repository;

public class GetDetailMembershipEventCriteria : CriteriaBase
{
    public int UserId { get; set; }

    public override string GetSettingKey() => "user_membership_event_get_detail";

    public override bool IsValid() => true;
}