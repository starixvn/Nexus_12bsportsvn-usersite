namespace SabaNews.Models.ViewModel.Event.Euro2024;

using SabaNews.Core.Models;
using System.Collections.Generic;
using Minigame;

public class AdminMinigameGridViewModel
{
    public IList<MinigameModel> MiniGames { get; set; }
    public PagingModel Paging { get; set; }
    public string DateSort { get; set; }
}