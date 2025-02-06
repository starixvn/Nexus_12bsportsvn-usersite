namespace SabaNews.Models.Home;

public class UpdateFixtureModel
{
    public int Id { get; set; }
    public long LeagueId { get; set; }
    public long SeasonId { get; set; }
    public int Order { get; set; }
    public bool IsFixtureOption { get; set; }
}