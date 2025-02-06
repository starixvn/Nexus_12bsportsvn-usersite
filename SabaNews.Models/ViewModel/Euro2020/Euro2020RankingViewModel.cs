namespace SabaNews.Models.ViewModel.Euro2020;

using System.Collections.Generic;
using SabaNews.Models.Posts;

public class Euro2020RankingViewModel
{
    public IEnumerable<Post> Posts { get; set; }
    public Post ThirdPlaceTable { get; set; }
    public Category Category { get; set; }
    public ViewData ViewData { get; set; }
}