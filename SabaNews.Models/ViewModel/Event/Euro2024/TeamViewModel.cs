namespace SabaNews.Models.ViewModel.Event.Euro2024;

using SabaNews.Livescore.Models.Team;
using System.Collections.Generic;
public class TeamViewModel
{
    public HeaderViewModel Header { get; set; }
    public IList<TeamStage> Teams { get; set; }
}