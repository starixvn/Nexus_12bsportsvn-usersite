using SabaNews.Core.Models;
using SabaNews.Models.Posts;
using System.Collections.Generic;

namespace SabaNews.Models.ViewModel.Event.WorldCup;

public class LastestNewsViewModel
{
    public HeaderViewModel Header { get; set; }
    public IList<StandingViewModel> StandingsViewModel { get; set; }
    public IEnumerable<Post> Posts { get; set; }
    public PagingModel Paging { get; set; }
    public string CategorySlug { get; set; }
}