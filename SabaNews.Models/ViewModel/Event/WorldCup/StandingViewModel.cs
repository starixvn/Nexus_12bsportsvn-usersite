using SabaNews.Livescore.Models.Match;
using System.Collections.Generic;

namespace SabaNews.Models.ViewModel.Event.WorldCup;

public class StandingViewModel
{
    public string GroupName { get; set; }
    public IEnumerable<SeasonStandings> Standings { get; set; }
}