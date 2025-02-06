namespace SabaNews.Criteria.User;

public class UserUnsubribeCommand : BaseNonQueryCommand
{
    public int UserId { get; set; }

    public string Token { get; set; }

    public override string GetSettingKey() => "user_unsubscribe";

    public override bool IsValid() => UserId > 0;
}