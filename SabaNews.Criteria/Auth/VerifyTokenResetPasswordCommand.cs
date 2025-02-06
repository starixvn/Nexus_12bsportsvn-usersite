namespace SabaNews.Criteria.Auth;

public class VerifyTokenResetPasswordCommand : BaseNonQueryCommand
{
    public int Id { get; set; }

    public string Token { get; set; }

    public override string GetSettingKey() => "user_verify_token_reset";

    public override bool IsValid() => Id > 0 && !string.IsNullOrEmpty(Token);
}