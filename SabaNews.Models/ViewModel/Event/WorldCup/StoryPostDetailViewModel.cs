namespace SabaNews.Models.ViewModel.Event.WorldCup;

using SabaNews.Models.Posts;
using SabaNews.Models.StoryPost;
using System.Collections.Generic;

public class StoryPostDetailViewModel
{
    public Post Post { get; set; }

    public List<StoryPostModel> Stories { get; set; }

    public string BaseUrl { get; set; }

    public string BackUrl { get; set; }

    public string Slug { get; set; }

}