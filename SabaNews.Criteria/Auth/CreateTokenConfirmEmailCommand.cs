namespace SabaNews.Criteria.Auth;

public class CreateTokenConfirmEmailCommand : BaseNonQueryCommand
{
    public string Email { get; set; }

    public string Token { get; set; }

    public long UserId { get; set; }

    public override string GetSettingKey() => "user_create_token_confirm";

    public override bool IsValid() => !string.IsNullOrEmpty(Email) && !string.IsNullOrEmpty(Token);
}