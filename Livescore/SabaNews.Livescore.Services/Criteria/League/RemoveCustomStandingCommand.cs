namespace SabaNews.Livescore.Services.Criteria.League;

using SabaNews.Core.Models;

public class RemoveCustomStandingCommand : BaseNonQueryCommand
{
    public long SeasonId { get; set; }
    public override string GetSettingKey() => "Livescore_Standing_RemoveCustom";
    public override bool IsValid() => SeasonId > 0;
}