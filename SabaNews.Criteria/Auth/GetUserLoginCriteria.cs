namespace SabaNews.Criteria.Auth;

using Fanex.Data.Repository;

public class GetUserLoginCriteria : CriteriaBase
{
    public string Email { get; set; }

    public override string GetSettingKey() => "user_get_login";

    public override bool IsValid() => !string.IsNullOrEmpty(Email);
}