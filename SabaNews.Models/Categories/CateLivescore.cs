namespace SabaNews.Models.Categories;

public class CateLivescore
{
    public int CateId { get; set; }
    public string Slug { get; set; }
    public string Name { get; set; }

    public int Status { get; set; }
    public long LeagueId { get; set; }
    public string LeagueNameEN { get; set; }
    public string CountryIconVN { get; set; }
    public string LeagueFullNameEN { get; set; }
    public string CountryLogo { get; set; }
    public string LeagueNameVN { get; set; }
    public string Icon { get; set; }
    public string IconVN { get; set; }
    public long? CurrentSeasonId { get; set; }
    public long CurrentStageId { get; set; }

}