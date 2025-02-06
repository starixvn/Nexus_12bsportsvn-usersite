namespace SabaNews.Core.Models;

public class LivescoreMainPageCacheConfig
{
    public bool Enabled { get; set; }
    public byte DateRange { get; set; }
    public byte OutOfRangeTimeout { get; set; }
}