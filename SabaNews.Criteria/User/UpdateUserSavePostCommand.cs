namespace SabaNews.Criteria.User;

public class UpdateUserSavePostCommand : BaseNonQueryCommand
{
    public int UserID { get; set; }
    public string ListPosts { get; set; }

    public override string GetSettingKey() => "user_save_post";

    public override bool IsValid() => UserID > 0;
}