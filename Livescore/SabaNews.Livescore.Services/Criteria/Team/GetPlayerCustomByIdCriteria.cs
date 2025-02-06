namespace SabaNews.Livescore.Services.Criteria.Team;

using Fanex.Data.Repository;

public class GetPlayerCustomByIdCriteria : CriteriaBase
{
    public long PlayerId { get; set; }

    public override string GetSettingKey() => "Livescore_PlayerCustom_GetById";

    public override bool IsValid() => PlayerId > 0;
}