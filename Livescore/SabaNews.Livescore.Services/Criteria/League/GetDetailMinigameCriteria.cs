namespace SabaNews.Livescore.Services.Criteria.League;

using Fanex.Data.Repository;

public class GetDetailMinigameCriteria : CriteriaBase
{
    public int UserId { get; set; }

    public override string GetSettingKey() => "Livescorer_Minigame_Get_Detail";

    public override bool IsValid() => true;
}