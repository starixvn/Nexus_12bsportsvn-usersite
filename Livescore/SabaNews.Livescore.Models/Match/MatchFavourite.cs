namespace SabaNews.Livescore.Models.Match;

using System.Collections.Generic;

public class MatchFavourite
{
    public IList<Match> Matches { get; set; }

    public IList<Match> LiveMatches { get; set; }
}