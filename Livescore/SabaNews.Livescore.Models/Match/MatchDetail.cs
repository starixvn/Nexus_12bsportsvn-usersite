namespace SabaNews.Livescore.Models.Match;

using System.Collections.Generic;
using SabaNews.Livescore.Models.Lineup;

public class MatchDetail
{
    public Match GeneralInfo { get; set; }
    public Statistic Statistic { get; set; }
    public IEnumerable<MatchIncident> Incidents { get; set; }
    public LineupDetail Lineup { get; set; }
    public HeadToHeadDetail HeadToHead { get; set; }
}