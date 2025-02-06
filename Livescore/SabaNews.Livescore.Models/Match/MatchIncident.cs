namespace SabaNews.Livescore.Models.Match;

public class MatchIncident
{
    public long MatchId { get; set; }
    public short Type { get; set; }
    public short Position { get; set; }
    public short Time { get; set; }
    public int Second { get; set; }
    public short HomeScore { get; set; }
    public short AwayScore { get; set; }
    public long PlayerId { get; set; }
    public string PlayerName { get; set; }
    public string Content { get; set; }
    public short VarReason { get; set; }
    public short VarResult { get; set; }
    public short ReasonType { get; set; }
    public long AssistId { get; set; }
    public string AssistName { get; set; }
    public long InPlayerId { get; set; }
    public string InPlayerName { get; set; }
    public long OutPlayerId { get; set; }
    public string OutPlayerName { get; set; 
    }
}