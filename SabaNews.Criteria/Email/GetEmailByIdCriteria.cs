namespace SabaNews.Criteria.Email;

using Fanex.Data.Repository;

public class GetEmailByIdCriteria : CriteriaBase
{
    public int Id { get; set; }

    public override string GetSettingKey() => "email_get_by_id";

    public override bool IsValid() => Id > 0;
}