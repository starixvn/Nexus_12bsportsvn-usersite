using Fanex.Data.Repository;

namespace SabaNews.Criteria.Email;

public class GetDetailEmailDetailCriteria : CriteriaBase
{
    public int EmailId { get; set; }

    public int UserId { get; set; }


    public override string GetSettingKey() => "email_detail_get";

    public override bool IsValid() => EmailId > 0;
}