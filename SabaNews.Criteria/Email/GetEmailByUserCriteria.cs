namespace SabaNews.Criteria.Email;

using Fanex.Data.Repository;

public class GetEmailByUserCriteria : CriteriaBase
{
    public int UserId { get; set; }

    public string Search { get; set; }

    public int Start { get; set; }

    public int End { get; set; }

    public int TotalItems { get; set; }

    public override string GetSettingKey() => "email_get_by_user";

    public override bool IsValid() => true;
}