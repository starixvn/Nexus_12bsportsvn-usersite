namespace SabaNews.Livescore.Services.Criteria.League;

using Fanex.Data.Repository;
using System;

public class GetDataMinigameCriteria : CriteriaBase
{
    public DateTime ToDate { get; set; }
    public int Start { get; set; }
    public int End { get; set; }
    public int TotalItems { get; set; }

    public override string GetSettingKey() => "Livescorer_Minigame_Get_Data";

    public override bool IsValid() => true;
}