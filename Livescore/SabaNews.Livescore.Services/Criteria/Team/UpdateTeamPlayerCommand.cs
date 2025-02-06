namespace SabaNews.Livescore.Services.Criteria.Team;

using System;
using SabaNews.Core.Models;

public class UpdateTeamPlayerCommand : BaseNonQueryCommand
{
    public long PlayerId { get; set; }
    public string PlayerName { get; set; }
    public string PlayerFullName { get; set; }
    public DateTime Birthday { get; set; }
    public string ShirtNumber { get; set; }
    public string Club { get; set; }
    public int Position { get; set; }
    public string Icon { get; set; }

    public override string GetSettingKey() => "Livescore_PlayerCustom_Update";

    public override bool IsValid() => PlayerId > 0;
}