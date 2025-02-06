namespace SabaNews.Models.ViewModel.Event.Euro2024;

using SabaNews.Livescore.Models.Match;
using System.Collections.Generic;
using Minigame;

public class AdminDetailMinigameViewModel
{
    public byte StageDetail { get; set; }
    public long UserId { get; set; }
    public long Totalpoint { get; set; }
    public long Rank { get; set; }
    public string Username { get; set; }
    public string Email { get; set; }
    public IList<MinigameModel> Votes { get; set; }
    public IList<Match> Matches { get; set; }
    public IList<SeasonStandings> Teams { get; set; }
}