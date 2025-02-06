namespace SabaNews.Models.ViewModel.Posts;

using SabaNews.Core.Models;
using SabaNews.Models.Categories;
using SabaNews.Models.Posts;
using System.Collections.Generic;

public class SingleViewModel
{
    public Post SinglePost { get; set; }
    public IEnumerable<Post> RelatedPosts { get; set; }
    public IEnumerable<Post> RecentPosts { get; set; }
    public ViewData ViewData { get; set; }
    public IList<CategoryGeneral> CateParents { get; set; }
    public bool IsLogin { get; set; }
    public SavePost SavePost { get; set; }
    public string AbsoluteUrl { get; set; }
    public bool IsVideo { get; set; }
    public CateInfo CateInfo { get; set; }
    public string CateSlug { get; set; }
    public string CateName { get; set; }
    public string CateUrl { get; set; }
    public string CateParent { get; set; }
    public string MatchId { get; set; }
    public string DomainUrl { get; set; }
    public bool IsIndex { get; set;}
}