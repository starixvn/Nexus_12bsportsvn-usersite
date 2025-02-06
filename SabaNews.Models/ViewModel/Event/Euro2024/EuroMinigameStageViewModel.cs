namespace SabaNews.Models.ViewModel.Event.Euro2024;

using SabaNews.Core.Models;
using SabaNews.Livescore.Models.Match;
using System.Collections.Generic;

public class EuroMinigameStageViewModel
{
    public HeaderViewModel Header { get; set; }
    public byte Stage { get; set; }
    public UserSession User { get; set; }
    public IList<Match> Matches { get; set; }
    public bool IsLogin { get; set; }
}