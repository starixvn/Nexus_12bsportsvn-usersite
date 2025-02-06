namespace SabaNews.Livescore.Services.Criteria.Team;

using Fanex.Data.Repository;

public class GetTeamByStageCriteria : CriteriaBase
{
    public long SeasonId { get; set; }

    public long StageId { get; set; }

    public override string GetSettingKey() => "Livescore_Team_GetByStage";

    public override bool IsValid() => StageId > 0;
}