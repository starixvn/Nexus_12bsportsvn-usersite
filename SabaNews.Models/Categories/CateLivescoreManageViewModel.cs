namespace SabaNews.Models.Categories;

using System.Collections.Generic;
using SabaNews.Livescore.Models.League;

public class CateLivescoreManageViewModel
{
    public IEnumerable<Menu> Menus { get; set; }

    public IList<CateLivescore> Cates { get; set; }

    public IList<League> Leagues { get; set; }

}