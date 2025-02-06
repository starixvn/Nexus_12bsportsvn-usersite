namespace SabaNews.Criteria.Auth;

public class CreateSocialUserCommand : BaseNonQueryCommand
{
    public string Identifier { get; set; }

    public string DisplayName { get; set; }

    public string LastName { get; set; }

    public string FirstName { get; set; }

    public string Email { get; set; }

    public string LoginType { get; set; }

    public string Photo { get; set; }

    public int UserId { get; set; }

    public override string GetSettingKey() => "social_user_create";

    public override bool IsValid() => !string.IsNullOrEmpty(Identifier) && !string.IsNullOrEmpty(Email) && !string.IsNullOrEmpty(LoginType);
}