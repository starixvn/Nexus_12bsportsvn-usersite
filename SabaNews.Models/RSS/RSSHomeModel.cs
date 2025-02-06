namespace SabaNews.Models.RSS;

using System.Collections.Generic;

public class RSSHomeModel
{
    public IEnumerable<Menu> Menus { get; set; }

    public string BaseUrl { get; set; }


}