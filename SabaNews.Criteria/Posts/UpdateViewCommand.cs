namespace SabaNews.Criteria.Posts;

public class UpdateViewCommand : BaseNonQueryCommand
{
    public int PostId { get; set; }

    public bool IsVideoPost { get; set; }

    public override string GetSettingKey() => "post_update_view";

    public override bool IsValid() => PostId > 0;
}