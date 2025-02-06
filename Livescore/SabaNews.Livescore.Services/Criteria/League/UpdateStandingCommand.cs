namespace SabaNews.Livescore.Services.Criteria.League;

using SabaNews.Core.Models;

public class UpdateStandingCommand : BaseNonQueryCommand
{
    public long SeasonId { get; set; }
    public long StageId { get; set; }
    public long TeamId { get; set; }
    public string GroupName { get; set; }
    public short? Total { get; set; }
    public short? Won { get; set; }
    public short? Loss { get; set; }
    public short? Draw { get; set; }
    public short? Points { get; set; }
    public short? Goals { get; set; }
    public short? GoalsAgainst { get; set; }
    public short? GoalDiff { get; set; }
    public override string GetSettingKey() => "Livescore_Standing_Update";
    public override bool IsValid() => SeasonId > 0;
}