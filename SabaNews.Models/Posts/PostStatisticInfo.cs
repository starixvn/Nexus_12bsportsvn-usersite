namespace SabaNews.Models.Posts;

using System;

public class PostStatisticInfo
{
    public DateTime PostDate { get; set; }

    public int PostCount { get; set; }

    public int PostView { get; set; }

    public int VideoCount { get; set; }

    public int VideoView { get; set; }
}