namespace SabaNews.Livescore.Services.Criteria.Team;

using System;
using SabaNews.Core.Models;

public class CreateTeamPlayerCommand : BaseNonQueryCommand
{
    public long TeamId { get; set; }
    public string PlayerName { get; set; }
    public string PlayerFullName { get; set; }
    public DateTime Birthday { get; set; }
    public string ShirtNumber { get; set; }
    public string Club { get; set; }
    public int Position { get; set; }
    public string Icon { get; set; }

    public override string GetSettingKey() => "Livescore_PlayerCustom_Create";

    public override bool IsValid() => TeamId > 0;
}