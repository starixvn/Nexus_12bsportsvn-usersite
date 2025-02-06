namespace SabaNews.Livescore.Models.Match;

using System.Collections.Generic;
using SabaNews.Livescore.Models.League;

public class MatchLeague
{
    public IList<Match> Matches { get; set; }

    public League League { get; set; }
}