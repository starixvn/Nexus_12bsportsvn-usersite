namespace SabaNews.Criteria.Email;

using Fanex.Data.Repository;

public class GetEmailForSendCriteria : CriteriaBase
{
    public int EmailId { get; set; }

    public override string GetSettingKey() => "email_get_for_send";

    public override bool IsValid() => EmailId > 0;
}