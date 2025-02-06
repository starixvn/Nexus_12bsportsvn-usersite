namespace SabaNews.Criteria.Auth;

public class ResetPasswordCommand : BaseNonQueryCommand
{
    public int Id { get; set; }

    public string _Password { get; set; }

    public string Token { get; set; }

    public override string GetSettingKey() => "user_reset_password";

    public override bool IsValid() => true;
}