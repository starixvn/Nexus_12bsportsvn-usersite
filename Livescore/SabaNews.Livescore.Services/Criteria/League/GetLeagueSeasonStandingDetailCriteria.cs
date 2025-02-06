namespace SabaNews.Livescore.Services.Criteria.League;

using Fanex.Data.Repository;

public class GetLeagueSeasonStandingDetailCriteria : CriteriaBase
{
    public long SeasonId { get; set; }
    public long StageId { get; set; }
    public long TeamId { get; set; }
    public override string GetSettingKey() => "Livescore_League_GetSeasonStanding_Detail";

    public override bool IsValid() => true;
}