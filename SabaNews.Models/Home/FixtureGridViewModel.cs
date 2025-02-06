namespace SabaNews.Models.Home;

using SabaNews.Livescore.Models.League;
using System.Collections.Generic;

public class FixtureGridViewModel
{
    public IList<League> Leagues { get; set; }

    public List<FixtureHomepage> ListFixture { get; set; }
}