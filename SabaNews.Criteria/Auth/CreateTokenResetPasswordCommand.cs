namespace SabaNews.Criteria.Auth;

public class CreateTokenResetPasswordCommand : BaseNonQueryCommand
{
    public string Email { get; set; }

    public string Token { get; set; }
    public override string GetSettingKey() => "user_create_token_reset";
    public override bool IsValid() => !string.IsNullOrEmpty(Email) && !string.IsNullOrEmpty(Token);

}