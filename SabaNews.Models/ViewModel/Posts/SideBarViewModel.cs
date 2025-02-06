namespace SabaNews.Models.ViewModel.Posts;

using SabaNews.Models.Posts;
using System.Collections.Generic;
public class SideBarViewModel
{
    public IEnumerable<Post> Posts { get; set; }
    public bool IsMostViewPosts { get; set; }
}