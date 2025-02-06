namespace SabaNews.Livescore.Services.Criteria.League;

using Fanex.Data.Repository;

public class GetPlayerByTeamIdCriteria : CriteriaBase
{
    public long TeamId { get; set; }
    public override string GetSettingKey() => "Livescore_Player_GetByTeamId";
    public override bool IsValid() => true;
}