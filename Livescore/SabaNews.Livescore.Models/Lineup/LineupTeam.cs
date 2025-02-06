namespace SabaNews.Livescore.Models.Lineup;

public class LineupTeam
{
    public long MatchId { get; set; }
    public long TeamId { get; set; }
    public long PlayerId { get; set; }
    public string PlayerName { get; set; }
    public short IsSubstitute { get; set; }
    public int PlayerNumber { get; set; }
    public int Position { get; set; }
    public int CoordinateX { get; set; }
    public int CoordinateY { get; set; }
    public string Role { get; set; }
}