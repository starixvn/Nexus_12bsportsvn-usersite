namespace SabaNews.Criteria.User;

using Fanex.Data.Repository;

public class GetAllUserCriteria : CriteriaBase
{
    public string UserRole { get; set; }

    public override string GetSettingKey() => "user_get_all";

    public override bool IsValid() => true;
}