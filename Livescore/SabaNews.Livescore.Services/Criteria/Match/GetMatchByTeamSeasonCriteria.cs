namespace SabaNews.Livescore.Services.Criteria.Match;

using Fanex.Data.Repository;

public class GetMatchByTeamSeasonCriteria : CriteriaBase
{
    public long TeamId { get; set; }

    public long LeagueId { get; set; }

    public long SeasonId { get; set; }

    public override string GetSettingKey() => "Livescore_Match_GetByTeamSeason";

    public override bool IsValid() => TeamId > 0 && LeagueId > 0 ;
}