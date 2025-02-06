namespace SabaNews.Criteria.Minigame;

using Fanex.Data.Repository;

public class GetLeagueMinigameByUserCriteria : CriteriaBase
{
    public long UserId { get; set; }
    public long LeagueId { get; set; }
    public long SeasonId { get; set;}

    public override string GetSettingKey() => "minigame_League_getByUser";

    public override bool IsValid() => UserId > 0  && LeagueId > 0 && SeasonId > 0;
}