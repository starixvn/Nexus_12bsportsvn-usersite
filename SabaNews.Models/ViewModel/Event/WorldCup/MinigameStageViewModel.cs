namespace SabaNews.Models.ViewModel.Event.WorldCup;

using SabaNews.Core.Models;
using SabaNews.Livescore.Models.Match;
using System.Collections.Generic;

public class MinigameStageViewModel
{
    public HeaderViewModel Header { get; set; }
    public byte Stage { get; set; }
    public UserSession User { get; set; }
    public IList<Match> Matches { get; set; }
    public bool IsLogin { get; set; }
}