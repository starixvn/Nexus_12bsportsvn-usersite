namespace SabaNews.Models.Livescore.MatchManagement;

using SabaNews.Livescore.Models.League;
using System.Collections.Generic;

public class MatchManageModel
{
    public long LeagueId { get; set; }

    public long SeasonId { get; set; }

    public IList<League> Leagues { get; set; }
}