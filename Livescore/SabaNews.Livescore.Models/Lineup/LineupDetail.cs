namespace SabaNews.Livescore.Models.Lineup;

using System.Collections.Generic;

public class LineupDetail
{
    public Lineup GeneralInfo { get; set; }

    public IEnumerable<LineupTeam> Home { get; set; }

    public IEnumerable<LineupTeam> Away { get; set; }
}