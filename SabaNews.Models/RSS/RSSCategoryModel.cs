namespace SabaNews.Models.RSS;

using System.Collections.Generic;
using SabaNews.Models.Posts;

public class RSSCategoryModel
{
    public IEnumerable<Post> Posts { get; set; }

    public Category Category { get; set; }

}