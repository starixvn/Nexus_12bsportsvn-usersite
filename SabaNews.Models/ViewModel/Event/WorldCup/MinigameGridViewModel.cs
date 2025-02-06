namespace SabaNews.Models.ViewModel.Event.WorldCup;

using SabaNews.Core.Models;
using SabaNews.Models.Event.WorldCup;
using System.Collections.Generic;

public class MinigameGridViewModel
{
    public IList<UserMinigameModel> MiniGames { get; set; }
    public PagingModel Paging { get; set; }
}