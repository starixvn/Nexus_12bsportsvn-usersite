namespace SabaNews.Criteria.User;

using Fanex.Data.Repository;

public class GetUserForSendEmailCriteria : CriteriaBase
{
    public override string GetSettingKey() => "user_get_for_send_email";

    public override bool IsValid() => true;
}