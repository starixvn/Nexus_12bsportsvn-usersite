namespace SabaNews.Models.Posts;

public class GetPostsByCateSlugsParam
{
    public string Slug1 { get; set; }

    public string Slug2 { get; set; }

    public string Slug3 { get; set; }

    public int Page { get; set; }
}