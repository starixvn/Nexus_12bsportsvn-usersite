namespace SabaNews.Criteria.Auth;

public class CreateUserSubscribeTokenCommand : BaseNonQueryCommand
{
    public int UserId { get; set; }

    public string Token { get; set; }

    public string CurrentToken { get; set; }

    public override string GetSettingKey() => "user_subscribe_create_token";

    public override bool IsValid() => UserId > 0;
}