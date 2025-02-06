namespace SabaNews.Livescore.Models.League;

public class TopScorers
{
    public long LeagueId { get; set; }
    public long SeasonId { get; set; }
    public long PlayerId { get; set; }
    public long TeamId { get; set; }
    public int Goals { get; set; }
    public int Assists { get; set; }
    public int RowNum { get; set; }
    public int Top { get; set; }
    public string TeamLogo { get; set; }
    public string TeamLogoVN { get; set; }
    public string TeamNameEN { get; set; }
    public string TeamFullNameEN { get; set; }
    public string TeamNameVN { get; set; }
    public string PlayerNameEN { get; set; }
    public string PlayerFullNameEN { get; set; }

}