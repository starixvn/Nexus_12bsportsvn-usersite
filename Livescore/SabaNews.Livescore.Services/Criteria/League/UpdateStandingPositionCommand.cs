namespace SabaNews.Livescore.Services.Criteria.League;

using SabaNews.Core.Models;

public class UpdateStandingPositionCommand : BaseNonQueryCommand
{
    public long SeasonId { get; set; }
    public long StageId { get; set; }
    public long TeamId { get; set; }
    public int Position { get; set; }
    public string OldGroupName { get; set; }
    public override string GetSettingKey() => "Livescore_Standing_UpdatePosition";
    public override bool IsValid() => SeasonId > 0;
}