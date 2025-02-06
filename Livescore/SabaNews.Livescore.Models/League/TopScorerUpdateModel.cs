namespace SabaNews.Livescore.Models.League;

public class TopScorerUpdateModel
{
    public long LeagueId { get; set; }
    public long SeasonId { get; set; }
    public long TeamId { get; set; }
    public int RowNum { get; set; }

}