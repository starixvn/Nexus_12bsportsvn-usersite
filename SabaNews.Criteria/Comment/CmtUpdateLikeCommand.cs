namespace SabaNews.Criteria.Comment;

using SabaNews.Core.Models;

public class CmtUpdateLikeCommand : BaseNonQueryCommand
{
    public long CommentID { get; set; }
    public long CommentLikeCount { get; set; }
    public string CommentLikeIPs { get; set; }
    public string CommentLikeUsers { get; set; }
    public override string GetSettingKey() => "cmt_update_like";

    public override bool IsValid() => CommentID > 0;
}