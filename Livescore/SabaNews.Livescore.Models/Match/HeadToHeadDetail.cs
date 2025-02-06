namespace SabaNews.Livescore.Models.Match;

using System.Collections.Generic;

public class HeadToHeadDetail
{
    public IEnumerable<Match> Common { get; set; }

    public IEnumerable<Match> Home { get; set; }

    public IEnumerable<Match> Away { get; set; }
}