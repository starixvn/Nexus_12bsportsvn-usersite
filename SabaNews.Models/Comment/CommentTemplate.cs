namespace SabaNews.Models.Comment;

using System.Collections.Generic;

public class CommentTemplate
{
    public int TotalItems { get; set; }
    public int TotalParentCmt { get; set; }
    public IEnumerable<Comment> Comments { get; set; }
}