namespace SabaNews.Criteria.Posts;

public class UpdateVideoViewCommand : BaseNonQueryCommand
{
    public int PostId { get; set; }

    public override string GetSettingKey() => "post_update_video_view";

    public override bool IsValid() => PostId > 0;
}