namespace SabaNews.Criteria.Comment;

using SabaNews.Core.Models;
using System;

public class CmtCreateCommand : BaseNonQueryCommand
{
    public long CommentID { get; set; }
    public long CommentPostID { get; set; }
    public string CommentAuthor { get; set; }
    public string CommentAuthorEmail { get; set; }
    public string CommentAuthorIP { get; set; }
    public DateTimeOffset CommentDate { get; set; }
    public DateTimeOffset CommentDateGMT { get; set; }
    public string CommentContent { get; set; }
    public string CommentAgent { get; set; }
    public long CommentParent { get; set; }
    public long UserID { get; set; }

    public override string GetSettingKey() => "cmt_create";

    public override bool IsValid() => CommentPostID > 0 && UserID > 0 && !string.IsNullOrEmpty(CommentAuthorEmail) && !string.IsNullOrEmpty(CommentContent);
}