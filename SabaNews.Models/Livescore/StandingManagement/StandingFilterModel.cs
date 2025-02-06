namespace SabaNews.Models.Livescore.StandingManagement;

public class StandingFilterModel
{
    public int SeasonId { get; set; }

    public int LeagueId { get; set; }
    public int Page { get; set; }

    public int PageSize { get; set; }

    public string Search { get; set; }

    public string DateSort { get; set; }

    public int TypeSort { get; set; }
}