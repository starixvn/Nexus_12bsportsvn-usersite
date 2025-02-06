namespace SabaNews.Livescore.Services.Criteria.League;

using SabaNews.Core.Models;

public class UpdateLeagueCriteria : BaseNonQueryCommand
{
    public long LeagueId { get; set; }
    public string LeagueNameVN { get; set; }
    public string CountryVN { get; set; }
    public string CountryIconVN { get; set; }
    public string IconVN { get; set; }
    public override string GetSettingKey() => "Livescore_League_Update";
    public override bool IsValid() => true;
}