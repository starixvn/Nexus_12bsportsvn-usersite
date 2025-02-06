namespace SabaNews.Models.Home;

using SabaNews.Livescore.Models.League;
using System.Collections.Generic;

public class FixtureEditViewModel
{
    public League League { get; set; }
    public IList<Season> Seasons { get; set; }
    public FixtureHomepage Fixture { get; set; }
    public int MaxPriority { get; set; }
}