namespace SabaNews.Models.ViewModel.Event.Euro2024;

using SabaNews.Core.Models;
using SabaNews.Livescore.Models.Match;
using System.Collections.Generic;
using Minigame;

public class EuroMinigameViewModel
{
    public HeaderViewModel Header { get; set; }

    public IList<Match> Matches { get; set; }

    public IList<MinigameModel> Votes { get; set; }

    public UserSession User { get; set; }

    public bool IsLogin { get; set; }

    public bool IsAdmin { get; set; }

    public string BaseUrl { get; set; }
    public string UserId { get; set; }

}