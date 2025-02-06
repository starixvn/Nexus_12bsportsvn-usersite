namespace SabaNews.Models.Livescore.StandingManagement;

using SabaNews.Livescore.Models.League;
using System.Collections.Generic;

public class StandingManageGridViewModel
{
    public IList<StandingGroupModel> Groups { get; set; }

    public long SeasonId { get; set; }

    public long LeagueId { get; set; }
}