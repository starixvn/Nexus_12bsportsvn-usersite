namespace SabaNews.Criteria.Auth;

public class ConfirmEmailCommand : BaseNonQueryCommand
{
    public int Id { get; set; }

    public string Token { get; set; }

    public override string GetSettingKey() => "user_confirm_email";

    public override bool IsValid() => Id > 0 && !string.IsNullOrEmpty(Token);
}