namespace SabaNews.Models.ViewModel.User;

using SabaNews.Livescore.Models.Match;
using SabaNews.Models.Event.WorldCup;
using System.Collections.Generic;

public class ManagementDetailMinigameViewModel
{
    public byte StageDetail { get; set; }
    public long UserId { get; set; }
    public long Totalpoint { get; set; }
    public long Rank { get; set; }
    public string Username { get; set; }
    public string Email { get; set; }
    public IList<UserMinigameModel> Votes { get; set; }
    public IList<Match> Matches { get; set; }
    public IList<Match> MatchesRoundEightTeam { get; set; }
    public IList<Match> MatchesRoundQuarterfinals { get; set; }
    public IList<Match> MatchesRoundSemifinal { get; set; }
    public IList<Match> MatchesRoundThirdPlace { get; set; }
    public IList<Match> MatchesRoundFinal { get; set; }
    public IList<SeasonStandings> Teams { get; set; }
}