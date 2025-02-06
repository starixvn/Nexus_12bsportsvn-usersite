namespace SabaNews.Models.ViewModel.Event.WorldCup;

using SabaNews.Core.Models;
using SabaNews.Models.Posts;
using System.Collections.Generic;

public class VideoViewModel
{
    public IEnumerable<Post> Videos { get; set; }
    public HeaderViewModel Header { get; set; }
    public PagingModel Paging { get; set; }
}