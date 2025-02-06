namespace SabaNews.Models.ViewModel.Event.WorldCup;

using SabaNews.Core.Models;
using SabaNews.Livescore.Models.Match;
using SabaNews.Models.Event.WorldCup;
using System.Collections.Generic;

public class MinigameViewModel
{
    public HeaderViewModel Header { get; set; }

    public IList<Match> Matches { get; set; }

    public IList<UserMinigameModel> Votes { get; set; }

    public UserSession User { get; set; }

    public bool IsLogin { get; set; }

    public bool IsAdmin { get; set; }

    public string BaseUrl { get; set; }
    public string UserId { get; set; }

}