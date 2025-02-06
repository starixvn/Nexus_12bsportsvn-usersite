namespace SabaNews.Models.ViewModel.User;

public class ManagementLeagueFilterModel
{
    public int Page { get; set; }

    public int PageSize { get; set; }

    public string Search { get; set; }

    public string DateSort { get; set; }

    public int IsMajor { get; set; }

    public int TypeSort { get; set; }
}