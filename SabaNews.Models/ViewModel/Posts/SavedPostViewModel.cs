namespace SabaNews.Models.ViewModel.Posts;

using SabaNews.Core.Models;
using SabaNews.Models.Posts;
using System.Collections.Generic;

public class SavedPostViewModel
{
    public IEnumerable<Post> Posts { get; set; }

    public SavePost ToDayPost { get; set; }

    public UserSession User { get; set; }

    public string Title { get; set; }

    public string Page { get; set; }

}