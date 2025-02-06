namespace SabaNews.Livescore.Services.Criteria.League;

using Fanex.Data.Repository;

public class GetTopScorersByRowNumCriteria : CriteriaBase
{
    public long LeagueId { get; set; }
    public long SeasonId { get; set; }
    public long RowNum { get; set; }
    public override string GetSettingKey() => "Livescore_Top_Scorers_GetByRow";

    public override bool IsValid() => true;
}