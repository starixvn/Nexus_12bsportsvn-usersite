namespace SabaNews.Models.ViewModel.Posts;

using SabaNews.Core.Models;
using SabaNews.Models.Posts;
using System.Collections.Generic;

public class CategoryViewModel
{
    public IEnumerable<Post> Posts { get; set; }
    public Category Category { get; set; }
    public HeaderViewModel Header { get; set; }
    public PagingModel Paging { get; set; }
    public IEnumerable<Menu> Menus { get; set; }
}