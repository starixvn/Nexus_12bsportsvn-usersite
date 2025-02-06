namespace SabaNews.Models.Posts;

using System;
using System.Globalization;

public class GetData
{
    public int PostId { get; set; }
    public string Title { get; set; }
    public string PublishDate{ get ; set; }
    public string Image { get; set; }
    public int Timestamp => (int)(DateTime.Parse(PublishDate, CultureInfo.InvariantCulture) - DateTimeOffset.UnixEpoch.ToLocalTime()).TotalSeconds;
    public int Category { get; set; }
    public void FormatDate()
    {
        PublishDate = DateTime.Parse(PublishDate, CultureInfo.InvariantCulture).ToString("yyyy-MM-ddTHH:mm:ss.fffZ");
    }
}