using Fanex.Data.Repository;

namespace SabaNews.Criteria.Auth;

public class GetSocialUserCriteria : CriteriaBase
{
    public string Identifier { get; set; }

    public string LoginType { get; set; }

    public override string GetSettingKey() => "social_user_get_login";

    public override bool IsValid() => !string.IsNullOrEmpty(Identifier) && !string.IsNullOrEmpty(LoginType);
}