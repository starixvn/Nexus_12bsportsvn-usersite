namespace SabaNews.Livescore.Services.Criteria.Team;

using SabaNews.Core.Models;

public class DeleteTeamPlayerCommand : BaseNonQueryCommand
{
    public long PlayerId { get; set; }

    public override string GetSettingKey() => "Livescore_PlayerCustom_Delete";

    public override bool IsValid() => PlayerId > 0;
}