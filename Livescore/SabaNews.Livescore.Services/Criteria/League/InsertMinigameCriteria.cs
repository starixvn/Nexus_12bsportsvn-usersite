namespace SabaNews.Livescore.Services.Criteria.League;

using SabaNews.Core.Models;
using System;

public class InsertMinigameCriteria : BaseNonQueryCommand
{
    public long UserId { get; set; }
    public string LuckyNumber { get; set; }
    public DateTime JoinDate { get; set; }
    public long TeamId { get; set; }
    public override string GetSettingKey() => "Livescorer_Minigame_Create";
    public override bool IsValid() => true;
}