namespace SabaNews.Livescore.Models.League;

using SabaNews.Livescore.Models.Match;
using System.Collections.Generic;

public class StandingGroupModel
{
    public string GroupName { get; set; }
    public IEnumerable<SeasonStandings> Standings { get; set; }
}