namespace SabaNews.Models.ViewModel.Posts;

using SabaNews.Models.Posts;

public class PageViewModel
{
    public Post Post { get; set; }
    public Category Category { get; set; }
    public HeaderViewModel Header { get; set; }
}