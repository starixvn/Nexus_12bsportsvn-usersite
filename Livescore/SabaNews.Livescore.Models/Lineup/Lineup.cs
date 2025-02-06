namespace SabaNews.Livescore.Models.Lineup;

public class Lineup
{
    public long MatchId { get; set; }
    public string HomeFormation { get; set; }
    public string AwayFormation { get; set; }
    public string HomeCoach { get; set; }
    public string AwayCoach { get; set; }
}