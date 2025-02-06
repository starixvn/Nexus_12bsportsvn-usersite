namespace SabaNews.Models.Posts;

using SabaNews.Models.ViewModel.Posts;
using System.Collections.Generic;

public class ApiPostDetailModel
{
    public int PostId { get; set; }
    public string Title { get; set; }
    public string PublishDate { get; set; }
    public IList<Subjects> Subjects { get; set; }
    public int EditorId { get; set; }
    public string Content { get; set; }
    public IList<string> Tags { get; set; }
    public int Category { get; set; }
    public int LikeCount { get; set; }
    public string UrlSlug { get; set; }
    public string SabaVideoContent { get; set; }
}