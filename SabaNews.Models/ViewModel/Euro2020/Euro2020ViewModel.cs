namespace SabaNews.Models.ViewModel.Euro2020;

using System.Collections.Generic;
using SabaNews.Models.Posts;

public class Euro2020ViewModel
{
    public IEnumerable<Post> HotNews { get; set; }
    public IEnumerable<Post> Videos { get; set; }
    public Post TotalRanking { get; set; }
    public IEnumerable<Post> Ranking { get; set; }
    public IEnumerable<Post> Identify { get; set; }
    public Category Category { get; set; }
    public ViewData ViewData { get; set; }
}