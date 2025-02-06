namespace SabaNews.Criteria.User;

public class SocialDisconnectTypeCommand : BaseNonQueryCommand
{
    public int UserId { get; set; }
    public string LoginType { get; set; }
    public string NewLoginType { get; set; }
    public override string GetSettingKey() => "social_disconnect_type";

    public override bool IsValid() => UserId > 0;
}