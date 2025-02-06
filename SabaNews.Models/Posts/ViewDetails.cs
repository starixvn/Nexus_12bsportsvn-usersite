namespace SabaNews.Models.Posts;

using System;

public class ViewDetails
{
    public int PostId { get; set; }

    public string Title { get; set; }

    public string Slug { get; set; }

    public string Author { get; set; }

    public DateTime CreatedDate { get; set; }

    public int TotalViews { get; set; }
}